import axios from "axios";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useAccountContext } from "../components/Account";
import { isFutureDate, isInvalidDate } from "../utils";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useAccountContext();

  const handleTaskCreateSubmit = async (e: React.MouseEvent) => {
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

      const taskDetails = {
        title: title,
        description: description,
        dueDate: date,
      };

      const response = await axios.post(
        `/users/${user._id}/tasks`,
        taskDetails,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      toast.success("Task created successfully.");
      setTitle("");
      setDescription("");
      setDueDate("");
      // Update the user's task array with the details of this newly created
      // task so it is visible throughout the application without the user
      // having to refresh their browser
      const updatedTasks = user.tasks.slice();
      updatedTasks.push(response.data);
      const updatedUser = {
        ...user,
        tasks: [...user.tasks, response.data],
      };
      setUser(updatedUser);
    } catch (error: any) {
      console.error(error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-task-page">
      <h1>Create task</h1>
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
        <input
          type="submit"
          className="submit-button"
          value="Create task"
          onClick={(e) => handleTaskCreateSubmit(e)}
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

export default CreateTask;