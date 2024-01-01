import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ContentProps } from "./SettingsPageSection";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const ChangeDisplayName = ({
  setLoading,
  setError,
  user,
  setUser,
}: ContentProps) => {
  const [displayName, setDisplayName] = useState("");

  const handleUpdateDisplayNameSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates = {
        name: displayName,
      };
      await axios.patch(`/users/${user._id}`, updates);
      const updatedUser = {
        ...user,
        name: displayName,
      };
      setUser(updatedUser);
      toast.success("Display name updated.");
      setDisplayName("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3>Set display name</h3>
      <p>Your current display name is: {user.name ? user.name : user.email}</p>
      <FloatingLabel label="Display name" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Display name"
          className="max-width-input"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </FloatingLabel>
      <input
        type="submit"
        value="Update display name"
        name="Update display name"
        onClick={handleUpdateDisplayNameSubmit}
        className="submit-button"
      ></input>
    </>
  );
};

export default ChangeDisplayName;
