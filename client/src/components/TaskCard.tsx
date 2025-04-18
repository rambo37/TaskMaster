import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { User } from "./Account";
import { getDateTimeString, getTaskStatus, Task } from "../taskUtils";

type TaskCardProps = {
  user: User;
  setUser: React.Dispatch<User>;
  task: Task;
  thresholdHours: number;
  expanded: boolean;
  handleClick: (task: Task) => void;
  setExpandedTask: React.Dispatch<Task | null>;
  selectedDateFormat: string;
  selectedTimeFormat: string;
  checkAndWarnForUnsavedChanges: (e: React.MouseEvent) => boolean;
};

const TaskCard = ({
  user,
  setUser,
  task,
  thresholdHours,
  expanded,
  handleClick,
  setExpandedTask,
  selectedDateFormat,
  selectedTimeFormat,
  checkAndWarnForUnsavedChanges,
}: TaskCardProps) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredOverEditIcon, setHoveredOverEditIcon] = useState(false);
  const [hoveredOverDeleteIcon, setHoveredOverDeleteIcon] = useState(false);
  const navigate = useNavigate();

  const handleEditIconClick = (event: React.MouseEvent) => {
    if (checkAndWarnForUnsavedChanges(event)) navigate(`/tasks/${task._id}`);
    else event.stopPropagation();
  };

  const handleDeleteIconClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowDeleteConfirmation(true);
  };

  const handleTaskDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setLoading(true);
    try {
      await axios.delete(`/api/users/${user._id}/tasks/${task._id}`);

      // Work out the new array of tags to be stored for the user using a Set
      // to avoid duplicates
      const tagsSet = new Set<string>();
      // Add the tags of all user tasks excluding this one that is to be deleted
      user.tasks.forEach((userTask) => {
        if (userTask._id !== task._id)
          userTask.tags.forEach((tag) => tagsSet.add(tag));
      });
      const newTags = Array.from(tagsSet);

      // Remove this task in the frontend by updating the tasks array of the
      // user object. Also update the tags array so that tags that were only
      // used in this task are no longer stored after this task was deleted.
      const updatedTasks = user.tasks.slice();
      updatedTasks.splice(user.tasks.indexOf(task), 1);
      const updatedUser = {
        ...user,
        tasks: updatedTasks,
        tags: newTags,
      };
      setUser(updatedUser);
      setExpandedTask(null); // Hide the expanded task in case it was showing

      // Update the user asynchronously so that their new tags will be saved
      // for when they next log in, but without creating longer wait times
      if (JSON.stringify(user.tags) !== JSON.stringify(newTags)) {
        axios.patch(`/api/users/${user._id}`, { tags: newTags });
      }
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
          className={`bi bi-pencil${hoveredOverEditIcon ? "-fill" : ""}`}
          onClick={(e) => handleEditIconClick(e)}
          onMouseEnter={() => setHoveredOverEditIcon(true)}
          onMouseLeave={() => setHoveredOverEditIcon(false)}
        ></i>
        <i
          className={`bi bi-trash${hoveredOverDeleteIcon ? "-fill" : ""}`}
          onClick={(e) => handleDeleteIconClick(e)}
          onMouseEnter={() => setHoveredOverDeleteIcon(true)}
          onMouseLeave={() => setHoveredOverDeleteIcon(false)}
        ></i>
      </div>
      <div className="content-div">
        {showDeleteConfirmation ? (
          <>
            <div className="delete-confirm-text">
              Are you sure you want to delete this task?
            </div>
            <div className="delete-options">
              <button onClick={(e) => handleTaskDelete(e)}>Yes</button>
              <button onClick={(e) => handleTaskDeleteCancel(e)}>No</button>
            </div>
            {loading && (
              <div style={{ textAlign: "center" }}>
                <ClipLoader />
              </div>
            )}
          </>
        ) : (
          <>
            <p className="description">
              <span className="task-property-label">Description: </span>
              {task.description || "No description provided."}
            </p>
            <p>
              <span className="task-property-label">Due: </span>
              {getDateTimeString(
                task.dueDate,
                selectedTimeFormat,
                selectedDateFormat
              )}
            </p>
            <p>
              <span className="task-property-label">Priority: </span>
              {`${task.priority === -1 ? "Unspecified." : task.priority}`}
            </p>
            <p>
              <span className="task-property-label">Status: </span>
              {`${task.status}.`}
            </p>
            {task.tags.length ? (
              <div className="tags-wrapper">
                <div>
                  <span className="task-property-label">Tags: </span>
                </div>
                <div className="tags-div">
                  {task.tags.map((tag) => {
                    return (
                      <div key={tag} className="react-tags__tag">
                        {tag}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p>
                <span className="task-property-label">Tags: </span>None.
              </p>
            )}
          </>
        )}
      </div>
      {expanded && (
        <div className="task-card-footer">
          <button
            className="close-button"
            onClick={() => setExpandedTask(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
