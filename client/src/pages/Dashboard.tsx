import { useState } from "react";
import { useAccountContext } from "../components/Account";
import TaskCard from "../components/TaskCard";
import { getTaskStatus, Task } from "../taskUtils";

const Dashboard = () => {
  const { user, setUser, checkAndWarnForUnsavedChanges } = useAccountContext();
  const [expandedTask, setExpandedTask] = useState<Task | null>(null);
  const tasks = user.tasks;
  const neutralTasks: Task[] = [];
  const urgentTasks: Task[] = [];
  const expiredTasks: Task[] = [];

  // Populate and sort the task arrays by due date (ascending)
  tasks.forEach((task) => {
    const taskStatus = getTaskStatus(task, user.thresholdHours);
    if (taskStatus === "neutral") neutralTasks.push(task);
    if (taskStatus === "urgent") urgentTasks.push(task);
    if (taskStatus === "expired") expiredTasks.push(task);
  });

  neutralTasks.sort((a: Task, b: Task) =>
    new Date(a.dueDate) < new Date(b.dueDate) ? -1 : 1
  );

  urgentTasks.sort((a: Task, b: Task) =>
    new Date(a.dueDate) < new Date(b.dueDate) ? -1 : 1
  );

  expiredTasks.sort((a: Task, b: Task) =>
    new Date(a.dueDate) < new Date(b.dueDate) ? -1 : 1
  );

  const updateExpandedTask = (task: Task) => {
    if (!expandedTask) setExpandedTask(task);
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name || user.email}!</h1>

      <section className={`${expandedTask ? "unfocussed" : ""}`}>
        <h3>Expired tasks</h3>
        {expiredTasks.length === 0 ? (
          <p className="no-tasks-message">
            {user.tasks.length === 0
              ? "You do not have any tasks yet."
              : "You do not have any expired tasks."}
          </p>
        ) : (
          <>
            <p>
              These tasks passed their due date without being marked as
              completed.
            </p>
            <div className="task-list">
              {expiredTasks.map((task) => {
                return (
                  <TaskCard
                    user={user}
                    setUser={setUser}
                    task={task}
                    key={task._id}
                    thresholdHours={user.thresholdHours}
                    expanded={false}
                    handleClick={() => updateExpandedTask(task)}
                    setExpandedTask={setExpandedTask}
                    selectedDateFormat={user.dateFormat}
                    selectedTimeFormat={user.timeFormat}
                    checkAndWarnForUnsavedChanges={
                      checkAndWarnForUnsavedChanges
                    }
                  />
                );
              })}
            </div>
          </>
        )}
      </section>

      <section className={`${expandedTask ? "unfocussed" : ""}`}>
        <h3>Urgent tasks</h3>
        {urgentTasks.length === 0 ? (
          <p className="no-tasks-message">
            {user.tasks.length === 0
              ? "You do not have any tasks yet."
              : "You do not have any urgent tasks."}
          </p>
        ) : (
          <>
            <p>
              These tasks have fewer than {user.thresholdHours} hours remaining
              until they are due.
            </p>
            <div className="task-list">
              {urgentTasks.map((task) => {
                return (
                  <TaskCard
                    user={user}
                    setUser={setUser}
                    task={task}
                    key={task._id}
                    thresholdHours={user.thresholdHours}
                    expanded={false}
                    handleClick={() => updateExpandedTask(task)}
                    setExpandedTask={setExpandedTask}
                    selectedDateFormat={user.dateFormat}
                    selectedTimeFormat={user.timeFormat}
                    checkAndWarnForUnsavedChanges={
                      checkAndWarnForUnsavedChanges
                    }
                  />
                );
              })}
            </div>
          </>
        )}
      </section>

      <section className={`${expandedTask ? "unfocussed" : ""}`}>
        <h3>Upcoming tasks</h3>
        {neutralTasks.length === 0 ? (
          <p className="no-tasks-message">
            {user.tasks.length === 0
              ? "You do not have any tasks yet."
              : "You do not have any upcoming tasks."}
          </p>
        ) : (
          <>
            <p>
              These tasks have more than {user.thresholdHours} hours remaining
              until they are due.
            </p>
            <div className="task-list">
              {neutralTasks.map((task) => {
                return (
                  <TaskCard
                    user={user}
                    setUser={setUser}
                    task={task}
                    key={task._id}
                    thresholdHours={user.thresholdHours}
                    expanded={false}
                    handleClick={() => updateExpandedTask(task)}
                    setExpandedTask={setExpandedTask}
                    selectedDateFormat={user.dateFormat}
                    selectedTimeFormat={user.timeFormat}
                    checkAndWarnForUnsavedChanges={
                      checkAndWarnForUnsavedChanges
                    }
                  />
                );
              })}
            </div>
          </>
        )}
      </section>

      {expandedTask && (
        <TaskCard
          user={user}
          setUser={setUser}
          task={expandedTask}
          thresholdHours={user.thresholdHours}
          expanded={true}
          handleClick={() => updateExpandedTask(expandedTask)}
          setExpandedTask={setExpandedTask}
          selectedDateFormat={user.dateFormat}
          selectedTimeFormat={user.timeFormat}
          checkAndWarnForUnsavedChanges={checkAndWarnForUnsavedChanges}
        />
      )}
    </div>
  );
};

export default Dashboard;
