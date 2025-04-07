"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define a fallback color palette if none is provided
const FALLBACK_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#FF6347",
  "#4682B4",
  "#32CD32",
  "#FFD700",
  "#8A2BE2",
  "#20B2AA",
  "#D3D3D3",
];

const TechnologyPieChart = ({ chartData }) => {
  // Validate the incoming chartData structure
  if (
    !chartData ||
    !chartData.data ||
    !chartData.data.labels ||
    !chartData.data.datasets ||
    chartData.data.datasets.length === 0
  ) {
    console.warn(
      "Invalid or missing chart data for TechnologyPieChart",
      chartData
    );
    return (
      <p className="text-xs text-muted-foreground italic">
        Technology breakdown data is unavailable or invalid.
      </p>
    );
  }

  const { labels, datasets } = chartData.data;
  const dataset = datasets[0]; // Assuming only one dataset for the pie chart

  if (!dataset || !dataset.data || labels.length !== dataset.data.length) {
    console.warn(
      "Mismatched labels and data points in TechnologyPieChart",
      chartData
    );
    return (
      <p className="text-xs text-muted-foreground italic">
        Technology data labels and values do not match.
      </p>
    );
  }

  // Prepare data in the format Recharts expects for PieChart
  const pieData = labels.map((label, index) => ({
    name: label,
    value: dataset.data[index] || 0, // Ensure value is a number, default to 0
  }));

  // Use provided colors or fallback
  const colors =
    dataset.backgroundColor && dataset.backgroundColor.length === pieData.length
      ? dataset.backgroundColor
      : FALLBACK_COLORS;

  // Extract title from options if available
  const chartTitle = chartData.options?.title?.display
    ? chartData.options.title.text
    : "Technology Profile Breakdown";

  return (
    <div className="w-full h-72 md:h-80">
      {" "}
      {/* Set a height for the container */}
      <h4 className="font-medium mb-2 text-center text-sm">{chartTitle}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} // Example label rendering
            outerRadius="80%" // Adjust as needed
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} technologies`, name]}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconSize={10}
            wrapperStyle={{ fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TechnologyPieChart;
