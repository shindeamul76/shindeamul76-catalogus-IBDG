import { Queue } from "bullmq";
import { RedisOptions } from "ioredis";

const REDIS_URL = process.env.NEXT_PUBLIC_REDIS_URL!;


const redisOptions: RedisOptions = {
  maxRetriesPerRequest: null,
};


if (REDIS_URL.startsWith("redis://")) {
  redisOptions.host = REDIS_URL.split("@")[1]?.split(":")[0]; 
  redisOptions.port = Number(REDIS_URL.split(":").pop());


  const credentials = REDIS_URL.split("@")[0].replace("redis://", "").split(":");
  if (credentials.length === 2) {
    redisOptions.username = credentials[0];
    redisOptions.password = credentials[1];
  }
} else {
  redisOptions.host = REDIS_URL;
}


export const imageQueue = new Queue("imageQueue", {
  connection: redisOptions,
});