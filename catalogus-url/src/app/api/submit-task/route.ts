import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connect } from "@/lib/db";
import { redisClient, redisConnect } from "@/lib/redis";
import Task from "@/models/TaskModel";
import { TaskData } from "@/types/task-type";

async function generateUniqueTaskId(): Promise<string> {
  let taskId: string;
  let isUnique = false;
  
  do {
    taskId = uuidv4().toUpperCase();
    const existingTask = await Task.findOne({ taskId });
    if (!existingTask) {
      isUnique = true;
    }
  } while (!isUnique);
  
  return taskId;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    await connect();
    await redisConnect();
    
    const { imageUrl }: { imageUrl: string } = await req.json();
    if (!imageUrl) {
      return NextResponse.json(
        { status: "error", message: "Image URL is required" },
        { status: 400 }
      );
    }

    const taskId: string = await generateUniqueTaskId();
    const newTask: TaskData = {
      taskId,
      imageUrl,
      status: "Pending",
      timestamp: new Date().toISOString(),
    };

    await Task.create(newTask);
    
    if (redisClient) {
      await redisClient.lpush("taskQueue", JSON.stringify(newTask));
    } else {
      console.error("Redis client is not connected");
    }

    return NextResponse.json({ status: "success", taskId, newTask }, { status: 201 });
  } catch (error) {
    console.error("Task submission failed:", error);
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 500 }
    );
  }
}