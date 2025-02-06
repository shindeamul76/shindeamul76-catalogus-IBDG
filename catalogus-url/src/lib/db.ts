import mongoose from "mongoose";

const MONGO_URI = process.env.NEXT_PUBLIC_MONGODB_URI!;

if (!MONGO_URI) {
  throw new Error("MongoDB URI is missing in environment variables.");
}

let isConnected = false; 

export async function connect() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGO_URI);

    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}