import { gateway } from '@ai-sdk/gateway';
import { streamText, convertToModelMessages } from 'ai';
import fs from 'fs';
import path from 'path';

const biographyPath = path.join(process.cwd(), 'src', 'assets', 'biography.txt');
const biography = fs.readFileSync(biographyPath, 'utf8').trim();

export async function POST(req) {
  const { messages } = await req.json();

  const systemMessage = {
    role: 'system',
    parts: [
      {
        type: 'text',
        text: `You are Shahid's personal portfolio assistant. Use ONLY the following biography to answer questions: ${biography}
        Rules:
          - You can answer simple greeting questions in one line.
          - If the question is NOT about Shahid, reply exactly: "I can only talk about Shahid".
          - If the question IS about Shahid, answer briefly (1-2 sentences max), in first person, as if Shahid is speaking.
          - If asked about a technology that Shahid has not worked on before, 
            answer in optimistic way which feels like Shahid is more than willing to learn.
          - Never invent details not present in the biography.`,
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
