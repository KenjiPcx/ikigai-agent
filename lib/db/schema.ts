import type { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  vector,
  index,
} from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const link = pgTable('Link', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  url: text('url').notNull(),
  description: text('description').notNull(),
});

export const successStory = pgTable('SuccessStory', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name'),
  summary: text('summary'),
  evidence: text('evidence'),
});

export const successStoryLinks = pgTable('SuccessStoryLinks', {
  successStoryId: uuid('successStoryId')
    .notNull()
    .references(() => successStory.id),
  linkId: uuid('linkId')
    .notNull()
    .references(() => link.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.successStoryId, table.linkId] })
}));

export const resource = pgTable('Resource', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  type: varchar('type', { length: 32 }).notNull(), // For the Literal types
  description: text('description').notNull(),
  evidence: text('evidence').notNull(),
  links: json('links'), // Array of strings
});

export const standoutFactor = pgTable('StandoutFactor', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  factor: text('factor').notNull(),
  evidence: text('evidence').notNull(),
  opportunityId: uuid('opportunityId')
    .notNull()
    .references(() => opportunity.id),
});

export const gettingStarted = pgTable('GettingStarted', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  initialInvestment: text('initialInvestment').notNull(),
  keySkillsNeeded: json('keySkillsNeeded').notNull(), // Array of strings
  resourcesNeeded: json('resourcesNeeded').notNull(), // Array of strings
  steps: json('steps').notNull(), // Array of strings
  evidence: json('evidence').notNull(), // Array of strings
  opportunityId: uuid('opportunityId')
    .notNull()
    .references(() => opportunity.id),
});

export const opportunity = pgTable('Opportunity', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  type: varchar('type', { length: 32 }).notNull(),
  description: text('description').notNull(),
  tags: json('tags').notNull(),
  perfectFounderTraits: text('perfectFounderTraits').notNull(),
  successStoryId: uuid('successStoryId')
    .references(() => successStory.id),
  },
);

export const source = pgTable('Source', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  channelName: text('channelName').notNull(),
  channelUrl: text('channelUrl').notNull(),
  url: text('url').notNull(),
  title: text('title').notNull(),
});

export const enhancedOpportunity = pgTable('EnhancedOpportunity', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  opportunityId: uuid('opportunityId')
    .notNull()
    .references(() => opportunity.id),
  sourceId: uuid('sourceId')
    .notNull()
    .references(() => source.id),
  embedding: vector('embedding', { dimensions: 1536 }),
}, (table) => ({
  embeddingIndex: index('embedding_index').using('hnsw', table.embedding.op('vector_cosine_ops')),
}));

// Add type exports
export type Link = InferSelectModel<typeof link>;
export type SuccessStory = InferSelectModel<typeof successStory>;
export type SuccessStoryLinks = InferSelectModel<typeof successStoryLinks>;
export type Resource = InferSelectModel<typeof resource>;
export type StandoutFactor = InferSelectModel<typeof standoutFactor>;
export type GettingStarted = InferSelectModel<typeof gettingStarted>;
export type Opportunity = InferSelectModel<typeof opportunity>;
export type Source = InferSelectModel<typeof source>;
export type EnhancedOpportunity = InferSelectModel<typeof enhancedOpportunity>;
