"use client";

import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import { TaskType } from "@/lib/type/task";
import { toast } from "react-toastify";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["Pending", "In Progress", "Completed"]),
  dueDate: z.string().min(1, "Due date is required"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

type TaskPageProps = {
  taskDetails: TaskType | null;
};

const TaskForm = ({ taskDetails }: TaskPageProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (taskDetails) {
      setValue("title", taskDetails.title || "");
      setValue("description", taskDetails.description || "");
      setValue("status", taskDetails.status || "Pending");
      setValue("dueDate", taskDetails.dueDate || "");
    }
  }, [taskDetails, setValue]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: TaskFormValues) => {
    setLoading(true);
    const isUpdate = taskDetails && taskDetails._id;
    const endpoint = isUpdate ? `/api/tasks/${taskDetails._id}` : "/api/tasks";
    const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setLoading(false);

        if (isUpdate) {
          toast.success("Task update successfully!");
        } else {
          toast.success("Task created successfully!");
          reset();
        }
      } else {
        setMessage(`❌ Error: ${result.message}`);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      if (isUpdate) {
        toast.error("Task update erro!");
      } else {
        toast.error("Task created error!");
      }
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {taskDetails ? "Edit Task" : "Create Task"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <input
            id="title"
            {...register("title")}
            className="w-full border px-2 py-1 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register("description")}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            {...register("status")}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <input
            id="dueDate"
            type="date"
            {...register("dueDate")}
            className="w-full border px-2 py-1 rounded"
          />
          {errors.dueDate && (
            <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {taskDetails?._id ? "Update Task" : "Create Task"}
        </button>
        {loading && (
          <p className="text-center text-sm">
            {taskDetails ? "task updating... " : "task creating..."}
          </p>
        )}
        {message && <p className="text-center text-sm">{message}</p>}
      </form>
    </main>
  );
};

export default TaskForm;
