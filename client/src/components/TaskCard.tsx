import { Task } from "./Account";

type TaskCardProps = {
  task: Task;
  thresholdHours: number
};

const TaskCard = ({ task, thresholdHours }: TaskCardProps) => {
  let status = "neutral";

  if (task.completed) {
    status = "complete";
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

  return (
    <div className={`task-card ${status}`}>
      <div className="title-div">
        <h3>{task.title}</h3>
        <i className="bi bi-pencil"></i>
        <i className="bi bi-trash"></i>
      </div>
      <p className="description">
        {task.description ? task.description : "No description provided."}
      </p>
      <p>Due: {new Date(task.dueDate).toLocaleString()}</p>
      <p>{`Status: ${task.completed ? "Completed" : "Not completed"}.`}</p>
    </div>
  );
};

export default TaskCard;
