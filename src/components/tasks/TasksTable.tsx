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
import dayjs from "dayjs";
import { LoadingSkeleton } from "../loader/LoadingSkeleton";
import { toast } from "react-toastify";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
};

export default function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortAsc, setSortAsc] = useState(true); // ascending sort
  const [page, setPage] = useState(1);
  const perPage = 6;
  const router = useRouter();
  const [deleteTask, setDeleteTask] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (res.ok) {
          setTasks(data.tasks || []);
          setLoading(false);
        } else {
          console.error("Failed to fetch tasks:", data.error);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [deleteTask]);

  const filteredTasks = useMemo(() => {
    const filtered = tasks
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
      .filter((t) => (selectedStatus ? t.status === selectedStatus : true));

    return filtered.sort((a, b) =>
      sortAsc
        ? dayjs(a.dueDate).isAfter(dayjs(b.dueDate))
          ? 1
          : -1
        : dayjs(a.dueDate).isBefore(dayjs(b.dueDate))
        ? 1
        : -1
    );
  }, [search, selectedStatus, tasks, sortAsc]);

  const totalPages = Math.ceil(filteredTasks.length / perPage);
  const paginatedTasks = filteredTasks.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const handleDeleteTask = async (id: string) => {
    setDeleteTask(false);

    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Task deleted successfully!");
        setDeleteTask(true);
      } else {
        toast.error(`Failed to delete task: ${result.message}`);
      }
    } catch (error) {
      toast.error("Error deleting task");
    }
  };

  return (
    <div className="space-y-4 p-4 border mb-5 rounded-lg">
      {/* Search and Filters */}
      <div className="flex w-full gap-4 py-4 px-4 border-b items-center">
        <div className="w-1/2">
          <Input
            placeholder="Search task by title"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="w-1/2 flex gap-4 items-center">
          <Select
            onValueChange={(value) => {
              setSelectedStatus(value === "all" ? "" : value);
              setPage(1);
            }}
            value={selectedStatus || "all"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtering" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setSelectedStatus("");
            }}
          >
            Reset
          </Button>

          <Button
            variant="secondary"
            onClick={() => setSortAsc((prev) => !prev)}
          >
            Sort by Due Date: {sortAsc ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <>
          <LoadingSkeleton rows={8} columns={6} />
        </>
      ) : (
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
                      <span
                        className={`font-bold ${
                          task.status === "Pending"
                            ? "text-yellow-800"
                            : task.status === "In Progress"
                            ? "text-blue-700"
                            : "text-green-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {dayjs(task.dueDate).format("MMM D, YYYY")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/tasks/${task._id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/tasks/${task._id}`)}
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
      )}

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
