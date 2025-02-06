import Redis from "ioredis";

const REDIS_URL = process.env.NEXT_PUBLIC_REDIS_URL!;

if (!REDIS_URL) {
  throw new Error("Redis URL is missing in environment variables.");
}

let redisClient: Redis | null = null;

export async function redisConnect() {
  if (!redisClient) {
    redisClient = new Redis(REDIS_URL);
    console.log("Redis connected successfully");
  }
}

export { redisClient };
