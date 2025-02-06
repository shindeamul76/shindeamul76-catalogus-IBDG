import { Worker } from "bullmq";
import { RedisManager } from "./managers/RedisManager";
import axios from "axios";
import TaskModel from "./models/TaskModel";

/**
 * Starts a worker that processes jobs from the "imageQueue".
 * 
 * The worker processes each job by:
 * 1. Logging the task ID.
 * 2. Updating the task status to "Processing".
 * 3. Waiting for 60 seconds.
 * 4. Attempting to fetch the image URL associated with the task.
 * 5. Updating the task status to "Success" if the fetch is successful, or "Failed" if it is not.
 * 
 * The worker has a concurrency of 2, meaning it can process up to 2 jobs simultaneously.
 * 
 * The worker logs a message when a job is completed or failed.
 * 
 * @returns {Worker} The initialized worker instance.
 */
export function startWorker() {
  const worker = new Worker(
    "imageQueue",
    async (job) => {
      const { taskId } = job.data;
      console.log(`Processing task ${taskId}`);

      const task = await TaskModel.findOneAndUpdate({ taskId }, { status: "Processing" });
      if (!task) return;

      await new Promise((resolve) => setTimeout(resolve, 60000));

      try {
        await axios.get(task.imageUrl, { timeout: 5000 });
        await TaskModel.findOneAndUpdate({ taskId }, { status: "Success" });
      } catch {
        await TaskModel.findOneAndUpdate({ taskId }, { status: "Failed" });
      }
    },
    {
      concurrency: 2,
      connection: RedisManager.getInstance().getClient(),
    }
  );

  worker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err);
  });

  return worker;
}