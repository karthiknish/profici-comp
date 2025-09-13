"use client";

import React from "react";
import { Lightbulb } from "lucide-react";

export default function GuidedTips({ step }) {
  const tips = {
    1: [
      "Use your direct contact phone so we can reach you about findings.",
      "Names help personalise your report and communications.",
    ],
    2: [
      "Add your primary domain with https:// for best results.",
      "Choose the closest industry label for accurate benchmarks.",
    ],
    3: [
      "Start with your top competitor by visibility or market share.",
      "You can add more later; at least one is required.",
    ],
  };
  const list = tips[step] || [];

  if (!list.length) return null;
  return (
    <div className="mt-4 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
      <div className="flex items-center gap-2 mb-1">
        <Lightbulb className="h-4 w-4 text-amber-600" />
        <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Tips</span>
      </div>
      <ul className="list-disc pl-5 space-y-1">
        {list.map((t, i) => (
          <li key={i} className="text-xs text-amber-800 dark:text-amber-200">{t}</li>
        ))}
      </ul>
    </div>
  );
}
