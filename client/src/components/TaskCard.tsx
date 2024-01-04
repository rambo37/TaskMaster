import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { User } from "./Account";
import { getTaskStatus, Task } from "../taskUtils";

type TaskCardProps = {
  user: User;
  setUser: React.Dispatch<User>;
  task: Task;
  thresholdHours: number;
  expanded: boolean;
  handleClick: (task: Task) => void;
  setExpandedTask: React.Dispatch<Task | null>;
};

const TaskCard = ({
  user,
  setUser,
  task,
  thresholdHours,
  expanded,
  handleClick,
  setExpandedTask,
}: TaskCardProps) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteIconClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowDeleteConfirmation(true);
  };

  const handleTaskDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setLoading(true);
    try {
      await axios.delete(`/users/${user._id}/tasks/${task._id}`);

      // Remove this task in the frontend by updating the tasks array
      // of the user object
      const updatedTasks = user.tasks.slice();
      updatedTasks.splice(user.tasks.indexOf(task), 1);
      const updatedUser = {
        ...user,
        tasks: updatedTasks,
      };
      setUser(updatedUser);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to delete task. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskDeleteCancel = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowDeleteConfirmation(false);
  };

  const status = getTaskStatus(task, thresholdHours);

  return (
    <div
      className={`task-card ${status} ${expanded ? "expanded" : ""}`}
      onClick={() => handleClick(task)}
    >
      <div className="title-div">
        <h3>{task.title}</h3>
        <i
          className="bi bi-pencil"
          onClick={() => navigate(`/tasks/${task._id}`)}
        ></i>
        <i
          className="bi bi-trash"
          onClick={(e) => handleDeleteIconClick(e)}
        ></i>
      </div>
      <div className="content-div">
        {showDeleteConfirmation ? (
          <>
            <p>Are you sure you want to delete this task?</p>
            <button onClick={(e) => handleTaskDelete(e)}>Yes</button>
            <button onClick={(e) => handleTaskDeleteCancel(e)}>No</button>
            {loading && (
              <div style={{ textAlign: "center" }}>
                <ClipLoader />
              </div>
            )}
          </>
        ) : (
          <>
            <p className="description">
              {task.description || "No description provided."}
            </p>
            <p>Due: {new Date(task.dueDate).toLocaleString().slice(0, -3)}</p>
            <p>{`Status: ${
              task.completed ? "Completed" : "Not completed"
            }.`}</p>
          </>
        )}
        {expanded && (
          <button onClick={() => setExpandedTask(null)}>Close</button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
