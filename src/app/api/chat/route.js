import { gateway } from '@ai-sdk/gateway';
import { streamText, convertToModelMessages, embed } from 'ai';

import { sql } from 'drizzle-orm';
import db from '../../../lib/db/index';
import { chunks } from '../../../lib/db/schema';

// const getTopChunks = async (queryEmbedding, topN = 5) => {
//   const result = await db
//     .select()
//     .from(chunks)
//     .orderBy(sql`1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector)`)
//     .limit(topN);

//   return result;
// };

async function getSimilarChunks(queryEmbedding, topN = 3) {
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
    model: gateway.textEmbeddingModel('openai/text-embedding-3-small'),
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

  console.log('🔍 Query text:', queryText);

  const queryEmbedding = await getQueryEmbedding(queryText);
  const topChunks = await getSimilarChunks(queryEmbedding, 3);

  console.log('📊 Retrieved chunks:', topChunks.length);

  // Handle empty results
  if (topChunks.length === 0) {
    return new Response(JSON.stringify({ error: 'No relevant information found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const contextText = topChunks.join('\n\n');
  console.log('📝 Context length:', contextText.length);

  const systemMessage = {
    role: 'system',
    parts: [
      {
        type: 'text',
        text: `You are Shahid's personal portfolio assistant. Use ONLY the following biography chunks to answer questions:\n${contextText}
        Rules:
          - You answer in first person, as if Shahid is speaking.
          - You answer in a way that is consistent with the biography chunks.
          - You are very careful with your answers, you never make up information and you always stick to the facts.
          - You are very helpful and friendly.
          - You want Shahid to land a job at a good company.
          - You MUST rephrase the answer and make it more engaging and interesting.
          - Keep the answer short and concise.
          - You can answer simple greeting questions in one line.`,
      },
    ],
  };

  const updatedMessages = [systemMessage, ...messages];

  const result = streamText({
    model: gateway('openai/gpt-5-mini'),
    messages: convertToModelMessages(updatedMessages),
  });
  return result.toUIMessageStreamResponse();
}
