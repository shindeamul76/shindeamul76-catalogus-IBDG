"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisManager = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("../config");
class RedisManager {
    constructor() {
        this.client = new ioredis_1.default(config_1.REDIS_URL, {
            maxRetriesPerRequest: null,
        });
        this.client.on("connect", () => console.log("Redis connected"));
        this.client.on("error", (err) => console.error("Redis error:", err));
    }
    static getInstance() {
        if (!RedisManager.instance) {
            RedisManager.instance = new RedisManager();
        }
        return RedisManager.instance;
    }
    getClient() {
        return this.client;
    }
}
exports.RedisManager = RedisManager;
