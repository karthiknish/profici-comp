"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, Trash2, Edit } from "lucide-react"; // Import icons
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components

// Helper function to reorder items within the same column
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Helper function to move items between columns
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const FeedbackKanban = () => {
  const [columns, setColumns] = useState({
    Todo: [],
    InProgress: [],
    Done: [],
  });
  const [newFeedbackTitle, setNewFeedbackTitle] = useState("");
  const [newFeedbackDescription, setNewFeedbackDescription] = useState("");
  const [newFeedbackStatus, setNewFeedbackStatus] = useState("Todo"); // Add state for new item status, default to 'Todo'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votedItems, setVotedItems] = useState(new Set()); // Track voted items in session
  const [editingItemId, setEditingItemId] = useState(null); // State for inline editing
  const [editedTitle, setEditedTitle] = useState(""); // State for edited title
  const [editedDescription, setEditedDescription] = useState(""); // State for edited description
  const [isSavingEdit, setIsSavingEdit] = useState(false); // State for edit saving process

  const columnTitles = {
    Todo: "📝 Todo",
    InProgress: "⏳ In Progress",
    Done: "✅ Done",
  };

  const fetchFeedback = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/feedback");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Organize fetched data into columns
      const newColumns = { Todo: [], InProgress: [], Done: [] };
      data.forEach((item) => {
        if (newColumns[item.status]) {
          newColumns[item.status].push(item);
        } else {
          console.warn(`Item with unknown status found: ${item.status}`);
          // Optionally handle unknown statuses, e.g., put them in 'Todo'
          // newColumns.Todo.push(item);
        }
      });
      setColumns(newColumns);
    } catch (e) {
      console.error("Failed to fetch feedback:", e);
      setError("Failed to load feedback. Please try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
    // Load voted items from sessionStorage on mount
    const sessionVoted = sessionStorage.getItem("feedbackVotedItems");
    if (sessionVoted) {
      setVotedItems(new Set(JSON.parse(sessionVoted)));
    }
  }, [fetchFeedback]);

  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedbackTitle.trim() || !newFeedbackDescription.trim()) {
      setSubmitError("Please provide both a title and description.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newFeedbackTitle,
          description: newFeedbackDescription,
          status: newFeedbackStatus, // Include the selected status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const newItem = await response.json();

      // Add the new item to the correct column based on its status
      setColumns((prevColumns) => {
        const targetColumn = newItem.status || "Todo"; // Default to 'Todo' if status missing (shouldn't happen)
        if (!prevColumns[targetColumn]) {
          console.warn(
            `Received new item with unexpected status: ${targetColumn}. Placing in Todo.`
          );
          return {
            ...prevColumns,
            Todo: [...prevColumns.Todo, newItem],
          };
        }
        return {
          ...prevColumns,
          [targetColumn]: [...prevColumns[targetColumn], newItem],
        };
      });

      setNewFeedbackTitle("");
      setNewFeedbackDescription("");
      setNewFeedbackStatus("Todo"); // Reset status field
    } catch (e) {
      console.error("Failed to submit feedback:", e);
      setSubmitError(`Failed to submit feedback: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    const sId = source.droppableId;
    const dId = destination.droppableId;

    if (sId === dId) {
      // Reordering within the same column
      const items = reorder(columns[sId], source.index, destination.index);
      const newColumns = { ...columns };
      newColumns[sId] = items;
      setColumns(newColumns);
    } else {
      // Moving between columns
      const result = move(columns[sId], columns[dId], source, destination);
      const newColumns = { ...columns };
      newColumns[sId] = result[sId];
      newColumns[dId] = result[dId];

      // Update the status of the moved item locally
      const movedItemId = newColumns[dId][destination.index]._id;
      const updatedItem = {
        ...newColumns[dId][destination.index],
        status: dId,
      };
      newColumns[dId][destination.index] = updatedItem;

      setColumns(newColumns);

      // Call API to update item status in DB
      console.log(`Attempting to move item ${movedItemId} to status ${dId}`);
      updateFeedbackStatus(movedItemId, dId);
    }
  };

  // API call to update status
  const updateFeedbackStatus = async (itemId, newStatus) => {
    //   try {
    //     const response = await fetch(`/api/feedback/${itemId}`, { // Assuming an endpoint like /api/feedback/[id]
    //       method: 'PUT', // or PATCH
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ status: newStatus }),
    //     });
    //     if (!response.ok) {
    //       throw new Error('Failed to update status');
    //     }
    //     // Optionally refetch or handle success
    //   } catch (error) {
    //     console.error("Error updating feedback status:", error);
    // Optimistic update handled in onDragEnd, revert if API call fails
    try {
      const response = await fetch(`/api/feedback/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }
      // Success - state is already updated optimistically
      console.log(
        `Successfully updated status for item ${itemId} to ${newStatus}`
      );
      setError(null); // Clear previous errors on success
    } catch (error) {
      console.error("Error updating feedback status:", error);
      // Handle error - revert the change locally by refetching
      setError(
        `Failed to update item status: ${error.message}. Reverting changes.`
      );
      fetchFeedback(); // Revert local state by refetching
    }
  };

  // API call to increment votes
  const handleVote = async (itemId) => {
    // Find the item and its current column to update locally
    let itemToUpdate;
    let columnId;
    Object.entries(columns).forEach(([colId, items]) => {
      const found = items.find((item) => item._id === itemId);
      if (found) {
        itemToUpdate = found;
        columnId = colId;
      }
    });

    if (!itemToUpdate || !columnId) return; // Should not happen

    // Check if already voted in this session
    if (votedItems.has(itemId)) {
      console.log(`Already voted for item ${itemId} in this session.`);
      // Optionally show a message to the user
      setError("You have already voted for this item in this session.");
      setTimeout(() => setError(null), 3000); // Clear message after 3 seconds
      return;
    }

    // Optimistic update
    const originalColumns = JSON.parse(JSON.stringify(columns)); // Deep copy for revert
    const updatedItem = { ...itemToUpdate, votes: itemToUpdate.votes + 1 };
    const newColumnItems = columns[columnId].map((item) =>
      item._id === itemId ? updatedItem : item
    );
    setColumns((prev) => ({ ...prev, [columnId]: newColumnItems }));

    try {
      const response = await fetch(`/api/feedback/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vote" }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to vote");
      }
      // API call successful, state already updated optimistically
      const updatedData = await response.json(); // Get updated item from response
      // Ensure local state matches the final state from DB (especially votes)
      setColumns((prev) => {
        const finalColumns = { ...prev };
        finalColumns[columnId] = finalColumns[columnId].map((item) =>
          item._id === itemId ? { ...item, votes: updatedData.votes } : item
        );
        return finalColumns;
      });
      // Add to voted list and update sessionStorage
      const newVotedItems = new Set(votedItems);
      newVotedItems.add(itemId);
      setVotedItems(newVotedItems);
      sessionStorage.setItem(
        "feedbackVotedItems",
        JSON.stringify(Array.from(newVotedItems))
      );

      console.log(`Successfully voted for item ${itemId}`);
      setError(null);
    } catch (error) {
      console.error("Error voting for feedback:", error);
      setError(`Failed to vote: ${error.message}. Reverting.`);
      setColumns(originalColumns); // Revert optimistic update
    }
  };

  // API call to delete item
  const handleDelete = async (itemId) => {
    // Confirmation dialog
    if (
      !window.confirm("Are you sure you want to delete this feedback item?")
    ) {
      return;
    }

    // Find the column the item is in for local state update
    let columnId;
    Object.entries(columns).forEach(([colId, items]) => {
      if (items.some((item) => item._id === itemId)) {
        columnId = colId;
      }
    });

    if (!columnId) return; // Should not happen

    const originalColumns = JSON.parse(JSON.stringify(columns)); // Deep copy for revert

    // Optimistic update: Remove item locally
    const newColumnItems = columns[columnId].filter(
      (item) => item._id !== itemId
    );
    setColumns((prev) => ({ ...prev, [columnId]: newColumnItems }));

    try {
      const response = await fetch(`/api/feedback/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete item");
      }
      // API call successful, state already updated optimistically
      console.log(`Successfully deleted item ${itemId}`);
      setError(null);
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setError(`Failed to delete: ${error.message}. Reverting.`);
      setColumns(originalColumns); // Revert optimistic update
    }
  };

  // Function to start editing an item
  const handleEditStart = (item) => {
    setEditingItemId(item._id);
    setEditedTitle(item.title);
    setEditedDescription(item.description);
    setError(null); // Clear any previous errors
  };

  // Function to cancel editing
  const handleEditCancel = () => {
    setEditingItemId(null);
    setEditedTitle("");
    setEditedDescription("");
    setIsSavingEdit(false); // Ensure saving state is reset
  };

  // Function to save edited item (API call needed)
  const handleEditSave = async () => {
    if (!editedTitle.trim() || !editedDescription.trim()) {
      setError("Title and description cannot be empty.");
      return;
    }
    if (!editingItemId) return; // Should not happen

    setIsSavingEdit(true);
    setError(null);

    // Find the original item and its column for potential revert
    let originalItem;
    let columnId;
    Object.entries(columns).forEach(([colId, items]) => {
      const found = items.find((item) => item._id === editingItemId);
      if (found) {
        originalItem = found;
        columnId = colId;
      }
    });

    if (!originalItem || !columnId) {
      setError("Could not find item to update.");
      setIsSavingEdit(false);
      return;
    }

    const originalColumns = JSON.parse(JSON.stringify(columns)); // For revert

    // Optimistic Update locally
    setColumns((prevColumns) => {
      const newColumns = { ...prevColumns };
      newColumns[columnId] = newColumns[columnId].map((item) =>
        item._id === editingItemId
          ? { ...item, title: editedTitle, description: editedDescription }
          : item
      );
      return newColumns;
    });

    try {
      const response = await fetch(`/api/feedback/${editingItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save changes");
      }

      // Success - state already updated optimistically
      console.log(`Successfully updated item ${editingItemId}`);
      handleEditCancel(); // Exit edit mode on success
    } catch (error) {
      console.error("Error saving feedback edit:", error);
      setError(`Failed to save changes: ${error.message}. Reverting.`);
      setColumns(originalColumns); // Revert optimistic update
      // Keep edit mode open so user can retry or cancel
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Submit New Feedback Form */}
      <form onSubmit={handleAddFeedback} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Submit New Feedback</CardTitle>
            <CardDescription>
              Share your ideas or report issues here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="new-feedback-title" className="sr-only">
                Title
              </label>
              <Input
                id="new-feedback-title"
                value={newFeedbackTitle}
                onChange={(e) => setNewFeedbackTitle(e.target.value)}
                placeholder="Feedback Title"
                required
                disabled={isSubmitting || isLoading || !!editingItemId} // Disable if editing
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="new-feedback-description" className="sr-only">
                Description
              </label>
              <Textarea
                id="new-feedback-description"
                value={newFeedbackDescription}
                onChange={(e) => setNewFeedbackDescription(e.target.value)}
                placeholder="Detailed description..."
                required
                disabled={isSubmitting || isLoading || !!editingItemId} // Disable if editing
                rows={4}
              />
            </div>
            {/* Status Selector */}
            <div className="space-y-2">
              <label
                htmlFor="new-feedback-status"
                className="text-sm font-medium"
              >
                Initial Status
              </label>
              <Select
                value={newFeedbackStatus}
                onValueChange={setNewFeedbackStatus}
                disabled={isSubmitting || isLoading || !!editingItemId} // Disable if editing
                required
              >
                <SelectTrigger id="new-feedback-status">
                  <SelectValue placeholder="Select Initial Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todo">📝 Todo</SelectItem>
                  <SelectItem value="InProgress">⏳ In Progress</SelectItem>
                  <SelectItem value="Done">✅ Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            {submitError && (
              <Alert
                variant="destructive"
                className="text-xs p-2 mr-4 flex-grow"
              >
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || isLoading || !!editingItemId}
              className="ml-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {Object.entries(columns).map(([columnId, columnItems]) => (
            <div
              key={columnId}
              className="flex-1 min-w-[300px] bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                {columnTitles[columnId]}
              </h2>
              {/* Content Area: Show Skeleton or Droppable List */}
              <div className="min-h-[100px]">
                {isLoading ? (
                  // Skeleton Loading State
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton
                        key={`skel-${columnId}-${i}`}
                        className="h-24 w-full rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  // Actual Droppable Content
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`transition-colors duration-200 ease-in-out rounded-md pb-1 ${
                          snapshot.isDraggingOver
                            ? "bg-blue-50 dark:bg-gray-700/50"
                            : ""
                        }`}
                      >
                        {columnItems.length === 0 &&
                        !snapshot.isDraggingOver ? (
                          // Placeholder when column is empty
                          <div className="text-center text-sm text-gray-500 py-4 px-2">
                            No items in this stage yet.
                          </div>
                        ) : (
                          columnItems.map((item, index) => {
                            // Determine card color based on columnId
                            let cardColorClass = "";
                            if (columnId === "Todo") {
                              cardColorClass =
                                "bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-700";
                            } else if (columnId === "InProgress") {
                              cardColorClass =
                                "bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700";
                            } else if (columnId === "Done") {
                              cardColorClass =
                                "bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-700";
                            }

                            return (
                              <Draggable
                                key={item._id}
                                draggableId={item._id}
                                index={index}
                                isDragDisabled={!!editingItemId} // Disable dragging when editing
                              >
                                {(provided, snapshot) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-4 border ${cardColorClass} ${
                                      snapshot.isDragging
                                        ? "shadow-lg scale-105"
                                        : ""
                                    } transition-shadow transform duration-150 ease-in-out`}
                                    style={provided.draggableProps.style}
                                  >
                                    {editingItemId === item._id ? (
                                      // Edit Mode
                                      <CardContent className="pt-4 space-y-3">
                                        <div>
                                          <label
                                            htmlFor={`edit-title-${item._id}`}
                                            className="sr-only"
                                          >
                                            Edit Title
                                          </label>
                                          <Input
                                            id={`edit-title-${item._id}`}
                                            value={editedTitle}
                                            onChange={(e) =>
                                              setEditedTitle(e.target.value)
                                            }
                                            placeholder="Title"
                                            disabled={isSavingEdit}
                                            className="text-base font-semibold"
                                          />
                                        </div>
                                        <div>
                                          <label
                                            htmlFor={`edit-desc-${item._id}`}
                                            className="sr-only"
                                          >
                                            Edit Description
                                          </label>
                                          <Textarea
                                            id={`edit-desc-${item._id}`}
                                            value={editedDescription}
                                            onChange={(e) =>
                                              setEditedDescription(
                                                e.target.value
                                              )
                                            }
                                            placeholder="Description"
                                            disabled={isSavingEdit}
                                            rows={4}
                                            className="text-sm"
                                          />
                                        </div>
                                        {error &&
                                          editingItemId === item._id && (
                                            <Alert
                                              variant="destructive"
                                              className="text-xs p-2"
                                            >
                                              <AlertDescription>
                                                {error}
                                              </AlertDescription>
                                            </Alert>
                                          )}
                                        <div className="flex justify-end space-x-2 mt-3">
                                          <Button
                                            variant="ghost"
                                            onClick={handleEditCancel}
                                            disabled={isSavingEdit}
                                            size="sm"
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={handleEditSave}
                                            disabled={isSavingEdit}
                                            size="sm"
                                          >
                                            {isSavingEdit
                                              ? "Saving..."
                                              : "Save"}
                                          </Button>
                                        </div>
                                      </CardContent>
                                    ) : (
                                      // Display Mode
                                      <>
                                        <CardHeader className="pb-2 pt-3 px-4">
                                          <CardTitle className="text-base">
                                            {item.title}
                                          </CardTitle>
                                          <CardDescription className="text-sm pt-1">
                                            {item.description}
                                          </CardDescription>
                                        </CardHeader>
                                        <CardFooter className="flex justify-between items-center text-xs pt-2 pb-2 px-4">
                                          <Button
                                            variant="ghost"
                                            size="xs"
                                            className={`p-1 h-auto rounded-full ${
                                              votedItems.has(item._id)
                                                ? "text-blue-600 dark:text-blue-400 cursor-not-allowed"
                                                : "text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                            }`}
                                            onClick={() => handleVote(item._id)}
                                            disabled={
                                              votedItems.has(item._id) ||
                                              !!editingItemId
                                            }
                                            aria-label={
                                              votedItems.has(item._id)
                                                ? `Already voted for ${item.title}`
                                                : `Vote for ${item.title}`
                                            }
                                          >
                                            <ThumbsUp
                                              className={`h-4 w-4 mr-1 ${
                                                votedItems.has(item._id)
                                                  ? "fill-current"
                                                  : ""
                                              }`}
                                            />
                                            {item.votes}
                                          </Button>
                                          <div className="flex items-center space-x-1">
                                            <Button
                                              variant="ghost"
                                              size="xs"
                                              className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 p-1 h-auto rounded-full"
                                              onClick={() =>
                                                handleEditStart(item)
                                              }
                                              aria-label={`Edit ${item.title}`}
                                              disabled={!!editingItemId}
                                            >
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="xs"
                                              className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 p-1 h-auto rounded-full"
                                              onClick={() =>
                                                handleDelete(item._id)
                                              }
                                              aria-label={`Delete ${item.title}`}
                                              disabled={!!editingItemId}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </CardFooter>
                                      </>
                                    )}
                                  </Card>
                                )}
                              </Draggable>
                            );
                          })
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}
              </div>
              {/* End Content Area */}
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default FeedbackKanban;
