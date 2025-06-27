// app/tasks/[id]/edit/page.tsx or similar
import Task from "@/backend/models/Task";
import TaskForm from "@/components/tasks/TaskForm";
import { connectDB } from "@/lib/database";
import { TaskType } from "@/lib/type/task";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

const Page = async ({ params }: Props) => {
  await connectDB();

  let task: TaskType | null = null;

  try {
    task = await Task.findById(params.id).lean<TaskType>();
    if (!task) return notFound(); // Task not found
  } catch (error) {
    // If ID format is invalid (e.g. not a valid Mongo ObjectId)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">
          Invalid Task ID
        </h1>
        <p>Please check the URL — this task does not exist.</p>
      </div>
    );
  }

  return (
    <>
      <TaskForm taskDetails={task} />
    </>
  );
};

export default Page;
