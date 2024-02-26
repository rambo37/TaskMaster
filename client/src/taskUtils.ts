export interface Task {
  title: string;
  description: string;
  dueDate: string;
  priority: number;
  status: string;
  _id: string;
  tags: string[];
}

export const getTaskStatus = (task: Task, thresholdHours: number) => {
  let status = "upcoming";
  if (task.status === "Completed") {
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

export const getDateTimeString = (
  dueDate: string,
  selectedTimeFormat: string,
  selectedDateFormat: string
) => {
  const date = new Date(dueDate);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: selectedTimeFormat === "12 hours" ? true : false,
  };

  if (selectedDateFormat === "Written") {
    options.weekday = "long";
    options.month = "long";
  }

  return date.toLocaleString(undefined, options);
};
