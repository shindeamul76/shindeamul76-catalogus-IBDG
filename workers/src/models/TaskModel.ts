import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
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
  pushedToQueue: { 
    type: Boolean, 
    default: false 
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
