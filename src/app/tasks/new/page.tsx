import TaskForm from "@/components/tasks/TaskForm";
import { TaskType } from "@/lib/type/task";

const page = () => {
  let task: TaskType | null = null;

  return (
    <>
      <TaskForm taskDetails={task} />
    </>
  );
};

export default page;
