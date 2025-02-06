
import { MONGO_URL } from "./config";
import { RedisManager } from "./managers/RedisManager";
import { startWorker } from "./worker"; 
import { connectDB } from "./db/connect";

async function start() {
  try {
    
    await connectDB(MONGO_URL);
    console.log("✅ MongoDB connected");

    RedisManager.getInstance();
    console.log("✅ Redis connected");

    startWorker();
    console.log("🚀 Worker is running...");
  } catch (error) {
    console.error("❌ Error starting services:", error);
    process.exit(1);
  }
}

start();