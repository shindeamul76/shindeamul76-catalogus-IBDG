export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Task from "@/models/TaskModel";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    await connect();
    
    const { searchParams } = new URL(req.url);
    const page: number = parseInt(searchParams.get("page") || "1", 10);
    const limit: number = parseInt(searchParams.get("limit") || "10", 10);
    const skip: number = (page - 1) * limit;

    const totalTasks: number = await Task.countDocuments();
    const tasks = await Task.find({})
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      // .lean();

    return NextResponse.json(
      {
        status: "success",
        page,
        totalPages: Math.ceil(totalTasks / limit),
        totalTasks,
        tasks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetching tasks failed:", error);
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 500 }
    );
  }
}