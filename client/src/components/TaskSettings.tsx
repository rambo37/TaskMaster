import axios from "axios";
import { useEffect, useState } from "react";
import { FloatingLabel, Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { getDateTimeString } from "../taskUtils";
import { ContentProps } from "./SettingsPageSection";

const TaskSettings = ({
  setLoading,
  setError,
  user,
  setUser,
  setUnsavedChanges,
}: ContentProps) => {
  const [showHelp, setShowHelp] = useState(false);
  const [thresholdHours, setThresholdHours] = useState(user.thresholdHours);
  const [selectedDateFormat, setSelectedDateFormat] = useState(user.dateFormat);
  const [selectedTimeFormat, setSelectedTimeFormat] = useState(user.timeFormat);
  const [showLegend, setShowLegend] = useState(user.showLegend);

  // Update the unsavedChanges state variable in the Layout component
  // whenever the settings are changed so that the user will be warned
  // of losing unsaved changes if they attempt to leave the site.
  useEffect(() => {
    setUnsavedChanges(taskSettingsHaveChanges());
  }, [thresholdHours, selectedDateFormat, selectedTimeFormat, showLegend]);

  const taskSettingsHaveChanges = () => {
    return (
      user.thresholdHours !== thresholdHours ||
      user.dateFormat !== selectedDateFormat ||
      user.timeFormat !== selectedTimeFormat ||
      user.showLegend !== showLegend
    );
  };

  const handleSettingsSaveSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!taskSettingsHaveChanges()) {
        setError("No changes have been made.");
        setLoading(false);
        return;
      }

      const updates = {
        thresholdHours: thresholdHours,
        dateFormat: selectedDateFormat,
        timeFormat: selectedTimeFormat,
        showLegend: showLegend,
      };

      await axios.patch(`/api/users/${user._id}`, updates);
      toast.success("Settings updated successfully.");

      const updatedUser = {
        ...user,
        thresholdHours: thresholdHours,
        dateFormat: selectedDateFormat,
        timeFormat: selectedTimeFormat,
        showLegend: showLegend,
      };
      setUser(updatedUser);
      setUnsavedChanges(false);
    } catch (error: any) {
      console.error(error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-settings">
      <h3>Task settings</h3>
      <InputGroup className={`${showHelp ? "help-visible" : ""}`}>
        <FloatingLabel label="Urgency threshold (hours)">
          <Form.Control
            type="number"
            placeholder="Urgency threshold (hours)"
            min={0}
            value={thresholdHours}
            onChange={(e) => setThresholdHours(Number(e.target.value))}
          />
        </FloatingLabel>
        <InputGroup.Text>
          <i
            className="bi bi-question-circle-fill"
            onClick={() => {
              setShowHelp(!showHelp);
            }}
          ></i>
        </InputGroup.Text>
      </InputGroup>
      {showHelp && (
        <div className="help-div">
          Determines the point at which a task changes from being labeled as
          'Upcoming' to being labeled as 'Urgent'. Tasks with less than the
          specified number of hours remaining until their due date will be
          labeled as 'Urgent', while those with more than that number of hours
          remaining will be labeled as 'Upcoming'.
        </div>
      )}
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
      <FloatingLabel label="Show legend">
        <Form.Select
          value={showLegend ? "true" : "false"}
          onChange={(e) => setShowLegend(e.target.value === "true")}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </Form.Select>
      </FloatingLabel>
      <p>
        Example date and time with selected settings:
        <br />
        {getDateTimeString(
          new Date().toString(),
          selectedTimeFormat,
          selectedDateFormat
        )}
      </p>
      <button
        className="submit-button"
        onClick={(e) => handleSettingsSaveSubmit(e)}
      >
        Save task settings
      </button>
    </div>
  );
};

export default TaskSettings;
