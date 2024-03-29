import { useCallback, useEffect, useState } from "react";
import { useAccountContext } from "../components/Account";
import Legend from "../components/Legend";
import TaskCard from "../components/TaskCard";
import { getTaskStatus, Task } from "../taskUtils";
import TaskListOptions from "../components/TaskListOptions";
import TaskListSortingControls from "../components/TaskListSortingControls";
import { Tag } from "react-tag-autocomplete";
import { stringArrayToTagArray, tagArrayToStringArray } from "../utils";
import useBodyScrollLock from "../hooks/useBodyScrollLock";

// Records the sorting criterion.
export enum SortCriteria {
  dateAdded = "Date added",
  dueDate = "Due date",
  priority = "Priority",
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
  const { user, setUser, checkAndWarnForUnsavedChanges } = useAccountContext();
  const [tasks, setTasks] = useState(user.tasks);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showUrgent, setShowUrgent] = useState(true);
  const [showExpired, setShowExpired] = useState(true);
  const [showUnspecifiedPriority, setShowUnspecifiedPriority] = useState(true);
  const [minimumPriority, setMinimumPriority] = useState(1);
  const [maximumPriority, setMaximumPriority] = useState(5);
  const [expandedTask, setExpandedTask] = useState<Task | null>(null);
  const [searchText, setSearchText] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [suggestions, setSuggestions] = useState<Tag[]>(
    stringArrayToTagArray(user.tags)
  );
  const [selectedSortCriterion, setSelectedSortCriterion] = useState(
    SortCriteria.dateAdded
  );
  const [selectedSortOrder, setSelectedSortOrder] = useState(SortOrder.asc);

  useBodyScrollLock(expandedTask);

  const filterAndSortTasks = useCallback(() => {
    const newTasks = user.tasks.filter((task) => {
      const taskStatus = getTaskStatus(task, user.thresholdHours);
      const isCompleted = taskStatus === "completed";
      const isUpcoming = taskStatus === "upcoming";
      const isUrgent = taskStatus === "urgent";
      const isExpired = taskStatus === "expired";
      const isUnspecifiedPriority = task.priority === -1;

      return (
        (showCompleted || !isCompleted) &&
        (showUpcoming || !isUpcoming) &&
        (showUrgent || !isUrgent) &&
        (showExpired || !isExpired) &&
        (showUnspecifiedPriority || !isUnspecifiedPriority) &&
        // If isUnspecifiedPriority is true for the next 2 lines, then skip the
        // priority check as it would return false and thus the task would not
        // be shown even though it should (as showUnspecifiedPriority is true).
        (isUnspecifiedPriority || task.priority >= minimumPriority) &&
        (isUnspecifiedPriority || task.priority <= maximumPriority) &&
        taskContainsSearchText(task) &&
        taskContainsAllSelectedTags(task)
      );
    });

    // After filtering the tasks, sort them. Since by default the tasks
    // are obtained from filtering the user.tasks array (which stores the
    // tasks in the order they were created), they are sorted initially
    // according to the date added criterion. This means nothing needs to
    // be done if the selectedSortCriterion is dateAdded.

    // Sorts the tasks in ascending order according to dueDate/priority, if
    // required
    if (selectedSortCriterion === SortCriteria.dueDate) {
      newTasks.sort((a: Task, b: Task) =>
        new Date(a.dueDate) < new Date(b.dueDate) ? -1 : 1
      );
    } else if (selectedSortCriterion === SortCriteria.priority) {
      newTasks.sort((a: Task, b: Task) => (a.priority < b.priority ? -1 : 1));
    }

    // Now the tasks are sorted according to the correct criterion in
    // ascending order. Reverse the tasks array if the selected sort order
    // requries the tasks to be sorted in descending order.
    if (selectedSortOrder === SortOrder.dsc) newTasks.reverse();

    setTasks(newTasks);
  }, [
    user.tasks,
    user.thresholdHours,
    showCompleted,
    showUpcoming,
    showUrgent,
    showExpired,
    showUnspecifiedPriority,
    minimumPriority,
    maximumPriority,
    searchText,
    tags,
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

  const taskContainsAllSelectedTags = (task: Task) => {
    if (!tags.length) return true;
    return tagArrayToStringArray(tags).every((tag) => task.tags.includes(tag));
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
      </div>
      <TaskListOptions
        expandedTask={expandedTask}
        showCompleted={showCompleted}
        setShowCompleted={setShowCompleted}
        showUpcoming={showUpcoming}
        setShowUpcoming={setShowUpcoming}
        showUrgent={showUrgent}
        setShowUrgent={setShowUrgent}
        showExpired={showExpired}
        setShowExpired={setShowExpired}
        showUnspecifiedPriority={showUnspecifiedPriority}
        setShowUnspecifiedPriority={setShowUnspecifiedPriority}
        minimumPriority={minimumPriority}
        setMinimumPriority={setMinimumPriority}
        maximumPriority={maximumPriority}
        setMaximumPriority={setMaximumPriority}
        searchText={searchText}
        setSearchText={setSearchText}
        user={user}
        tags={tags}
        setTags={setTags}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
      />
      {user.showLegend && <Legend />}
      <div className={`task-list-wrapper ${expandedTask ? "unfocussed" : ""}`}>
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
                  thresholdHours={user.thresholdHours}
                  expanded={false}
                  handleClick={() => updateExpandedTask(task)}
                  setExpandedTask={setExpandedTask}
                  selectedDateFormat={user.dateFormat}
                  selectedTimeFormat={user.timeFormat}
                  checkAndWarnForUnsavedChanges={checkAndWarnForUnsavedChanges}
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

export default TaskList;
