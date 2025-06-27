import Task from "@/backend/models/Task";
import { connectDB } from "@/lib/database";

import { NextRequest, NextResponse } from "next/server";

// GET all tasks
export const GET = async () => {
  await connectDB();

  try {
    const tasks = await Task.find().sort({ _id: -1 });

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ error: "No tasks found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Successfully retrieved all tasks", tasks },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error retrieving tasks", error: error.message },
      { status: 500 }
    );
  }
};

// POST a new task
export const POST = async (req: NextRequest) => {
  await connectDB();

  try {
    const data = await req.json();

    const newTask = new Task({
      title: data.title,
      description: data.description,
      status: data.status,
      dueDate: data.dueDate,
    });

    const task = await newTask.save();

    return NextResponse.json(
      { message: "✅ Task created successfully", task },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "❌ Failed to create task", error: error.message },
      { status: 500 }
    );
  }
};
