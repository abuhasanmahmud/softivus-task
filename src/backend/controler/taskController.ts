import { connectDB } from "@/lib/database";
import Task from "../models/Task";


type TaskInput = {
  title: string;
  description?: string;
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
};

export const createTask = async (data: TaskInput) => {
  try {
    await connectDB(); // ensure DB is connected

    const task = await Task.create({
      title: data.title,
      description: data.description || "",
      status: data.status,
      dueDate: data.dueDate,
    });

    return { success: true, data: task };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
