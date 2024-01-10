import { useCallback, useEffect, useState } from "react";
import { useAccountContext } from "../components/Account";
import Legend from "../components/Legend";
import TaskCard from "../components/TaskCard";
import { getTaskStatus, Task } from "../taskUtils";
import TaskListSettings from "../components/TaskListSettings";
import TaskListOptions from "../components/TaskListOptions";
import TaskListSortingControls from "../components/TaskListSortingControls";

// Records the sorting criterion.
export enum SortCriteria {
  dateAdded = "Date added",
  dueDate = "Due date",
}

// Records the order of the sorting.
export enum SortOrder {
  asc = "Ascending",
  dsc = "Descending",
}

const getSortCriteriaEnumValue = (sortCriterion: string) => {
  const enumValues = Object.values(SortCriteria);
  const enumValue = enumValues.find((value) => value === sortCriterion);
  return enumValue as SortCriteria | undefined;
};

const getSortOrderEnumValue = (sortOrder: string) => {
  const enumValues = Object.values(SortOrder);
  const enumValue = enumValues.find((value) => value === sortOrder);
  return enumValue as SortOrder | undefined;
};

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
  const [selectedSortCriterion, setSelectedSortCriterion] = useState(
    SortCriteria.dateAdded
  );
  const [selectedSortOrder, setSelectedSortOrder] = useState(SortOrder.asc);

  const filterAndSortTasks = useCallback(() => {
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

    // After filtering the tasks, sort them. Since by default the tasks
    // are obtained from filtering the user.tasks array (which stores the
    // tasks in the order they were created), they are sorted initially
    // according to the date added criterion. This means nothing needs to
    // be done if the selectedSortCriterion is dateAdded.

    // Sorts the tasks in ascending order according to dueDate, if required
    if (selectedSortCriterion === SortCriteria.dueDate) {
      newTasks.sort((a: Task, b: Task) =>
        new Date(a.dueDate) < new Date(b.dueDate) ? -1 : 1
      );
    }

    // Now the tasks are sorted according to the correct criterion in
    // ascending order. Reverse the tasks array if the selected sort order
    // requries the tasks to be sorted in descending order.
    if (selectedSortOrder === SortOrder.dsc) newTasks.reverse();

    setTasks(newTasks);
  }, [
    user.tasks,
    thresholdHours,
    showCompleted,
    showMoreThanThresholdHours,
    showLessThanThresholdHours,
    showExpired,
    searchText,
    selectedSortCriterion,
    selectedSortOrder,
  ]);

  useEffect(() => {
    filterAndSortTasks();
  }, [filterAndSortTasks]);

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

  const handleSortCriteriaChange = (sortCriterion: string) => {
    const newSortCriterion = getSortCriteriaEnumValue(sortCriterion);
    if (newSortCriterion) setSelectedSortCriterion(newSortCriterion);
  };

  const handleSortOrderChange = (sortOrder: string) => {
    const newSortOrder = getSortOrderEnumValue(sortOrder);
    if (newSortOrder) setSelectedSortOrder(newSortOrder);
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
      <div className={`${expandedTask ? "unfocussed" : ""}`}>
        <TaskListSortingControls
          selectedSortCriterion={selectedSortCriterion}
          handleSortCriteriaChange={handleSortCriteriaChange}
          selectedSortOrder={selectedSortOrder}
          handleSortOrderChange={handleSortOrderChange}
        />
        {tasks.length === 0 ? (
          <p className="no-tasks-message">
            {user.tasks.length === 0
              ? "You do not have any tasks yet."
              : "You do not have any tasks that meet the search criteria."}
          </p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => {
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
            })}
          </div>
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
