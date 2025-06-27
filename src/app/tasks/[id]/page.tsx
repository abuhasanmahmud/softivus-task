import { connectDB } from "@/lib/database";
import Task from "@/backend/models/Task";
import { notFound } from "next/navigation";
import { TaskType } from "@/lib/type/task";

type Props = {
  params: { id: string };
};

export default async function TaskDetailsPage({ params }: Props) {
  await connectDB();

  let task: TaskType | null = null;

  try {
    task = await Task.findById(params.id).lean<TaskType>();
  } catch (error) {
    // invalid ObjectId format, treat as not found
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">
          Invalid Task ID
        </h1>
        <p>Please check the URL — this task does not exist.</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">
          Task Not Found
        </h1>
        <p>This task could not be found in the database.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Task Details</h1>
      <p>
        <strong>Title:</strong> {task.title}
      </p>
      <p>
        <strong>Description:</strong> {task.description}
      </p>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
      <p>
        <strong>Due Date:</strong> {task.dueDate}
      </p>
    </div>
  );
}
