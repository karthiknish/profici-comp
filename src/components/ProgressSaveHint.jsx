"use client";

import React from "react";
import { Save } from "lucide-react";

export default function ProgressSaveHint({ savedAt }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Save className="h-3.5 w-3.5" />
      <span>
        {savedAt ? `Progress saved ${new Date(savedAt).toLocaleTimeString()}` : "Progress auto-saves as you type"}
      </span>
    </div>
  );
}
