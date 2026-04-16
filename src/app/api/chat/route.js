import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText, convertToModelMessages, embed, smoothStream } from 'ai';
import { z } from 'zod';

import { sql } from 'drizzle-orm';
import db from '../../../lib/db/index';
import { chunks } from '../../../lib/db/schema';
import { enforceRateLimit } from '../../../lib/rateLimit';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL_NAME = 'google/gemini-3.1-flash-lite-preview';

// ── Allowed origins ──────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://sidmirza.com',
  'https://www.sidmirza.com',
  'http://localhost:3000',
  'http://localhost:3001',
];

// ── Input schema ─────────────────────────────────────────────────────────────
const MessagePartSchema = z.object({
  type: z.string(),
  text: z.string().max(400),
});

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(400).optional(),
  text: z.string().max(400).optional(),
  parts: z.array(MessagePartSchema).max(5).optional(),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(8),
});

// ── Helpers ───────────────────────────────────────────────────────────────────
async function getSimilarChunks(queryEmbedding, topN = 5) {
  try {
    const embeddingString = `[${queryEmbedding.join(',')}]`;
    const result = await db.execute(sql`
      SELECT content, embedding <-> ${embeddingString}::vector AS distance
      FROM ${chunks}
      ORDER BY embedding <-> ${embeddingString}::vector
      LIMIT ${topN};
    `);
    return result.rows.map((r) => r.content);
  } catch (err) {
    console.error('❌ Database similarity search failed:', err);
    throw new Error('Database similarity search failed');
  }
}

async function getQueryEmbedding(text) {
  const { embedding } = await embed({
    model: openrouter.textEmbeddingModel('openai/text-embedding-3-small'),
    value: text,
  });
  return embedding;
}

function getClientIp(req) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req) {
  // 1. Origin / Referer check
  const origin = req.headers.get('origin') || req.headers.get('referer') || '';
  const isAllowedOrigin = ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));

  if (!isAllowedOrigin) {
    console.warn(`🚫 Blocked request from origin: ${origin}`);
    return new Response(JSON.stringify({ error: 'Forbidden.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Rate limiting
  const ip = getClientIp(req);
  const rateLimit = await enforceRateLimit(ip);

  if (!rateLimit.allowed) {
    console.warn(`⏱️ Rate limited IP: ${ip} — ${rateLimit.reason}`);
    return new Response(JSON.stringify({ error: rateLimit.reason }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(rateLimit.retryAfter),
        'X-RateLimit-Remaining': '0',
      },
    });
  }

  // 3. Validate & parse request body
  let messages;
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid request format.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    messages = parsed.data.messages;
  } catch {
    return new Response(JSON.stringify({ error: 'Malformed request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. Extract query text
  const lastMessage = messages[messages.length - 1];
  const queryText = lastMessage.parts?.[0]?.text || lastMessage.content || lastMessage.text || '';

  if (!queryText.trim()) {
    return new Response(JSON.stringify({ error: 'No message text provided.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const queryEmbedding = await getQueryEmbedding(queryText);
    const topChunks = await getSimilarChunks(queryEmbedding, 3);

    if (topChunks.length === 0) {
      return new Response(JSON.stringify({ error: 'No relevant information found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const contextText = topChunks.join('\n\n');

    const systemMessage = {
      role: 'system',
      parts: [
        {
          type: 'text',
          text: `You are an AI assistant representing Shahid, a fullstack engineer with strong experience in React, Next.js, Node.js, AI systems, automation, and scalable web applications.
            You answer questions about Shahid's experience, skills, and projects in a clear, confident, and natural tone.

            Context:
            ${contextText}

            Rules:
            - Do NOT speak in first person. Refer to Shahid in third person.
            - Rephrase the text in profession yet impactful language.
            - Be specific and concrete. Prefer real examples over generic statements.
            - Highlight Shahid's strengths in AI systems, LLM workflows, and fullstack development.
            - If relevant, mention technologies (React, Next.js, Node.js, LLM APIs, etc.).
            - Keep answers concise (2-4 sentences).
            - Do NOT hallucinate or invent details beyond the provided context.
            - If unsure, say you don't have enough information.
            - If contact information is not explicitly present in the context, do NOT generate or guess any email, LinkedIn, or GitHub links.
            
            Goal:
            - Help recruiters quickly understand Shahid's strengths and why he is a strong candidate.`,
        },
      ],
    };

    const updatedMessages = [systemMessage, ...messages];

    const result = streamText({
      model: openrouter.chat(MODEL_NAME),
      messages: await convertToModelMessages(updatedMessages),
      maxTokens: 350,
      experimental_transform: smoothStream(),
    });

    return result.toUIMessageStreamResponse({
      headers: {
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (err) {
    console.error('Chat API error:', err.message);
    return new Response(
      JSON.stringify({ error: 'Service temporarily unavailable. Please try again.' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
