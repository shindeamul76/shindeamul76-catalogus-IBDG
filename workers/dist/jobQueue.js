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
exports.addImageTask = exports.imageQueue = void 0;
const bullmq_1 = require("bullmq");
const RedisManager_1 = require("./managers/RedisManager");
exports.imageQueue = new bullmq_1.Queue("imageQueue", {
    connection: RedisManager_1.RedisManager.getInstance().getClient(),
});
const addImageTask = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.imageQueue.add("verifyImage", { taskId }, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
    });
});
exports.addImageTask = addImageTask;
