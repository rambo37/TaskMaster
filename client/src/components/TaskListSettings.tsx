import axios from "axios";
import { useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Task } from "../taskUtils";
import { User } from "./Account";

type TaskListSettingsProps = {
  user: User;
  setUser: React.Dispatch<User>;
  expandedTask: Task | null;
  showLegend: boolean;
  setShowLegend: React.Dispatch<boolean>;
  thresholdHours: number;
  setThresholdHours: React.Dispatch<number>;
  selectedDateFormat: string;
  setSelectedDateFormat: React.Dispatch<string>;
  selectedTimeFormat: string;
  setSelectedTimeFormat: React.Dispatch<string>;
};

const TaskListSettings = ({
  user,
  setUser,
  expandedTask,
  showLegend,
  setShowLegend,
  thresholdHours,
  setThresholdHours,
  selectedDateFormat,
  setSelectedDateFormat,
  selectedTimeFormat,
  setSelectedTimeFormat,
}: TaskListSettingsProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSettingsSaveSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updates = {
        thresholdHours: thresholdHours,
        dateFormat: selectedDateFormat,
        timeFormat: selectedTimeFormat,
      };

      await axios.patch(`/users/${user._id}`, updates);
      toast.success("Settings updated successfully.");

      const updatedUser = {
        ...user,
        thresholdHours: thresholdHours,
        dateFormat: selectedDateFormat,
        timeFormat: selectedTimeFormat,
      };
      setUser(updatedUser);
    } catch (error: any) {
      console.error(error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`task-list-page-settings ${expandedTask ? "unfocussed" : ""}`}
    >
      <h4>Settings</h4>
      <Form.Check
        type="checkbox"
        label="Show legend"
        checked={showLegend}
        onChange={() => setShowLegend(!showLegend)}
      />
      <FloatingLabel label="Threshold hours">
        <Form.Control
          type="number"
          placeholder="Threshold hours"
          min={0}
          value={thresholdHours}
          onChange={(e) => setThresholdHours(Number(e.target.value))}
        />
      </FloatingLabel>
      <FloatingLabel label="Date format">
        <Form.Select
          value={selectedDateFormat}
          onChange={(e) => setSelectedDateFormat(e.target.value)}
        >
          <option>{"Numeric"}</option>
          <option>{"Written"}</option>
        </Form.Select>
      </FloatingLabel>
      <FloatingLabel label="Time format">
        <Form.Select
          value={selectedTimeFormat}
          onChange={(e) => setSelectedTimeFormat(e.target.value)}
        >
          <option>{"12 hours"}</option>
          <option>{"24 hours"}</option>
        </Form.Select>
      </FloatingLabel>
      <button
        className="submit-button"
        onClick={(e) => handleSettingsSaveSubmit(e)}
      >
        Save settings
      </button>
      {loading && (
        <div style={{ textAlign: "center" }}>
          <ClipLoader />
        </div>
      )}
      {error && <div className="status error">{error}</div>}
    </div>
  );
};

export default TaskListSettings;
