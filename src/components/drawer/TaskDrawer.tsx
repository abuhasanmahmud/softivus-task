"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";

// Schema
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["Pending", "In Progress", "Completed"]),
  dueDate: z.string().min(1, "Due date is required"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

type TaskDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setTaskUpdate: (open: boolean) => void;
  taskDetails: (Partial<TaskFormValues> & { _id?: string }) | null;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
};

const TaskDrawer = ({
  open,
  onOpenChange,
  setTaskUpdate,
  taskDetails,
  selectedDate,
  setSelectedDate,
}: TaskDrawerProps) => {
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

  // ✅ Set form values when taskDetails changes
  useEffect(() => {
    if (open && taskDetails) {
      setValue("title", taskDetails.title || "");
      setValue("description", taskDetails.description || "");
      setValue("status", taskDetails.status || "Pending");
      setValue("dueDate", taskDetails.dueDate || "");
    }
  }, [open, taskDetails, setValue]);

  console.log("taskDetails", taskDetails);

  // ✅ Optional: Reset form when drawer closes
  useEffect(() => {
    if (!open) {
      reset();
      setMessage("");
    }
  }, [open, reset]);

  const onSubmit = async (data: TaskFormValues) => {
    setTaskUpdate(false);

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
        setMessage(
          isUpdate
            ? "✅ Task updated successfully!"
            : "✅ Task created successfully!"
        );
        onOpenChange(false);
        setTaskUpdate(true);
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(
        isUpdate ? "❌ Failed to update task" : "❌ Failed to create task"
      );
    }
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="w-[500px]">
        <DrawerHeader>
          <DrawerTitle>{taskDetails ? "Edit Task" : "Add Task"}</DrawerTitle>
          <DrawerDescription>Fill in task details below.</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4 pb-4">
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
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                Joining Date
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                onChange={(e) => setSelectedDate(e.target.value)}
                name="joiningDate"
                value={selectedDate}
                type="date"
                placeholder="StaffJoiningDate"
                className="w-full rounded-lg bg-white bg-opacity-5 border border-gray-400 px-4 py-3 focus:ring-0 outline-none"
              />
            </div>
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

          <DrawerFooter className="flex flex-col gap-2 mt-4">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded"
            >
              {taskDetails?._id ? "Update" : "Submit"}
            </button>
            <DrawerClose asChild>
              <button type="button" className="w-full px-4 py-2 border rounded">
                Cancel
              </button>
            </DrawerClose>
            {message && <p className="text-center text-sm">{message}</p>}
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default TaskDrawer;
