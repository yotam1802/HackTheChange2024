// app/api/thoughts/route.js
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const conflictId = searchParams.get("conflictId");
  const db = await connectToDatabase();
  const thoughts = await db
    .collection("thoughts")
    .find({ conflictId })
    .toArray();
  return NextResponse.json(thoughts);
}

export async function POST(request) {
  const db = await connectToDatabase();
  const { conflictId, user, text } = await request.json();
  const newThought = {
    conflictId,
    user,
    text,
    likes: 0,
    dislikes: 0,
    createdAt: new Date(),
  };
  await db.collection("thoughts").insertOne(newThought);
  return NextResponse.json(newThought);
}

export async function PATCH(request) {
  const db = await connectToDatabase();
  const { thoughtId, action } = await request.json();

  // Determine the field to update based on the action
  const updateField = action === "like" ? { likes: 1 } : { dislikes: 1 };

  // Increment the appropriate field
  const result = await db
    .collection("thoughts")
    .findOneAndUpdate(
      { _id: new ObjectId(thoughtId) },
      { $inc: updateField },
      { returnDocument: "after" }
    );

  // Return updated thought as JSON
  return NextResponse.json(result.value || {});
}
