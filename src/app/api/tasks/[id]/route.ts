import { connectDB } from "@/lib/database";
import Task from "@/backend/models/Task";
import { NextRequest, NextResponse } from "next/server";

// GET a single task
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await connectDB();

  try {
    const task = await Task.findById(params.id);

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch task", error: error.message },
      { status: 500 }
    );
  }
};

// PUT (Update task)
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await connectDB();

  try {
    const data = await req.json();

    const updatedTask = await Task.findByIdAndUpdate(
      params.id,
      {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate,
      },
      { new: true } // return updated doc
    );

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "✅ Task updated successfully", task: updatedTask },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "❌ Failed to update task", error: error.message },
      { status: 500 }
    );
  }
};

// DELETE (Delete task)
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await connectDB();

  try {
    const deletedTask = await Task.findByIdAndDelete(params.id);

    if (!deletedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "✅ Task deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "❌ Failed to delete task", error: error.message },
      { status: 500 }
    );
  }
};
