CREATE TABLE IF NOT EXISTS "EnhancedOpportunity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opportunityId" uuid NOT NULL,
	"sourceId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "GettingStarted" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"initialInvestment" text NOT NULL,
	"keySkillsNeeded" json NOT NULL,
	"resourcesNeeded" json NOT NULL,
	"steps" json NOT NULL,
	"evidence" json NOT NULL,
	"opportunityId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Link" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Opportunity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" varchar(32) NOT NULL,
	"description" text NOT NULL,
	"tags" json NOT NULL,
	"perfectFounderTraits" text NOT NULL,
	"successStoryId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Resource" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" varchar(32) NOT NULL,
	"description" text NOT NULL,
	"evidence" text NOT NULL,
	"links" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Source" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"channelName" text NOT NULL,
	"channelUrl" text NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StandoutFactor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"factor" text NOT NULL,
	"evidence" text NOT NULL,
	"opportunityId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SuccessStory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"summary" text,
	"evidence" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SuccessStoryLinks" (
	"successStoryId" uuid NOT NULL,
	"linkId" uuid NOT NULL,
	CONSTRAINT "SuccessStoryLinks_successStoryId_linkId_pk" PRIMARY KEY("successStoryId","linkId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EnhancedOpportunity" ADD CONSTRAINT "EnhancedOpportunity_opportunityId_Opportunity_id_fk" FOREIGN KEY ("opportunityId") REFERENCES "public"."Opportunity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EnhancedOpportunity" ADD CONSTRAINT "EnhancedOpportunity_sourceId_Source_id_fk" FOREIGN KEY ("sourceId") REFERENCES "public"."Source"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "GettingStarted" ADD CONSTRAINT "GettingStarted_opportunityId_Opportunity_id_fk" FOREIGN KEY ("opportunityId") REFERENCES "public"."Opportunity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_successStoryId_SuccessStory_id_fk" FOREIGN KEY ("successStoryId") REFERENCES "public"."SuccessStory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "StandoutFactor" ADD CONSTRAINT "StandoutFactor_opportunityId_Opportunity_id_fk" FOREIGN KEY ("opportunityId") REFERENCES "public"."Opportunity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SuccessStoryLinks" ADD CONSTRAINT "SuccessStoryLinks_successStoryId_SuccessStory_id_fk" FOREIGN KEY ("successStoryId") REFERENCES "public"."SuccessStory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SuccessStoryLinks" ADD CONSTRAINT "SuccessStoryLinks_linkId_Link_id_fk" FOREIGN KEY ("linkId") REFERENCES "public"."Link"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
