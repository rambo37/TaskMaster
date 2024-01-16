import { FloatingLabel, Form } from "react-bootstrap";
import { SortCriteria, SortOrder } from "../pages/TaskList";

type TaskListSortingControlsProps = {
  selectedSortCriterion: SortCriteria;
  handleSortCriteriaChange: (value: string) => void;
  selectedSortOrder: SortOrder;
  handleSortOrderChange: (value: string) => void;
};

const TaskListSortingControls = ({
  selectedSortCriterion,
  handleSortCriteriaChange,
  selectedSortOrder,
  handleSortOrderChange,
}: TaskListSortingControlsProps) => {
  return (
    <div className="task-list-sorting-controls">
      <p>Sort by:</p>
      <FloatingLabel label="Sorting criteria">
        <Form.Select
          value={selectedSortCriterion}
          onChange={(e) => handleSortCriteriaChange(e.target.value)}
        >
          <option>{SortCriteria.dateAdded}</option>
          <option>{SortCriteria.dueDate}</option>
          <option>{SortCriteria.priority}</option>
        </Form.Select>
      </FloatingLabel>
      <FloatingLabel label="Sorting order">
        <Form.Select
          value={selectedSortOrder}
          onChange={(e) => handleSortOrderChange(e.target.value)}
        >
          <option>{SortOrder.asc}</option>
          <option>{SortOrder.dsc}</option>
        </Form.Select>
      </FloatingLabel>
    </div>
  );
};

export default TaskListSortingControls;
