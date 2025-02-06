"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TaskSchema = new mongoose_1.default.Schema({
    taskId: {
        type: String,
        required: true,
        unique: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Success", "Failed"],
        default: "Pending",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
const Task = mongoose_1.default.models.Task || mongoose_1.default.model("Task", TaskSchema);
exports.default = Task;
