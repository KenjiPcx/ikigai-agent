import BusinessGrid from "@/components/business-grid";
import { StickyHeader } from "@/components/sticky-header";
import { Button } from "@/components/ui/button";
import { getOpportunities } from "@/lib/db/queries";
import Link from "next/link";

export default async function HomePage() {
  const opportunities = await getOpportunities();

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <StickyHeader />
      <div className="container px-4 py-16 mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Future-Proof Your Career
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            Don't risk being replaced by AI. Create value on your own terms and
            build a business that matters. Find your purpose in the age of
            automation.
          </p>
          <Link href="/discover">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
            >
              Start Your Journey
            </Button>
          </Link>
        </div>
        <BusinessGrid opportunities={opportunities} />
      </div>
    </main>
  );
}
