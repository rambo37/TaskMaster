import { useState } from "react";
import { Accordion, Carousel } from "react-bootstrap";
import { useAccountContext } from "../components/Account";
import TaskCard from "../components/TaskCard";
import { getTaskStatus, Task } from "../taskUtils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

const Dashboard = () => {
  const { user, setUser, checkAndWarnForUnsavedChanges } = useAccountContext();
  const [expandedTask, setExpandedTask] = useState<Task | null>(null);
  const tasks = user.tasks;
  const upcomingTasks: Task[] = [];
  const urgentTasks: Task[] = [];
  const expiredTasks: Task[] = [];
  const [activeKeys, setActiveKeys] = useState(["0", "1", "2"]);

  const taskSections = [
    {
      type: "Expired",
      description:
        "These tasks passed their due date without being marked as completed.",
      collection: expiredTasks,
    },
    {
      type: "Urgent",
      description: `These tasks have fewer than ${user.thresholdHours} hours remaining until they are due.`,
      collection: urgentTasks,
    },
    {
      type: "Upcoming",
      description: `These tasks have more than ${user.thresholdHours} hours remaining until they are due.`,
      collection: upcomingTasks,
    },
  ];

  // Counts of the different types of tasks
  let completedTasks = 0;
  let unspecifiedPriorityTasks = 0;
  let priority1Tasks = 0;
  let priority2Tasks = 0;
  let priority3Tasks = 0;
  let priority4Tasks = 0;
  let priority5Tasks = 0;
  let inProgressTasks = 0;
  let notStartedTasks = 0;

  // Populate and sort the task arrays by due date (ascending)
  tasks.forEach((task) => {
    const taskStatus = getTaskStatus(task, user.thresholdHours);
    if (taskStatus === "upcoming") upcomingTasks.push(task);
    else if (taskStatus === "urgent") urgentTasks.push(task);
    else if (taskStatus === "expired") expiredTasks.push(task);
    else if (taskStatus === "completed") completedTasks++;

    if (task.priority === -1) unspecifiedPriorityTasks++;
    else if (task.priority === 1) priority1Tasks++;
    else if (task.priority === 2) priority2Tasks++;
    else if (task.priority === 3) priority3Tasks++;
    else if (task.priority === 4) priority4Tasks++;
    else if (task.priority === 5) priority5Tasks++;

    if (task.status === "In progress") inProgressTasks++;
    else if (task.status === "Not started") notStartedTasks++;
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

  ChartJS.register(ArcElement, Tooltip, Legend);

  const taskStatusData = {
    labels: ["Completed", "Upcoming", "Urgent", "Expired"],
    datasets: [
      {
        label: "  Number of tasks",
        data: [
          completedTasks,
          upcomingTasks.length,
          urgentTasks.length,
          expiredTasks.length,
        ],
        backgroundColor: [
          "rgba(118, 235, 155, 0.4)",
          "rgba(248, 248, 112, 0.4)",
          "rgba(255, 102, 102, 0.4)",
          "rgba(204, 204, 204, 0.4)",
        ],
        borderColor: [
          "rgba(118, 235, 155, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 102, 102, 1)",
          "rgba(204, 204, 204, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const taskPriorityData = {
    labels: ["Unspecified", "1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "  Number of tasks",
        data: [
          unspecifiedPriorityTasks,
          priority1Tasks,
          priority2Tasks,
          priority3Tasks,
          priority4Tasks,
          priority5Tasks,
        ],
        backgroundColor: [
          "rgba(204, 204, 204, 0.4)",
          "rgba(255, 99, 132, 0.4)",
          "rgba(54, 162, 235, 0.4)",
          "rgba(75, 192, 192, 0.4)",
          "rgba(153, 102, 255, 0.4)",
          "rgba(255, 159, 64, 0.4)",
        ],
        borderColor: [
          "rgba(204, 204, 204, 1",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const taskProgressData = {
    labels: ["Completed", "In progress", "Not started"],
    datasets: [
      {
        label: "  Number of tasks",
        data: [completedTasks, inProgressTasks, notStartedTasks],
        backgroundColor: [
          "rgba(118, 235, 155, 0.4)",
          "rgba(54, 162, 235, 0.4)",
          "rgba(255, 99, 132, 0.4)",
        ],
        borderColor: [
          "rgba(118, 235, 155, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

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
      {user.tasks.length > 0 && (
        <Carousel className="carousel-root" data-bs-theme="dark">
          <Carousel.Item>
            <div className="chart-container">
              <Doughnut data={taskStatusData} />
            </div>
            <Carousel.Caption>
              <h3>Tasks by status</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <div className="chart-container">
              <Doughnut data={taskPriorityData} />
            </div>
            <Carousel.Caption>
              <h3>Tasks by priority</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <div className="chart-container">
              <Doughnut data={taskProgressData} />
            </div>
            <Carousel.Caption>
              <h3>Tasks by progress</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      )}
      <div className="accordion-wrapper">
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
          {taskSections.map((taskSection, index) => {
            return (
              <Accordion.Item eventKey={String(index)} key={taskSection.type}>
                <Accordion.Header onClick={() => handleToggle(String(index))}>
                  {`${taskSection.type} tasks`}
                </Accordion.Header>
                <Accordion.Body>
                  <p>{taskSection.description}</p>
                  {taskSection.collection.length === 0 ? (
                    <p className="no-tasks-message">
                      {user.tasks.length === 0
                        ? "You do not have any tasks yet."
                        : `You do not have any ${taskSection.type.toLowerCase()} tasks.`}
                    </p>
                  ) : (
                    <>
                      <div className="task-list">
                        {taskSection.collection.map((task) => {
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
            );
          })}
        </Accordion>
      </div>
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
