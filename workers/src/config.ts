import * as dotenv from "dotenv";
dotenv.config();


export const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "password";

export const MONGO_URL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";