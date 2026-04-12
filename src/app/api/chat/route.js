import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText, convertToModelMessages, embed, smoothStream } from 'ai';

import { sql } from 'drizzle-orm';
import db from '../../../lib/db/index';
import { chunks } from '../../../lib/db/schema';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL_NAME = 'google/gemini-3.1-flash-lite-preview';

async function getSimilarChunks(queryEmbedding, topN = 5) {
  try {
    // Convert the embedding array to string format to match what we stored
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

export async function POST(req) {
  const { messages } = await req.json();

  if (!messages || !messages.length) {
    return new Response(JSON.stringify({ error: 'No messages provided.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Extract query text from the last message
  const lastMessage = messages[messages.length - 1];
  const queryText = lastMessage.parts?.[0]?.text || lastMessage.content || lastMessage.text || '';

  try {
    const queryEmbedding = await getQueryEmbedding(queryText);
    const topChunks = await getSimilarChunks(queryEmbedding, 3);

    // Handle empty results
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
      experimental_transform: smoothStream(),
    });
    return result.toUIMessageStreamResponse();
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
