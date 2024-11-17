DROP INDEX IF EXISTS "embedding_index";--> statement-breakpoint
ALTER TABLE "EnhancedOpportunity" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embedding_index" ON "EnhancedOpportunity" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
ALTER TABLE "Opportunity" DROP COLUMN IF EXISTS "embedding";