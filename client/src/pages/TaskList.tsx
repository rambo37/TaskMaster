import { useCallback, useEffect, useState } from "react";
import { useAccountContext } from "../components/Account";
import Legend from "../components/Legend";
import TaskCard from "../components/TaskCard";
import { getTaskStatus, Task } from "../taskUtils";
import TaskListSettings from "../components/TaskListSettings";
import TaskListOptions from "../components/TaskListOptions";

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

  return (
    <div className="task-list-page">
      <div className={`heading-div ${expandedTask ? "unfocussed" : ""}`}>
        <h1>Tasks</h1>
        <button onClick={() => setShowSettings(!showSettings)}>Settings</button>
      </div>
      {showSettings && (
        <TaskListSettings
          user={user}
          setUser={setUser}
          expandedTask={expandedTask}
          showLegend={showLegend}
          setShowLegend={setShowLegend}
          thresholdHours={thresholdHours}
          setThresholdHours={setThresholdHours}
          selectedDateFormat={selectedDateFormat}
          setSelectedDateFormat={setSelectedDateFormat}
          selectedTimeFormat={selectedTimeFormat}
          setSelectedTimeFormat={setSelectedTimeFormat}
        />
      )}
      <TaskListOptions
        expandedTask={expandedTask}
        thresholdHours={thresholdHours}
        showCompleted={showCompleted}
        setShowCompleted={setShowCompleted}
        showMoreThanThresholdHours={showMoreThanThresholdHours}
        setShowMoreThanThresholdHours={setShowMoreThanThresholdHours}
        showLessThanThresholdHours={showLessThanThresholdHours}
        setShowLessThanThresholdHours={setShowLessThanThresholdHours}
        showExpired={showExpired}
        setShowExpired={setShowExpired}
        searchText={searchText}
        setSearchText={setSearchText}
      />
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
