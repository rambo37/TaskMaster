import { useCallback, useEffect, useState } from "react";
import { useAccountContext } from "../components/Account";
import Legend from "../components/Legend";
import TaskCard from "../components/TaskCard";
import Form from "react-bootstrap/Form";
import { getTaskStatus, Task } from "../taskUtils";

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
  const [expandedTask, setExpandedTask] = useState<Task | null>(null);

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

  const updateExpandedTask = (task: Task) => {
    if (!expandedTask) setExpandedTask(task);
  };

  return (
    <div className="task-list-page">
      <h1>Tasks</h1>
      <div className={`task-list-options ${expandedTask ? "unfocussed" : ""}`}>
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
          onChange={() => setShowCompleted(!showCompleted)}
        />
        <Form.Check
          type="checkbox"
          label={`Show more than ${thresholdHours} hours left`}
          checked={showMoreThanThresholdHours}
          onChange={() =>
            setShowMoreThanThresholdHours(!showMoreThanThresholdHours)
          }
        />
        <Form.Check
          type="checkbox"
          label={`Show less than ${thresholdHours} hours left`}
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
              />
            );
          })
        )}
      </div>
      {expandedTask ? (
        <TaskCard
          user={user}
          setUser={setUser}
          task={expandedTask}
          thresholdHours={thresholdHours}
          expanded={true}
          handleClick={() => updateExpandedTask(expandedTask)}
          setExpandedTask={setExpandedTask}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default TaskList;
