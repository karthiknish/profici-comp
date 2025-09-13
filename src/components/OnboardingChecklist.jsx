"use client";

import React from "react";
import { CheckCircle2, Circle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

function Item({ done, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      {done ? (
        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
      )}
      <div>
        <div className={cn("text-sm font-medium", done ? "text-foreground" : "text-muted-foreground")}>{title}</div>
        {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
      </div>
    </div>
  );
}

export default function OnboardingChecklist({ values }) {
  const hasContact = Boolean(values?.contactName && values?.phone);
  const hasBusiness = Boolean(values?.businessName && values?.website && values?.industry);
  const competitors = Array.isArray(values?.competitors) ? values.competitors.map((c) => c?.value).filter(Boolean) : [];
  const hasCompetitors = competitors.length >= 1;
  const total = 3;
  const done = [hasContact, hasBusiness, hasCompetitors].filter(Boolean).length;

  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">Getting started</div>
        <div className="text-xs text-muted-foreground">{done}/{total} complete</div>
      </div>
      <div className="space-y-2">
        <Item done={hasContact} title="Contact details" desc="Your name and phone number" />
        <Item done={hasBusiness} title="Business details" desc="Name, website and industry" />
        <Item done={hasCompetitors} title="Competitors" desc="Add at least one competitor domain" />
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5" />
        <span>You can save progress automatically and resume later.</span>
      </div>
    </div>
  );
}
