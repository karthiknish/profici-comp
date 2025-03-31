"use client";

import React from "react";

/**
 * Simple SVG Circular Progress component.
 * Takes a value prop (0-100).
 */
const CircularProgress = ({
  value,
  strokeWidth = 4,
  size = 40, // Diameter of the circle
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`transform -rotate-90 ${className}`}
    >
      {/* Background Circle */}
      <circle
        className="text-border" // Use border color for the background track
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress Circle */}
      <circle
        className="text-primary" // Use primary color for the progress arc
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
      />
      {/* Optional: Text in the center */}
      {/* <text
         x="50%"
         y="50%"
         dominantBaseline="middle"
         textAnchor="middle"
         className="text-xs font-medium fill-current text-foreground transform rotate-90 origin-center"
       >
         {`${Math.round(value)}%`}
       </text> */}
    </svg>
  );
};

export default CircularProgress;
