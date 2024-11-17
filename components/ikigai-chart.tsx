"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type IkigaiData = {
  whatYouLove: string[];
  whatYouAreGoodAt: string[];
  whatTheWorldNeeds: string[];
  whatYouCanBePaidFor: string[];
};

const Card = ({
  title,
  items,
  color,
  borderColor,
  textColor,
}: {
  title: string;
  items: string[];
  color: string;
  borderColor: string;
  textColor: string;
}) => {
  return (
    <div
      className={`
        ${color} 
        border-2 
        ${borderColor} 
        rounded-xl 
        p-8 
        shadow-lg
        aspect-square
        flex
        flex-col
        overflow-hidden
      `}
    >
      <h3 className={`text-xl font-semibold mb-6 ${textColor}`}>{title}</h3>
      <ul className="space-y-3 flex-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full ${textColor} mt-1.5`} />
            <p className="text-base text-neutral-700 dark:text-neutral-300">
              {item}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export function IkigaiChart({ data }: { data?: IkigaiData }) {
  const cards = [
    {
      title: "What you LOVE",
      items: data?.whatYouLove || [],
      color: "bg-pink-50 dark:bg-pink-950/30",
      borderColor: "border-pink-200 dark:border-pink-800",
      textColor: "text-pink-700 dark:text-pink-300",
    },
    {
      title: "What you're GOOD AT",
      items: data?.whatYouAreGoodAt || [],
      color: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      title: "What the WORLD NEEDS",
      items: data?.whatTheWorldNeeds || [],
      color: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-700 dark:text-green-300",
    },
    {
      title: "What you can be PAID FOR",
      items: data?.whatYouCanBePaidFor || [],
      color: "bg-yellow-50 dark:bg-yellow-950/30",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      textColor: "text-yellow-700 dark:text-yellow-300",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-2 gap-8">
        {cards.map((card, i) => (
          <Card
            key={i}
            {...card}
            items={card.items.filter(
              (item): item is string => item !== undefined
            )}
          />
        ))}
      </div>
    </div>
  );
}
