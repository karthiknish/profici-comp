"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const MobileOptimizationRadarChart = ({ chartData }) => {
  // Validate the incoming chartData structure
  if (
    !chartData ||
    !chartData.data ||
    !chartData.data.labels ||
    !chartData.data.datasets ||
    chartData.data.datasets.length === 0
  ) {
    console.warn(
      "Invalid or missing chart data for MobileOptimizationRadarChart",
      chartData
    );
    return (
      <p className="text-xs text-muted-foreground italic">
        Mobile optimization chart data is unavailable or invalid.
      </p>
    );
  }

  const { labels, datasets } = chartData.data;
  const dataset = datasets[0]; // Assuming one dataset

  if (!dataset || !dataset.data || labels.length !== dataset.data.length) {
    console.warn(
      "Mismatched labels and data points in MobileOptimizationRadarChart",
      chartData
    );
    return (
      <p className="text-xs text-muted-foreground italic">
        Mobile optimization data labels and values do not match.
      </p>
    );
  }

  // Prepare data for Recharts RadarChart
  // Recharts expects an array of objects, where each object represents a point on the axis
  const radarChartData = labels.map((label, index) => ({
    subject: label,
    value: dataset.data[index] || 0, // Use the data point (0 or 1 in the example)
    fullMark: 1, // Assuming the max value for boolean checks is 1 (true)
  }));

  // Extract styling and title
  const backgroundColor = dataset.backgroundColor || "rgba(34, 193, 195, 0.2)";
  const borderColor = dataset.borderColor || "rgba(34, 193, 195, 1)";
  const pointBackgroundColor =
    dataset.pointBackgroundColor || "rgba(34, 193, 195, 1)";
  const chartTitle = chartData.options?.title?.display
    ? chartData.options.title.text
    : "Mobile Optimization";

  return (
    <div className="w-full h-72 md:h-80">
      {" "}
      {/* Set a height for the container */}
      <h4 className="font-medium mb-2 text-center text-sm">{chartTitle}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
          {/* We might not need PolarRadiusAxis if it's just 0/1 */}
          {/* <PolarRadiusAxis angle={30} domain={[0, 1]} /> */}
          <Radar
            name={dataset.label || "Optimization"}
            dataKey="value"
            stroke={borderColor}
            fill={backgroundColor}
            fillOpacity={0.6}
          />
          <Tooltip />
          {/* Legend might be redundant if there's only one dataset */}
          {/* <Legend /> */}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MobileOptimizationRadarChart;
