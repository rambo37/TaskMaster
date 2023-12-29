import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Task, useAccountContext } from "../components/Account";
import { useParams } from "react-router-dom";
import { isFutureDate, isInvalidDate } from "../utils";
import axios from "axios";
import { toast } from "react-toastify";

const EditTask = () => {
  const { taskId } = useParams();
  const [user, setUser] = useAccountContext();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const statusCompleted = "Completed";
  const statusNotCompleted = "Not completed";

  useEffect(() => {
    user.tasks.forEach((userTask) => {
      if (userTask._id === taskId) {
        setTask(userTask);
        setTitle(userTask.title);
        setDescription(userTask.description);
        setDueDate(userTask.dueDate.slice(0, -1));
        setSelectedOption(
          userTask.completed ? statusCompleted : statusNotCompleted
        );
        console.log(userTask);
      }
    });
  }, []);

  if (!task) {
    return (
      <div className="error-div">
        Something went wrong trying to load the task. Please try again later.
      </div>
    );
  }

  const taskHasChanges = () => {
    if (task.title !== title) return true;
    if (task.description !== description) return true;
    if (task.dueDate !== new Date(dueDate).toISOString()) return true;
    return task.completed !== updatedTaskIsCompleted();
  };

  const updatedTaskIsCompleted = () => {
    return selectedOption === statusCompleted;
  };

  const handleTaskUpdateSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title) {
      setError("Please provide a title for the task.");
      setLoading(false);
      return;
    }

    try {
      const date = new Date(dueDate);

      if (isInvalidDate(date)) {
        setError("Please provide the date and time that the task is due.");
        setLoading(false);
        return;
      }

      if (!isFutureDate(date)) {
        setError("Please input a date and time in the future.");
        setLoading(false);
        return;
      }

      if (!taskHasChanges()) {
        setError("No changes have been made.");
        setLoading(false);
        return;
      }

      const updates = {
        title: title,
        description: description,
        dueDate: date,
        completed: updatedTaskIsCompleted(),
      };

      const response = await axios.patch(
        `/users/${user._id}/tasks/${taskId}`,
        updates,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      toast.success("Task updated successfully.");

      // Update the user's task array with the details of this edited task so
      // the changes are visible throughout the application without the user
      // having to refresh their browser
      const updatedTasks = user.tasks.slice();
      const updatedTask = response.data;
      updatedTasks[updatedTasks.indexOf(task)] = updatedTask;
      const updatedUser = {
        ...user,
        tasks: updatedTasks,
      };
      setTask(updatedTask);
      setUser(updatedUser);
    } catch (error: any) {
      console.error(error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-task-page">
      <h1>Edit task</h1>
      <form>
        <input
          type="text"
          placeholder="Title"
          className="max-width-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <textarea
          className="max-width-input"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          className="max-width-input"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        ></input>
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="max-width-input"
        >
          <option>{statusCompleted}</option>
          <option>{statusNotCompleted}</option>
        </select>
        <input
          type="submit"
          className="submit-button"
          value="Update task"
          onClick={(e) => handleTaskUpdateSubmit(e)}
        />
        {loading && (
          <div style={{ textAlign: "center" }}>
            <ClipLoader />
          </div>
        )}
        {error && <div className="status error">{error}</div>}
      </form>
    </div>
  );
};

export default EditTask;
