export interface TaskType {
  _id: string;
  title: string;
  description?: string;
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
}
