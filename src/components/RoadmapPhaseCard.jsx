"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, TrendingUp as ImpactIcon } from "lucide-react"; // Added icons
import { Badge } from "@/components/ui/badge"; // Import Badge

const RoadmapPhaseCard = ({ phaseData }) => {
  if (!phaseData || !phaseData.phase || !Array.isArray(phaseData.actions)) {
    return null; // Don't render if data is incomplete
  }

  return (
    <Card className="flex flex-col h-full">
      {" "}
      {/* Ensure card takes full height in grid */}
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center">
          {/* Optional: Add an icon per phase */}
          {/* <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> */}
          {phaseData.phase}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {" "}
        {/* Allow content to grow */}
        <ul className="space-y-3">
          {" "}
          {/* Increased spacing */}
          {phaseData.actions.map((actionData, index) => (
            <li
              key={index}
              className="text-sm text-muted-foreground border-b border-dashed pb-2 last:border-b-0 last:pb-0"
            >
              {/* Check if actionData is an object with action property */}
              {typeof actionData === "object" &&
              actionData !== null &&
              actionData.action ? (
                <>
                  <span>{actionData.action}</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    {actionData.effort && (
                      <Badge
                        variant="outline"
                        className="text-xs px-1.5 py-0.5"
                      >
                        <Zap className="h-3 w-3 mr-1" /> Effort:{" "}
                        {actionData.effort}
                      </Badge>
                    )}
                    {actionData.impact && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5"
                      >
                        <ImpactIcon className="h-3 w-3 mr-1" /> Impact:{" "}
                        {actionData.impact}
                      </Badge>
                    )}
                  </div>
                </>
              ) : (
                // Fallback for simple string actions
                <span>{actionData}</span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RoadmapPhaseCard;
