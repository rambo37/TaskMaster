import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { User } from "./Account";
import { toast } from "react-toastify";
import { adequatePasswordComplexity } from "../utils";

type ChangeDisplayNameProps = {
  user: User;
};

const ChangePassword = ({ user }: ChangeDisplayNameProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPasswords();
  }, [newPassword, confirmNewPassword]);

  const checkPasswords = () => {
    if (newPassword !== confirmNewPassword) {
      setError("Passwords must match.");
      return false;
    }

    setError("");
    return true;
  };

  const handleUpdatePasswordSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!checkPasswords()) {
      setLoading(false);
      return;
    }

    let errorMessage = adequatePasswordComplexity(newPassword);
    if (errorMessage) {
      setError("New p" + errorMessage.substring(1));
      setLoading(false);
      return;
    }

    errorMessage = adequatePasswordComplexity(currentPassword);
    if (errorMessage) {
      setError("Incorrect current password.");
      setLoading(false);
      return;
    }

    try {
      const passwordInfo = {
        currentPassword: currentPassword,
        newPassword: newPassword,
      };
      await axios.patch(`/users/${user._id}/password`, passwordInfo, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      toast.success("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      console.error(error);
      if (error.response.data.error.toLowerCase().includes("incorrect")) {
        setError(error.response.data.error);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h3>Change password</h3>
      <input
        type="password"
        className="max-width-input"
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Current password"
        value={currentPassword}
      />
      <input
        type="password"
        className="max-width-input"
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New password"
        value={newPassword}
      />
      <input
        type="password"
        className="max-width-input"
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        placeholder="Confirm new password"
        value={confirmNewPassword}
      />
      <input
        type="submit"
        value="Update password"
        name="Update password"
        onClick={(e) => handleUpdatePasswordSubmit(e)}
        className="submit-button"
      ></input>
      {loading && (
        <div style={{ textAlign: "center" }}>
          <ClipLoader />
        </div>
      )}
      {error && <div className="status error">{error}</div>}
    </section>
  );
};

export default ChangePassword;
