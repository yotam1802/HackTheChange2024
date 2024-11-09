// app/api/auth/register/route.js
import { connectToDatabase } from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password } = await req.json();
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  // Check if user already exists
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "User already exists" }), {
      status: 409,
    });
  }

  // Hash password and store user
  const hashedPassword = bcrypt.hashSync(password, 10);
  await usersCollection.insertOne({ email, password: hashedPassword });

  return new Response(JSON.stringify({ message: "User registered" }), {
    status: 201,
  });
}
