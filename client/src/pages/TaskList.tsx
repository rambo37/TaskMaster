import { useCallback, useEffect, useState } from "react";
import { Task, useAccountContext } from "../components/Account";
import Legend from "../components/Legend";
import TaskCard from "../components/TaskCard";
import Form from "react-bootstrap/Form";

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
  const thresholdHours = 6;

  const filterTasks = useCallback(() => {
    const newTasks = user.tasks.filter((task) => {
      const taskStatus = getTaskStatus(task);
      const isCompleted = taskStatus === "completed";
      const isMoreThanThresholdHours = taskStatus === "neutral";
      const isLessThanThresholdHours = taskStatus === "urgent";
      const isExpired = taskStatus === "expired";

      return (
        (showCompleted || !isCompleted) &&
        (showMoreThanThresholdHours || !isMoreThanThresholdHours) &&
        (showLessThanThresholdHours || !isLessThanThresholdHours) &&
        (showExpired || !isExpired)
      );
    });

    setTasks(newTasks);
  }, [
    user.tasks,
    showCompleted,
    showMoreThanThresholdHours,
    showLessThanThresholdHours,
    showExpired,
  ]);

  useEffect(() => {
    filterTasks();
  }, [filterTasks]);

  const showOrHideCompletedTasks = (show: boolean) => {
    setShowCompleted(show);
  };

  const showOrHideMoreThanThresholdHoursTasks = (show: boolean) => {
    setShowMoreThanThresholdHours(show);
  };

  const showOrHideLessThanThresholdHoursTasks = (show: boolean) => {
    setShowLessThanThresholdHours(show);
  };

  const showOrHideExpiredTasks = (show: boolean) => {
    setShowExpired(show);
  };

  const getTaskStatus = (task: Task) => {
    let status = "neutral";
    if (task.completed) {
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

  return (
    <div className="task-list-page">
      <h1>Tasks</h1>
      <div className="task-list-options">
        <Form.Check
          type="checkbox"
          label="Show legend"
          checked={showLegend}
          onChange={() => setShowLegend(!showLegend)}
        />
        <Form.Check
          type="checkbox"
          label="Show completed"
          checked={showCompleted}
          onChange={() => showOrHideCompletedTasks(!showCompleted)}
        />
        <Form.Check
          type="checkbox"
          label={`Show more than ${thresholdHours} hours left`}
          checked={showMoreThanThresholdHours}
          onChange={() =>
            showOrHideMoreThanThresholdHoursTasks(!showMoreThanThresholdHours)
          }
        />
        <Form.Check
          type="checkbox"
          label={`Show less than ${thresholdHours} hours left`}
          checked={showLessThanThresholdHours}
          onChange={() =>
            showOrHideLessThanThresholdHoursTasks(!showLessThanThresholdHours)
          }
        />
        <Form.Check
          type="checkbox"
          label="Show expired"
          checked={showExpired}
          onChange={() => showOrHideExpiredTasks(!showExpired)}
        />
      </div>
      {showLegend && <Legend thresholdHours={thresholdHours} />}
      <div className="task-list">
        {tasks.map((task) => {
          return (
            <TaskCard
              user={user}
              setUser={setUser}
              task={task}
              key={task._id}
              thresholdHours={thresholdHours}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
