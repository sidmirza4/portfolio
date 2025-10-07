import fs from 'fs';
import { embed } from 'ai';

// import { openai } from '../openai.js';
import db from './index.js';
import { documents, chunks } from './schema.js';

// Simple chunking helper
// function chunkText(text, maxLength = 1000) {
//   const sentences = text.split(/(?<=[.?!])\s+/);
//   const chunks = [];
//   let current = '';

//   for (const sentence of sentences) {
//     if ((current + sentence).length > maxLength) {
//       chunks.push(current.trim());
//       current = sentence;
//     } else {
//       current += ' ' + sentence;
//     }
//   }
//   if (current) chunks.push(current.trim());
//   return chunks;
// }

function readEmbeddings(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  return lines.filter((line) => line.trim()).map((line) => JSON.parse(line));
}

async function loadPortfolio() {
  console.log('📄 Reading portfolio file...');
  // const text = fs.readFileSync('src/assets/biography.txt', 'utf8');
  const embeddingData = readEmbeddings('src/lib/embeddings.jsonl');
  // console.log('✂️ Chunking text...');
  // const portfolioChunks = chunkText(text, 1000);
  // console.log(`✅ Created ${portfolioChunks.length} chunks`);

  console.log(`✅ Found ${embeddingData.length} embeddings`);

  console.log('🧾 Creating document record...');
  const [doc] = await db
    .insert(documents)
    .values({
      title: 'My Portfolio',
      slug: 'portfolio',
      source: 'local',
    })
    .returning({ id: documents.id });

  console.log('🧠 Generating embeddings and inserting into DB...');
  for (let i = 0; i < embeddingData.length; i++) {
    const record = embeddingData[i];

    await db.insert(chunks).values({
      documentId: doc.id,
      content: record.content,
      embedding: `[${record.embedding.join(',')}]`,
      position: record.position,
    });

    console.log(`✅ Inserted chunk ${i + 1}/${embeddingData.length}`);
  }

  console.log('🎉 Portfolio successfully inserted from embeddings.jsonl!');
}

// export async function generateEmbedding(_input) {
//   const input = _input.replace(/\n/g, ' ');

//   const { embedding } = await embed({
//     model: openai.embedding('text-embedding-3-small'),
//     value: input,
//   });

//   return embedding;
// }

loadPortfolio().catch((err) => {
  console.error('❌ Error loading portfolio:', err);
});
