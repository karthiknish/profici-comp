import React from "react";
import { parsePercentage } from "@/utils/parsing"; // Assuming parsePercentage is in utils
import CircularProgress from "@/components/ui/circular-progress";

// Reusable PercentageMetric component using CircularProgress
const PercentageMetric = ({ label, value, icon: Icon }) => {
  const percentage = parsePercentage(value);
  if (percentage === null) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center text-muted-foreground">
          {Icon && <Icon className="mr-2 h-4 w-4" />} {label}
        </span>
        <span className="font-medium">{value || "N/A"}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between text-sm gap-3">
      <div className="flex items-center text-muted-foreground flex-grow min-w-0">
        {" "}
        {/* Added min-w-0 for flex shrink */}
        {Icon && <Icon className="mr-2 h-4 w-4 flex-shrink-0" />}
        <span className="truncate" title={label}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-medium">{percentage.toFixed(0)}%</span>
        <CircularProgress value={percentage} size={24} strokeWidth={3} />
      </div>
    </div>
  );
};

export default PercentageMetric;
