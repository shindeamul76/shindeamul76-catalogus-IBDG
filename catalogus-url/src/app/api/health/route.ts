import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/lib/db";

export async function GET() {
  try {
    await connect();

    const isDbConnected = mongoose.connection.readyState === 1;

    return NextResponse.json({
      status: "healthy",
      database: isDbConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) { 
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}