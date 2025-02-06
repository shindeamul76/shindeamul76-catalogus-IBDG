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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWorker = startWorker;
const bullmq_1 = require("bullmq");
const RedisManager_1 = require("./managers/RedisManager");
const axios_1 = __importDefault(require("axios"));
const TaskModel_1 = __importDefault(require("./models/TaskModel"));
function startWorker() {
    const worker = new bullmq_1.Worker("imageQueue", (job) => __awaiter(this, void 0, void 0, function* () {
        const { taskId } = job.data;
        console.log(`Processing task ${taskId}`);
        const task = yield TaskModel_1.default.findOneAndUpdate({ taskId }, { status: "Processing" });
        if (!task)
            return;
        yield new Promise((resolve) => setTimeout(resolve, 60000));
        try {
            yield axios_1.default.get(task.imageUrl, { timeout: 5000 });
            yield TaskModel_1.default.findOneAndUpdate({ taskId }, { status: "Success" });
        }
        catch (_a) {
            yield TaskModel_1.default.findOneAndUpdate({ taskId }, { status: "Failed" });
        }
    }), {
        concurrency: 2,
        connection: RedisManager_1.RedisManager.getInstance().getClient(),
    });
    worker.on("completed", (job) => {
        console.log(`✅ Job ${job.id} completed`);
    });
    worker.on("failed", (job, err) => {
        console.error(`❌ Job ${job === null || job === void 0 ? void 0 : job.id} failed:`, err);
    });
    return worker;
}
