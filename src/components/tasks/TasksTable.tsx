"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "lucide-react";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
};

export default function TaskTable({
  taskedUpdate,
  setTaskDetails,
  setDrawerOpen,
  setTaskUpdate,
}: any) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const router = useRouter();

  // ✅ Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (res.ok) {
          setTasks(data.tasks || []);
        } else {
          console.error("Failed to fetch tasks:", data.error);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [taskedUpdate]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
      .filter((t) => (selectedStatus ? t.status === selectedStatus : true));
  }, [search, selectedStatus, tasks]);

  const totalPages = Math.ceil(filteredTasks.length / perPage);
  const paginatedTasks = filteredTasks.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const handelDeleteTask = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
    setTaskUpdate(false);

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Task deleted successfully!");
        setTaskUpdate(true); // Trigger re-fetch or refresh list
      } else {
        alert(`❌ Failed to delete task: ${result.message}`);
      }
    } catch (error) {
      alert("❌ Error deleting task");
    }
  };

  return (
    <div className="space-y-4 p-4 border mb-5 rounded-lg">
      {/* Search and Filters */}
      <div className="flex w-full gap-4 py-4 px-4 border-b">
        <div className="w-2/3">
          <Input
            placeholder="Search task"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset to page 1 on search
            }}
          />
        </div>

        <div className="w-1/3 flex gap-4">
          <Select
            onValueChange={(value) => {
              setSelectedStatus(value === "all" ? "" : value);
              setPage(1); // reset to page 1 on filter
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="secondary"
            onClick={() => {
              setSearch("");
              setSelectedStatus("");
            }}
          >
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTasks.length > 0 ? (
              paginatedTasks.map((task, index) => (
                <TableRow key={task._id}>
                  <TableCell>{(page - 1) * perPage + index + 1}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    {task.status === "Pending" && (
                      <span className="text-yellow-800 font-bold">Pending</span>
                    )}
                    {task.status === "In Progress" && (
                      <span className="text-blue-700 font-bold">
                        In Progress
                      </span>
                    )}
                    {task.status === "Completed" && (
                      <span className="text-green-800  font-bold">
                        Completed
                      </span>
                    )}
                  </TableCell>

                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setTaskDetails(task), setDrawerOpen(true);
                        }}
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handelDeleteTask(task._id)}
                        size="sm"
                        variant="destructive"
                      >
                        Delete
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/task-details/${task._id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.max(1, prev - 1));
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.min(totalPages, prev + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
