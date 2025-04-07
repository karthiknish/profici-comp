"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList, // Import LabelList
  Cell, // Import Cell for individual bar colors
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Custom Tooltip Component
const CustomTooltip = ({
  active,
  payload,
  label: tooltipLabel,
  unit,
  chartLabel,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Access the full data point for the hovered bar
    const value = payload[0].value; // Access the specific value being hovered
    const name = data.name; // Get the competitor name from the data point

    // Removed inline style from the div, relying on wrapperStyle of Tooltip component
    return (
      <div className="p-2 bg-background border border-border rounded shadow-lg text-xs">
        <p className="font-medium mb-1">{name}</p>
        <p className="text-muted-foreground">{`${chartLabel}: ${value}${unit}`}</p>
      </div>
    );
  }

  return null;
};

// Helper function to safely parse numbers, handling various formats
const parseNumericValue = (value) => {
  if (value === null || value === undefined || value === "N/A") return null;
  if (typeof value === "number") return value;
  if (typeof value !== "string") return null;

  // Remove common non-numeric characters like %, £, commas, Est.
  const cleanedValue = value.replace(/[%£,]|Est\./gi, "").trim();
  const number = parseFloat(cleanedValue);
  return isNaN(number) ? null : number;
};

// Define a color palette for the bars
const BAR_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8884d8", // Fallback if more bars than colors
  "#82ca9d",
];

const CompetitorComparisonBarChart = ({ data, dataKey, label, unit = "" }) => {
  if (
    !data ||
    !Array.isArray(data.rows) ||
    data.rows.length === 0 ||
    !dataKey
  ) {
    return (
      <p className="text-xs text-muted-foreground italic text-center py-4">
        Comparison data unavailable for {label}.
      </p>
    );
  }

  // Prepare data for the chart, parsing the numeric value
  const chartData = data.rows
    .map((row) => ({
      name: row.competitor || "Unknown",
      value: parseNumericValue(row[dataKey]), // Use the specified dataKey
    }))
    .filter((item) => item.value !== null); // Filter out rows where parsing failed

  if (chartData.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic text-center py-4">
        No valid numeric data found for {label} comparison.
      </p>
    );
  }

  return (
    // Added overflow visible style
    <Card className="h-full" style={{ overflow: "visible" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-center">
          {label} Comparison
        </CardTitle>
      </CardHeader>
      {/* Set a specific height */}
      <CardContent
        className="pt-4"
        style={{ overflow: "visible", height: "350px" }}
      >
        {/* Re-added ResponsiveContainer */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="horizontal" // Changed layout to horizontal (vertical bars)
            margin={{ top: 5, right: 5, left: 5, bottom: 20 }} // Adjusted bottom margin for labels
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />{" "}
            {/* Show vertical lines */}
            {/* Swapped XAxis and YAxis */}
            <XAxis
              dataKey="name" // Use competitor name for X-axis
              type="category" // Set type to category
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false} // Keep only one tickLine attribute
              axisLine={false}
              angle={-45} // Angle labels if they overlap
              textAnchor="end" // Adjust anchor for angled labels
              minTickGap={-5} // Adjust gap to prevent label overlap
              interval={0} // Ensure all labels are shown
            />
            <YAxis
              type="number" // Use value for Y-axis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            {/* Use Custom Tooltip */}
            <Tooltip
              wrapperStyle={{ zIndex: 1100 }} // Keep zIndex
              cursor={{ fill: "hsl(var(--muted))" }}
              content={<CustomTooltip unit={unit} chartLabel={label} />} // Pass custom component and props
            />
            {/* <Legend /> */}
            <Bar
              dataKey="value"
              name={label}
              radius={[4, 4, 0, 0]} // Adjusted radius for vertical bars
              maxBarSize={50} // Slightly larger max bar size
            >
              {/* Add data labels */}
              <LabelList
                dataKey="value"
                position="top" // Changed position to top
                offset={8}
                className="fill-foreground"
                fontSize={10}
                formatter={(value) => `${value}${unit}`}
              />
              {/* Apply colors to each bar */}
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>{" "}
        {/* Re-added closing tag */}
      </CardContent>
    </Card>
  );
};

export default CompetitorComparisonBarChart;
