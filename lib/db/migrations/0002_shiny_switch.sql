ALTER TABLE "Opportunity" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embedding_index" ON "Opportunity" USING hnsw ("embedding" vector_cosine_ops);