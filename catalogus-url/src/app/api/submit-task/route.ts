

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connect } from "@/lib/db";
import Task from "@/models/TaskModel";
import { imageQueue } from "@/lib/ImageQueue"; 

export async function POST(req: Request) {
  try {

    await connect();


    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json(
        { status: "error", message: "Image URL is required" },
        { status: 400 }
      );
    }

    const taskId = uuidv4().toUpperCase();
    const newTask = {
      taskId,
      imageUrl,
      status: "Pending",
      pushedToQueue: false, 
      timestamp: new Date()
    };


    const createdTask = await Task.create(newTask);


    try {
      await imageQueue.add("verifyImage", { taskId });

      await Task.findByIdAndUpdate(createdTask._id, {
        pushedToQueue: true
      });
    } catch (queueErr) {
    
      console.error("Queue push failed:", queueErr);
    }


    return NextResponse.json(
      { status: "success", createdTask },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error in POST /submit-task:", error);
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 500 }
    );
  }
}