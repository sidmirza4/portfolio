import { pgTable, uuid, text, jsonb, timestamp, customType } from 'drizzle-orm/pg-core';

const vector = (dims) => customType({ dataType: () => `vector(${dims})` });

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(), // e.g., "My Portfolio", "Project X"
  slug: text('slug').unique(), // optional unique identifier
  source: text('source'), // e.g., "manual", "github", "website"
  url: text('url'), // link to the original doc (optional)
  metadata: jsonb('metadata'), // optional (for tags, categories, etc.)
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Stores the text chunks + embeddings for retrieval
export const chunks = pgTable('chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').references(() => documents.id, { onDelete: 'cascade' }),
  content: text('content').notNull(), // actual text chunk
  embedding: vector(1536)('embedding').notNull(), // vector for text-embedding-3-small models
  section: text('section'), // optional, like "Projects", "Experience"
  position: text('position'), // optional ordering info (string for flexibility)
  metadata: jsonb('metadata'), // e.g., {"project": "AI Chatbot"}
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
