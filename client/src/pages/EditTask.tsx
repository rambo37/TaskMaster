import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useAccountContext } from "../components/Account";
import { useParams } from "react-router-dom";
import {
  isInvalidDate,
  stringArrayToTagArray,
  tagArrayToStringArray,
} from "../utils";
import axios from "axios";
import { toast } from "react-toastify";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Task } from "../taskUtils";
import { Tag } from "react-tag-autocomplete";
import TagSelector from "../components/TagSelector";

const EditTask = () => {
  const { taskId } = useParams();
  const { user, setUser, setUnsavedChanges } = useAccountContext();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(-1);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const statusCompleted = "Completed";
  const statusNotCompleted = "Not completed";
  const [tags, setTags] = useState<Tag[]>([]);
  const [suggestions, setSuggestions] = useState<Tag[]>(
    stringArrayToTagArray(user.tags)
  );

  useEffect(() => {
    user.tasks.forEach((userTask) => {
      if (userTask._id === taskId) {
        setTask(userTask);
        setTitle(userTask.title);
        setDescription(userTask.description);
        setPriority(userTask.priority);
        setDueDate(userTask.dueDate.slice(0, -1));
        setTags(stringArrayToTagArray(userTask.tags));
        setSelectedOption(
          userTask.completed ? statusCompleted : statusNotCompleted
        );
      }
    });
  }, []);

  // Update the unsavedChanges state variable in the Layout component
  // whenever the task gets changed so that the user will be warned
  // of losing unsaved changes if they attempt to leave the site.
  useEffect(() => {
    if (!task) return;
    setUnsavedChanges(taskHasChanges());
  }, [title, description, dueDate, priority, tags, selectedOption]);

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
    try {
      if (task.dueDate !== new Date(dueDate).toISOString()) return true;
    } catch (error) {
      // If the dueDate is not a valid date, then the user must have changed it
      // since all tasks must have a valid date
      return true;
    }
    if (task.priority !== priority) return true;
    if (task.dueDate !== new Date(dueDate).toISOString()) return true;
    if (
      JSON.stringify(task.tags) !== JSON.stringify(tagArrayToStringArray(tags))
    )
      return true;

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

      if (!taskHasChanges()) {
        setError("No changes have been made.");
        setLoading(false);
        return;
      }

      const updates = {
        title: title,
        description: description,
        dueDate: date,
        priority: priority,
        tags: tagArrayToStringArray(tags),
        completed: updatedTaskIsCompleted(),
      };

      const response = await axios.patch(
        `/users/${user._id}/tasks/${taskId}`,
        updates
      );

      toast.success("Task updated successfully.");

      // Work out the new array of tags to be stored for the user using a Set
      // to avoid duplicates
      const tagsSet = new Set<string>();
      // First add all the current tags of this task
      tags.forEach((tag) => tagsSet.add(tag.label));
      // Now add the tags of all other user tasks - we cannot add the tags from
      // this task that is being edited from the user.tasks array since that may
      // not be the same as the currently selected tags.
      user.tasks.forEach((userTask) => {
        if (userTask._id !== task._id)
          userTask.tags.forEach((tag) => tagsSet.add(tag));
      });
      const newTags = Array.from(tagsSet);
      setSuggestions(stringArrayToTagArray(newTags));

      // Update the user's task array with the details of this edited task so
      // the changes are visible throughout the application without the user
      // having to refresh their browser
      const updatedTasks = user.tasks.slice();
      const updatedTask = response.data;
      updatedTasks[updatedTasks.indexOf(task)] = updatedTask;
      const updatedUser = {
        ...user,
        tasks: updatedTasks,
        tags: newTags,
      };
      setTask(updatedTask);
      setUser(updatedUser);
      setUnsavedChanges(false);

      // Update the user asynchronously so that their new tags will be saved
      // for when they next log in, but without creating longer wait times
      if (JSON.stringify(user.tags) !== JSON.stringify(newTags)) {
        axios.patch(`/users/${user._id}`, { tags: newTags });
      }
    } catch (error: any) {
      console.error(error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-page">
      <h1>Edit task</h1>
      <form>
        <FloatingLabel label="Title" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Title"
            className="max-width-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FloatingLabel>
        <FloatingLabel label="Description (optional)" className="mb-3">
          <Form.Control
            as="textarea"
            placeholder="Description (optional)"
            className="max-width-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FloatingLabel>
        <FloatingLabel label="Due date" className="mb-3">
          <Form.Control
            type="datetime-local"
            className="max-width-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </FloatingLabel>
        <FloatingLabel label="Task priority">
          <Form.Select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="max-width-input"
          >
            <option value={-1}>Unspecified</option>
            <option value={1}>1 (lowest)</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5 (highest)</option>
          </Form.Select>
        </FloatingLabel>
        <TagSelector
          user={user}
          tags={tags}
          setTags={setTags}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
        />
        <FloatingLabel label="Task status">
          <Form.Select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="max-width-input"
          >
            <option>{statusCompleted}</option>
            <option>{statusNotCompleted}</option>
          </Form.Select>
        </FloatingLabel>
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
