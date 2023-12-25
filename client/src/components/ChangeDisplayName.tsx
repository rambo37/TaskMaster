import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ContentProps } from "./SettingsPageSection";

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
      const response = await axios.patch(`/users/${user._id}`, updates, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setUser(response.data);
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
      <input
        className="max-width-input"
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Display name"
        value={displayName}
      />
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
