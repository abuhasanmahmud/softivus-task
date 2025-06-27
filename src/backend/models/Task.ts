import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    dueDate: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Safely check for existing model
const Task = mongoose.models?.Task || mongoose.model("Task", TaskSchema);

export default Task;
