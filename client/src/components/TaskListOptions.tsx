import { Form } from "react-bootstrap";
import { Task } from "../taskUtils";

type TaskListOptionsProps = {
  expandedTask: Task | null;
  thresholdHours: number;
  showCompleted: boolean;
  setShowCompleted: React.Dispatch<boolean>;
  showUpcoming: boolean;
  setShowUpcoming: React.Dispatch<boolean>;
  showUrgent: boolean;
  setShowUrgent: React.Dispatch<boolean>;
  showExpired: boolean;
  setShowExpired: React.Dispatch<boolean>;
  searchText: string;
  setSearchText: React.Dispatch<string>;
};

const TaskListOptions = ({
  expandedTask,
  thresholdHours,
  showCompleted,
  setShowCompleted,
  showUpcoming,
  setShowUpcoming,
  showUrgent,
  setShowUrgent,
  showExpired,
  setShowExpired,
  searchText,
  setSearchText,
}: TaskListOptionsProps) => {
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
          label="Upcoming"
          checked={showUpcoming}
          onChange={() => setShowUpcoming(!showUpcoming)}
        />
        <Form.Check
          type="checkbox"
          label="Urgent"
          checked={showUrgent}
          onChange={() => setShowUrgent(!showUrgent)}
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
  );
};

export default TaskListOptions;
