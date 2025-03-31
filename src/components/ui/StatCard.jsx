import React from "react";

// Reusable Stat Card component
const StatCard = ({ label, value, icon: Icon }) => (
  <div className="space-y-1 rounded-lg border bg-card text-card-foreground shadow-sm p-4">
    <span className="flex items-center text-sm text-muted-foreground">
      {Icon && <Icon className="mr-2 h-4 w-4" />} {label}
    </span>
    <p className="text-2xl font-semibold">{value || "N/A"}</p>
  </div>
);

export default StatCard;
