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
  const {
    conflictId,
    user,
    text,
    parentThoughtId = null,
  } = await request.json();
  const newThought = {
    conflictId,
    user,
    text,
    likes: 0,
    dislikes: 0,
    parentThoughtId, // New field for threading
    createdAt: new Date(),
  };
  await db.collection("thoughts").insertOne(newThought);
  return NextResponse.json(newThought);
}

export async function PATCH(request) {
  const db = await connectToDatabase();
  const { thoughtId, action } = await request.json();

  const updateField = action === "like" ? { likes: 1 } : { dislikes: 1 };
  const result = await db
    .collection("thoughts")
    .findOneAndUpdate(
      { _id: new ObjectId(thoughtId) },
      { $inc: updateField },
      { returnDocument: "after" }
    );

  return NextResponse.json(result.value || {});
}
