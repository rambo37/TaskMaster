export interface Task {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  _id: string;
}

export const getTaskStatus = (task: Task, thresholdHours: number) => {
  let status = "neutral";
  if (task.completed) {
    status = "completed";
  } else {
    const currentDate = new Date().valueOf();
    const taskDueDate = new Date(task.dueDate).valueOf();
    const threshold = 1000 * 60 * 60 * thresholdHours;

    // Expired task
    if (currentDate > taskDueDate) {
      status = "expired";
    }
    // Task has less than threshold hours left
    else if (currentDate + threshold > taskDueDate) {
      status = "urgent";
    }
  }
  return status;
};