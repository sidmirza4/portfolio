import { gateway } from '@ai-sdk/gateway';
import { streamText, convertToModelMessages } from 'ai';
// import fs from 'fs';
// import path from 'path';

// const biographyPath = path.join(process.cwd(), 'src', 'assets', 'biography.txt');
// const biography = fs.readFileSync(biographyPath, 'utf8').trim();


import db from '../../../lib/db/index'; // your Drizzle client
import { chunks } from '../../../lib/db/schema';
import { sql } from 'drizzle-orm';

const getTopChunks = async (queryEmbedding, topN = 5) => {
  
  const result = await db
    .select()
    .from(chunks)
    .orderBy(
      sql`1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector)`
    )
    .limit(topN);

  return result;
};

async function getQueryEmbedding(text) {
  const res = await fetch('http://localhost:8000/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const { embedding } = await res.json();
  return embedding;
}



export async function POST(req) {
  const { messages } = await req.json();

  const queryEmbedding = await getQueryEmbedding(messages[messages.length - 1].parts[0].text);

  const topChunks = await getTopChunks(queryEmbedding, 3);
  
  const contextText = topChunks.map(c => c.content).join("\n\n");

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
          - You can answer simple greeting questions in one line.`
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
