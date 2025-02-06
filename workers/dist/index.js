"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const RedisManager_1 = require("./managers/RedisManager");
const worker_1 = require("./worker"); // Now we explicitly call startWorker()
const connect_1 = require("./db/connect");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, connect_1.connectDB)(config_1.MONGO_URL);
            console.log("✅ MongoDB connected");
            RedisManager_1.RedisManager.getInstance();
            console.log("✅ Redis connected");
            // Explicitly start the worker
            (0, worker_1.startWorker)();
            console.log("🚀 Worker is running...");
        }
        catch (error) {
            console.error("❌ Error starting services:", error);
            process.exit(1);
        }
    });
}
start();
