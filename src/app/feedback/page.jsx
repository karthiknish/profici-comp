import React from "react";
// Placeholder for Kanban component
import FeedbackKanban from "@/components/FeedbackKanban";

export default function FeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Feature Requests & Feedback</h1>
      <p className="mb-4">
        Submit your ideas or vote on existing ones to help shape the future of
        this application.
      </p>
      {/* Render the Kanban board */}
      <FeedbackKanban />
    </div>
  );
}
