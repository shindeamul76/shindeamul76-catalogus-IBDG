// app/api/queue/retry/route.ts
import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Task from "@/models/TaskModel";
import { imageQueue } from "@/lib/ImageQueue";

export async function GET() {
  try {
    await connect();
    
    const unpushedTasks = await Task.find({ pushedToQueue: false });
    
    for (const task of unpushedTasks) {
      try {
        await imageQueue.add("verifyImage", { taskId: task.taskId });
        task.pushedToQueue = true;
        await task.save();
      } catch (err) {
        console.error("Failed to push to queue for", task.taskId, err);
      }
    }
    
    return NextResponse.json({
      status: "success",
      message: `Retried queue push for ${unpushedTasks.length} tasks.`
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 500 }
    );
  }
}