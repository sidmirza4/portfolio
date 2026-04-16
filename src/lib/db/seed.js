import { embed } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sql } from 'drizzle-orm';
import { documents, chunks } from './schema.js';
import db from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const biographyPath = path.resolve(__dirname, '../../assets/biography.txt');
const biography = fs.readFileSync(biographyPath, 'utf8').trim();

function chunkText(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// --- Generate embedding using OpenRouter ---
const getEmbedding = async (text) => {
  const { embedding } = await embed({
    model: openrouter.textEmbeddingModel('openai/text-embedding-3-small'),
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
