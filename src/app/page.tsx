"use client";
import dayjs from "dayjs";

import TaskTable from "@/components/tasks/TasksTable";

const Page = () => {
  return (
    <div>
      <div className="flex items-center justify-between py-6 border px-4 mb-2 rounded-lg">
        <h2>Tasks Lists</h2>
      </div>

      <TaskTable />
    </div>
  );
};

export default Page;
