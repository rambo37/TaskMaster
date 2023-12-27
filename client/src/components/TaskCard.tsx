import { Task } from "./Account";

type TaskCardProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <div className="task-card">
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
