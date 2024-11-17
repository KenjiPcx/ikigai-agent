"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Coins,
  BookOpen,
  Wrench,
  Trophy,
} from "lucide-react";
import { Button } from "./ui/button";
import { enhancedOpportunity } from "@/lib/db/schema";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { OpportunitiesSearchResult } from "@/lib/db/queries";
import { useRouter } from "next/navigation";

export function OpportunityCards({
  opportunities,
}: {
  opportunities: OpportunitiesSearchResult[];
}) {
  const [selectedOpp, setSelectedOpp] =
    useState<OpportunitiesSearchResult | null>(null);
  const router = useRouter();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
        {opportunities.slice(0, 3).map((opp, i) => (
          <motion.div
            key={opp.opportunity?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            onClick={() => setSelectedOpp(opp)}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 
              rounded-xl aspect-square p-6 shadow-lg cursor-pointer
              hover:scale-105 transition-transform duration-200
              flex flex-col items-center justify-center text-center"
          >
            {/* Type Badge */}
            <span className="text-xs font-medium bg-white/20 text-white px-2 py-1 rounded-full mb-4">
              {opp.opportunity?.type}
            </span>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-4">
              {opp.opportunity?.name}
            </h3>

            {/* Primary Tag */}
            <span className="text-sm text-purple-100">
              {opp.opportunity?.tags[0]}
            </span>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedOpp} onOpenChange={() => setSelectedOpp(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-2xl font-bold text-purple-600 dark:text-purple-400 flex items-center justify-between">
            {selectedOpp?.opportunity.name}
            <span
              className="text-sm font-normal px-3 py-1 bg-purple-100 dark:bg-purple-900/30 
              text-purple-700 dark:text-purple-300 rounded-full"
            >
              {selectedOpp?.opportunity.type}
            </span>
          </DialogTitle>

          {selectedOpp && (
            <div className="space-y-8">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Overview</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {selectedOpp.opportunity.description}
                </p>
              </div>

              {/* Perfect Founder Traits */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold">Perfect Founder Profile</h3>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {selectedOpp.opportunity.perfectFounderTraits}
                </p>
              </div>

              {/* Stats Grid - now just showing Initial Investment */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-purple-500" />
                  <h4 className="font-medium">Initial Investment</h4>
                </div>
                <p className="text-sm">
                  {selectedOpp.gettingStarted?.initialInvestment}
                </p>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Skills Needed */}
                  <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Brain className="w-5 h-5 text-purple-500" />
                      <h3 className="font-semibold">Skills Needed</h3>
                    </div>
                    <ul className="space-y-2">
                      {(
                        selectedOpp.gettingStarted?.keySkillsNeeded as string[]
                      )?.map((skill, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                          <span className="text-sm">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources Needed */}
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Wrench className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold">Resources Needed</h3>
                    </div>
                    <ul className="space-y-2">
                      {(
                        selectedOpp.gettingStarted?.resourcesNeeded as string[]
                      )?.map((resource, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                          <span className="text-sm">{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* How to Start */}
                  <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-green-500" />
                      <h3 className="font-semibold">How to Start</h3>
                    </div>
                    <ol className="space-y-2 list-decimal list-inside">
                      {(selectedOpp.gettingStarted?.steps as string[])?.map(
                        (step, i) => (
                          <li key={i} className="text-sm pl-2">
                            {step}
                          </li>
                        )
                      )}
                    </ol>
                  </div>

                  {/* Success Story */}
                  {selectedOpp.successStory && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        <h3 className="font-semibold">Success Story</h3>
                      </div>
                      <p className="text-sm">
                        {selectedOpp.successStory.summary}
                      </p>
                      {selectedOpp.successStory.evidence && (
                        <p className="text-xs text-neutral-500 mt-2">
                          {selectedOpp.successStory.evidence}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Standout Factors */}
                  {selectedOpp.standoutFactors && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-lg mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-semibold">Why This Stands Out</h3>
                      </div>
                      <p className="text-sm">
                        {selectedOpp.standoutFactors.factor}
                      </p>
                      <p className="text-xs text-neutral-500 mt-2">
                        {selectedOpp.standoutFactors.evidence}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-semibold text-sm text-purple-600 dark:text-purple-400 mb-2">
                  Related Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedOpp.opportunity.tags as string[])?.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-purple-100 dark:bg-purple-900/30 
                        text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Source & Action */}
              <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <a
                  href={selectedOpp.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline block"
                >
                  Learn more at {selectedOpp.source.channelName}
                </a>

                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                  variant="ghost"
                  onClick={() => {
                    router.push(`/path/${selectedOpp.opportunity.id}`);
                  }}
                >
                  Choose This Path
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
