import Redis from "ioredis";
import { REDIS_URL } from "../config";

export class RedisManager {
  private static instance: RedisManager;
  private client: Redis;

  private constructor() {
    this.client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: null,
    });
    this.client.on("connect", () => console.log("Redis connected"));
    this.client.on("error", (err) => console.error("Redis error:", err));
  }

  public static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  public getClient(): Redis {
    return this.client;
  }
}