import { embed } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import fs from 'fs';
import path from 'path';
import { sql } from 'drizzle-orm';
import { documents, chunks } from './schema.js';
import db from './index.js';

const biographyPath = path.join(process.cwd(), 'src', 'assets', 'biography.txt');
const biography = fs.readFileSync(biographyPath, 'utf8').trim();

// --- Helper to split text into manageable chunks ---
function chunkText(text, maxLength = 1000) {
  // Split by lines first, then by sentences
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const result = lines.reduce(
    (acc, line) => {
      const testChunk = acc.current ? `${acc.current} ${line}` : line;

      if (testChunk.length > maxLength) {
        if (acc.current) {
          acc.chunksArr.push(acc.current.trim());
          acc.current = line;
        } else {
          // If even a single line is too long, split it
          acc.chunksArr.push(line.substring(0, maxLength));
          acc.current = line.substring(maxLength);
        }
      } else {
        acc.current = testChunk;
      }

      return acc;
    },
    { chunksArr: [], current: '' },
  );

  if (result.current) {
    result.chunksArr.push(result.current.trim());
  }

  return result.chunksArr;
}

// --- Generate embedding using Vercel AI SDK ---
const getEmbedding = async (text) => {
  const { embedding } = await embed({
    model: gateway.textEmbeddingModel('openai/text-embedding-3-small'),
    value: text,
  });
  return embedding;
};

async function loadPortfolio() {
  console.log('📄 Reading portfolio file...');
  const text = biography;

  console.log('✂️ Chunking text...');
  const portfolioChunks = chunkText(text, 1000);
  console.log(`✅ Created ${portfolioChunks.length} chunks`);

  // --- Clean old data ---
  await db.execute(sql`TRUNCATE TABLE ${chunks} RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE ${documents} RESTART IDENTITY CASCADE`);
  console.log('✅ Tables truncated');

  // --- Create a document record ---
  const [doc] = await db
    .insert(documents)
    .values({
      title: 'My Portfolio',
      slug: 'portfolio',
      source: 'local',
    })
    .returning({ id: documents.id });

  console.log('🧠 Generating embeddings and inserting into DB...');

  await portfolioChunks.reduce(async (previousPromise, content, i) => {
    await previousPromise;

    const embedding = await getEmbedding(content);

    await db.insert(chunks).values({
      documentId: doc.id,
      content,
      embedding: `[${embedding.join(',')}]`,
      position: i.toString(),
    });

    console.log(`✅ Inserted chunk ${i + 1}/${portfolioChunks.length}`);

    return Promise.resolve();
  }, Promise.resolve());

  console.log('🎉 Portfolio successfully inserted!');
}

loadPortfolio().catch((err) => {
  console.error('❌ Error loading portfolio:', err);
});
