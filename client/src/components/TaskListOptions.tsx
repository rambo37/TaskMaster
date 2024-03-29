import React from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { Tag } from "react-tag-autocomplete";
import { Task } from "../taskUtils";
import { User } from "./Account";
import TagSelector from "./TagSelector";

type TaskListOptionsProps = {
  expandedTask: Task | null;
  showCompleted: boolean;
  setShowCompleted: React.Dispatch<boolean>;
  showUpcoming: boolean;
  setShowUpcoming: React.Dispatch<boolean>;
  showUrgent: boolean;
  setShowUrgent: React.Dispatch<boolean>;
  showExpired: boolean;
  setShowExpired: React.Dispatch<boolean>;
  showUnspecifiedPriority: boolean;
  setShowUnspecifiedPriority: React.Dispatch<boolean>;
  minimumPriority: number;
  setMinimumPriority: React.Dispatch<number>;
  maximumPriority: number;
  setMaximumPriority: React.Dispatch<number>;
  searchText: string;
  setSearchText: React.Dispatch<string>;
  user: User;
  tags: Tag[];
  setTags: React.Dispatch<Tag[]>;
  suggestions: Tag[];
  setSuggestions: React.Dispatch<Tag[]>;
};

const TaskListOptions = ({
  expandedTask,
  showCompleted,
  setShowCompleted,
  showUpcoming,
  setShowUpcoming,
  showUrgent,
  setShowUrgent,
  showExpired,
  setShowExpired,
  showUnspecifiedPriority,
  setShowUnspecifiedPriority,
  minimumPriority,
  setMinimumPriority,
  maximumPriority,
  setMaximumPriority,
  searchText,
  setSearchText,
  user,
  tags,
  setTags,
  suggestions,
  setSuggestions,
}: TaskListOptionsProps) => {
  const handleMinimumPriorityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = Number(event.target.value);
    if (newValue >= 1 && newValue <= maximumPriority)
      setMinimumPriority(newValue);
  };

  const handleMaximumPriorityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = Number(event.target.value);
    if (newValue <= 5 && newValue >= minimumPriority)
      setMaximumPriority(newValue);
  };

  const resetSearchOptions = () => {
    setShowCompleted(true);
    setShowUpcoming(true);
    setShowUrgent(true);
    setShowExpired(true);
    setShowUnspecifiedPriority(true);
    setMinimumPriority(1);
    setMaximumPriority(5);
    setSearchText("");
    setTags([]);
  };

  return (
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
          label="Show upcoming"
          checked={showUpcoming}
          onChange={() => setShowUpcoming(!showUpcoming)}
        />
        <Form.Check
          type="checkbox"
          label="Show urgent"
          checked={showUrgent}
          onChange={() => setShowUrgent(!showUrgent)}
        />
        <Form.Check
          type="checkbox"
          label="Show expired"
          checked={showExpired}
          onChange={() => setShowExpired(!showExpired)}
        />
        <Form.Check
          type="checkbox"
          label="Show unspecified priority"
          checked={showUnspecifiedPriority}
          onChange={() => setShowUnspecifiedPriority(!showUnspecifiedPriority)}
        />
        <FloatingLabel label="Minimum priority" className="mb-3">
          <Form.Control
            type="number"
            placeholder="Minimum priority"
            value={minimumPriority}
            onChange={handleMinimumPriorityChange}
          />
        </FloatingLabel>
        <FloatingLabel label="Maximum priority" className="mb-3">
          <Form.Control
            type="number"
            placeholder="Maximum priority"
            value={maximumPriority}
            onChange={handleMaximumPriorityChange}
          />
        </FloatingLabel>
        <FloatingLabel
          label="Search in title/description"
          className="mb-3 w-100"
        >
          <Form.Control
            type="search"
            placeholder="Search tasks"
            className="form-control search-bar"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </FloatingLabel>
        <TagSelector
          user={user}
          tags={tags}
          setTags={setTags}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          allowNew={false}
          placeholderText="Search by tags"
        />
        <button className="submit-button" onClick={resetSearchOptions}>
          Reset search options
        </button>
      </div>
    </div>
  );
};

export default TaskListOptions;
