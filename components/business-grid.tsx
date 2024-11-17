'use client';

import { getOpportunities } from "@/lib/db/queries";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function BusinessGrid({ opportunities }: { opportunities: Awaited<ReturnType<typeof getOpportunities>> }) {
  const router = useRouter();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {opportunities.length === 0 ? (
        <motion.div 
          variants={item}
          className="col-span-full text-center text-neutral-600 dark:text-neutral-400"
        >
          <p>Loading opportunities...</p>
        </motion.div>
      ) : (
        opportunities.map((opportunity) => (
          <motion.div
            key={opportunity.id}
            variants={item}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold">{opportunity.name}</h3>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                  >
                    {opportunity.type}
                  </Badge>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-4">
                  {opportunity.description}
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="font-medium">Perfect for:</span>{" "}
                    {opportunity.perfectFounderTraits}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {(typeof opportunity.tags === "string"
                      ? JSON.parse(opportunity.tags)
                      : opportunity.tags
                    ).map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
