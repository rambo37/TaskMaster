import { useCallback, useEffect, useState } from "react";
import { useAccountContext } from "../components/Account";
import Legend from "../components/Legend";
import TaskCard from "../components/TaskCard";
import Form from "react-bootstrap/Form";
import { getTaskStatus, Task } from "../taskUtils";
import { FloatingLabel } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const TaskList = () => {
  const [user, setUser] = useAccountContext();
  const [tasks, setTasks] = useState(user.tasks);
  const [showLegend, setShowLegend] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showMoreThanThresholdHours, setShowMoreThanThresholdHours] =
    useState(true);
  const [showLessThanThresholdHours, setShowLessThanThresholdHours] =
    useState(true);
  const [showExpired, setShowExpired] = useState(true);
  const [expandedTask, setExpandedTask] = useState<Task | null>(null);
  const [searchText, setSearchText] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [thresholdHours, setThresholdHours] = useState(user.thresholdHours);
  const [selectedDateFormat, setSelectedDateFormat] = useState(user.dateFormat);
  const [selectedTimeFormat, setSelectedTimeFormat] = useState(user.timeFormat);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filterTasks = useCallback(() => {
    const newTasks = user.tasks.filter((task) => {
      const taskStatus = getTaskStatus(task, thresholdHours);
      const isCompleted = taskStatus === "completed";
      const isMoreThanThresholdHours = taskStatus === "neutral";
      const isLessThanThresholdHours = taskStatus === "urgent";
      const isExpired = taskStatus === "expired";

      return (
        (showCompleted || !isCompleted) &&
        (showMoreThanThresholdHours || !isMoreThanThresholdHours) &&
        (showLessThanThresholdHours || !isLessThanThresholdHours) &&
        (showExpired || !isExpired) &&
        taskContainsSearchText(task)
      );
    });

    setTasks(newTasks);
  }, [
    user.tasks,
    showCompleted,
    showMoreThanThresholdHours,
    showLessThanThresholdHours,
    showExpired,
    searchText,
  ]);

  useEffect(() => {
    filterTasks();
  }, [filterTasks]);

  const updateExpandedTask = (task: Task) => {
    if (!expandedTask) setExpandedTask(task);
  };

  const taskContainsSearchText = (task: Task) => {
    if (!searchText.trim()) return true;
    return (
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const handleSettingsSaveSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updates = {
        thresholdHours: thresholdHours,
        dateFormat: selectedDateFormat,
        timeFormat: selectedTimeFormat,
      };

      await axios.patch(`/users/${user._id}`, updates);
      toast.success("Settings updated successfully.");

      const updatedUser = {
        ...user,
        thresholdHours: thresholdHours,
        dateFormat: selectedDateFormat,
        timeFormat: selectedTimeFormat,
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
    <div className="task-list-page">
      <div className={`heading-div ${expandedTask ? "unfocussed" : ""}`}>
        <h1>Tasks</h1>
        <button onClick={() => setShowSettings(!showSettings)}>Settings</button>
      </div>
      {showSettings && (
        <div
          className={`task-list-page-settings ${
            expandedTask ? "unfocussed" : ""
          }`}
        >
          <h4>Settings</h4>
          <Form.Check
            type="checkbox"
            label="Show legend"
            checked={showLegend}
            onChange={() => setShowLegend(!showLegend)}
          />
          <FloatingLabel label="Threshold hours">
            <Form.Control
              type="number"
              placeholder="Threshold hours"
              min={0}
              value={thresholdHours}
              onChange={(e) => setThresholdHours(Number(e.target.value))}
            />
          </FloatingLabel>
          <FloatingLabel label="Date format">
            <Form.Select
              value={selectedDateFormat}
              onChange={(e) => setSelectedDateFormat(e.target.value)}
            >
              <option>{"Numeric"}</option>
              <option>{"Written"}</option>
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel label="Time format">
            <Form.Select
              value={selectedTimeFormat}
              onChange={(e) => setSelectedTimeFormat(e.target.value)}
            >
              <option>{"12 hours"}</option>
              <option>{"24 hours"}</option>
            </Form.Select>
          </FloatingLabel>
          <button
            className="submit-button"
            onClick={(e) => handleSettingsSaveSubmit(e)}
          >
            Save settings
          </button>
          {loading && (
            <div style={{ textAlign: "center" }}>
              <ClipLoader />
            </div>
          )}
          {error && <div className="status error">{error}</div>}
        </div>
      )}
      <div className={`task-list-options ${expandedTask ? "unfocussed" : ""}`}>
        <h4>Search options</h4>
        <div>
          <Form.Check
            type="checkbox"
            label="Show completed"
            checked={showCompleted}
            onChange={() => setShowCompleted(!showCompleted)}
          />
          <Form.Check
            type="checkbox"
            label={`Show more than ${thresholdHours} hour${
              thresholdHours !== 1 ? "s" : ""
            } left`}
            checked={showMoreThanThresholdHours}
            onChange={() =>
              setShowMoreThanThresholdHours(!showMoreThanThresholdHours)
            }
          />
          <Form.Check
            type="checkbox"
            label={`Show less than ${thresholdHours} hour${
              thresholdHours !== 1 ? "s" : ""
            } left`}
            checked={showLessThanThresholdHours}
            onChange={() =>
              setShowLessThanThresholdHours(!showLessThanThresholdHours)
            }
          />
          <Form.Check
            type="checkbox"
            label="Show expired"
            checked={showExpired}
            onChange={() => setShowExpired(!showExpired)}
          />
        </div>
        <input
          className="form-control search-bar"
          type="search"
          placeholder="Search tasks"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        ></input>
      </div>
      {showLegend && <Legend thresholdHours={thresholdHours} />}
      <div className={`task-list ${expandedTask ? "unfocussed" : ""}`}>
        {tasks.length === 0 ? (
          <p style={{ marginTop: "50px" }}>
            {user.tasks.length === 0
              ? "You do not have any tasks yet."
              : "You do not have any tasks that meet the search criteria."}
          </p>
        ) : (
          tasks.map((task) => {
            return (
              <TaskCard
                user={user}
                setUser={setUser}
                task={task}
                key={task._id}
                thresholdHours={thresholdHours}
                expanded={false}
                handleClick={() => updateExpandedTask(task)}
                setExpandedTask={setExpandedTask}
                selectedDateFormat={selectedDateFormat}
                selectedTimeFormat={selectedTimeFormat}
              />
            );
          })
        )}
      </div>
      {expandedTask && (
        <TaskCard
          user={user}
          setUser={setUser}
          task={expandedTask}
          thresholdHours={thresholdHours}
          expanded={true}
          handleClick={() => updateExpandedTask(expandedTask)}
          setExpandedTask={setExpandedTask}
          selectedDateFormat={selectedDateFormat}
          selectedTimeFormat={selectedTimeFormat}
        />
      )}
    </div>
  );
};

export default TaskList;
