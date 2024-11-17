'use client';

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export function RecommendationCards() {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 p-4 overflow-hidden">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="min-w-[300px] flex-shrink-0">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Business Idea {i}</h3>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Required Skills: React, Node.js, Marketing
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Timeline: 6-12 months
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Potential Earnings: $5k-10k/month
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Pass
                </Button>
                <Button size="sm" className="flex-1">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Shortlist
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 