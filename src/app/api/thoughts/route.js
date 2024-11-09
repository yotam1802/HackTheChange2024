// app/api/thoughts/route.js
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

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
  const newThought = { conflictId, user, text, createdAt: new Date() };
  await db.collection("thoughts").insertOne(newThought);
  return NextResponse.json(newThought);
}
