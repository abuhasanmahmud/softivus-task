"use client";
import dayjs from "dayjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskDrawer from "@/components/drawer/TaskDrawer";
import TaskTable from "@/components/tasks/TasksTable";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [taskedUpdate, setTaskUpdate] = useState(false);
  const [taskDetails, setTaskDetails] = useState({});

  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  return (
    <div>
      <TaskDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        setTaskUpdate={setTaskUpdate}
        taskDetails={taskDetails}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div className="flex items-center justify-between py-6 border px-4 mb-2 rounded-lg">
        <h2>Tasks Lists</h2>
      </div>

      <TaskTable
        taskedUpdate={taskedUpdate}
        setTaskDetails={setTaskDetails}
        setDrawerOpen={setDrawerOpen}
        setTaskUpdate={setTaskUpdate}
      />
    </div>
  );
};

export default Page;
