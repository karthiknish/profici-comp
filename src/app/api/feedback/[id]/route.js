import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT handler to update a specific feedback item (e.g., status or increment votes)
export async function PUT(request, context) {
  const { id } = context.params; // Access params from context inside the function
  const body = await request.json();
  // Expecting 'status', 'action: "vote"', or 'title'/'description'
  const { status, action, title, description } = body;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid feedback ID format" },
      { status: 400 }
    );
  }

  // Determine update operation based on request body
  let updateDoc = null; // Use null to indicate no valid update found yet

  if (action === "vote") {
    // Case 1: Increment votes
    updateDoc = { $inc: { votes: 1 } };
  } else if (status !== undefined) {
    // Case 2: Update status
    const validStatuses = ["Todo", "InProgress", "Done"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          message: `Invalid status value. Must be one of: ${validStatuses.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }
    updateDoc = { $set: { status: status } };
  } else if (title !== undefined && description !== undefined) {
    // Case 3: Update title and description
    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof description !== "string"
    ) {
      return NextResponse.json(
        {
          message:
            "Title must be a non-empty string, and description must be a string.",
        },
        { status: 400 }
      );
    }
    updateDoc = { $set: { title: title.trim(), description: description } };
  }

  // Check if a valid update operation was determined
  if (!updateDoc) {
    return NextResponse.json(
      {
        message:
          "Invalid update request. Provide 'status', 'action: \"vote\"', or both 'title' and 'description'.",
      },
      { status: 400 }
    );
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("feedback");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateDoc,
      { returnDocument: "after" } // Return the updated document
    );

    if (!result) {
      // findOneAndUpdate returns null if no document matched
      return NextResponse.json(
        { message: "Feedback item not found" },
        { status: 404 }
      );
    }

    // Return the updated item
    const updatedItem = { ...result, _id: result._id.toString() };
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Error updating feedback item:", error);
    return NextResponse.json(
      { message: "Error updating feedback item", error: error.message },
      { status: 500 }
    );
  }
}

// TODO: Add PATCH handler if partial updates with different logic are needed

// DELETE handler to remove a feedback item
export async function DELETE(request, context) {
  const { id } = context.params; // Access params from context inside the function

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid feedback ID format" },
      { status: 400 }
    );
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("feedback");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Feedback item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Feedback item deleted successfully" },
      { status: 200 } // Or 204 No Content
    );
  } catch (error) {
    console.error("Error deleting feedback item:", error);
    return NextResponse.json(
      { message: "Error deleting feedback item", error: error.message },
      { status: 500 }
    );
  }
}
