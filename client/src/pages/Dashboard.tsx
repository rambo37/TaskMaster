import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import { useAccountContext } from "../components/Account";
import TaskCard from "../components/TaskCard";
import { getTaskStatus, Task } from "../taskUtils";

const Dashboard = () => {
  const { user, setUser, checkAndWarnForUnsavedChanges } = useAccountContext();
  const [expandedTask, setExpandedTask] = useState<Task | null>(null);
  const tasks = user.tasks;
  const upcomingTasks: Task[] = [];
  const urgentTasks: Task[] = [];
  const expiredTasks: Task[] = [];
  const [activeKeys, setActiveKeys] = useState(["0", "1", "2"]);

  // Populate and sort the task arrays by due date (ascending)
  tasks.forEach((task) => {
    const taskStatus = getTaskStatus(task, user.thresholdHours);
    if (taskStatus === "upcoming") upcomingTasks.push(task);
    if (taskStatus === "urgent") urgentTasks.push(task);
    if (taskStatus === "expired") expiredTasks.push(task);
  });

  upcomingTasks.sort((a: Task, b: Task) =>
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

  const handleExpand = () => {
    setActiveKeys(["0", "1", "2"]);
  };

  const handleCollapse = () => {
    setActiveKeys([]);
  };

  const handleToggle = (key: string) => {
    let newActiveKeys;
    if (activeKeys.includes(key)) {
      // Exclude the given key if it was already in the list of active keys
      newActiveKeys = activeKeys.filter((activeKey) => activeKey !== key);
    } else {
      // Else append the given key to the list of active keys
      newActiveKeys = activeKeys.slice();
      newActiveKeys.push(key);
    }
    setActiveKeys(newActiveKeys);
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name || user.email}!</h1>
      <div className="button-container">
        <button onClick={handleExpand} className="expand-all">
          Expand all
        </button>
        <button onClick={handleCollapse} className="collapse-all">
          Collapse all
        </button>
      </div>
      <Accordion
        defaultActiveKey={activeKeys}
        activeKey={activeKeys}
        alwaysOpen
        className={`${expandedTask ? "unfocussed" : ""}`}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header onClick={() => handleToggle("0")}>
            Expired tasks
          </Accordion.Header>
          <Accordion.Body>
            <p>
              These tasks passed their due date without being marked as
              completed.
            </p>
            {expiredTasks.length === 0 ? (
              <p className="no-tasks-message">
                {user.tasks.length === 0
                  ? "You do not have any tasks yet."
                  : "You do not have any expired tasks."}
              </p>
            ) : (
              <>
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
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header onClick={() => handleToggle("1")}>
            Urgent tasks
          </Accordion.Header>
          <Accordion.Body>
            <p>
              These tasks have fewer than {user.thresholdHours} hours remaining
              until they are due.
            </p>
            {urgentTasks.length === 0 ? (
              <p className="no-tasks-message">
                {user.tasks.length === 0
                  ? "You do not have any tasks yet."
                  : "You do not have any urgent tasks."}
              </p>
            ) : (
              <>
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
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header onClick={() => handleToggle("2")}>
            Upcoming tasks
          </Accordion.Header>
          <Accordion.Body>
            <p>
              These tasks have more than {user.thresholdHours} hours remaining
              until they are due.
            </p>
            {upcomingTasks.length === 0 ? (
              <p className="no-tasks-message">
                {user.tasks.length === 0
                  ? "You do not have any tasks yet."
                  : "You do not have any upcoming tasks."}
              </p>
            ) : (
              <>
                <div className="task-list">
                  {upcomingTasks.map((task) => {
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
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

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
