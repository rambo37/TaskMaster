import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthHeader } from "../utils";
import { adequatePasswordComplexity } from "../shared/sharedUtils.mjs";
import { useNavigate } from "react-router-dom";
import { ContentProps } from "./SettingsPageSection";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const ChangePassword = ({
  setLoading,
  setError,
  user,
  setSignedIn,
}: ContentProps) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleConfirmDeleteAccountSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    const errorMessage = adequatePasswordComplexity(password);
    if (errorMessage) {
      setError("Incorrect password.");
      setLoading(false);
      return;
    }

    // First use login endpoint to verify password is correct
    try {
      const credentials = {
        email: user.email,
        password: password,
      };
      await axios.post("/login", credentials);
    } catch (error: any) {
      console.error(error);
      setError("Incorrect password.");
      setLoading(false);
      return;
    }

    // Now attempt to delete the account as the password is correct
    try {
      await axios.delete(`/users/${user._id}`, await getAuthHeader());
      localStorage.removeItem("token");
      setSignedIn(false);
      toast.success("Account deleted.");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3>Delete account</h3>
      <p>
        Warning: this action cannot be undone. All saved data will be
        permanently lost.
      </p>
      <input
        type="submit"
        value="Delete account"
        name="Delete account"
        onClick={() => setShowDeleteConfirmation(true)}
        className="submit-button"
      ></input>
      {showDeleteConfirmation && (
        <>
          <p>
            Please enter your password and press the button below to proceed.
          </p>
          <FloatingLabel label="Password" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              className="max-width-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>
          <input
            type="submit"
            value="Confirm account deletion"
            name="Confirm account deletion"
            onClick={(e) => handleConfirmDeleteAccountSubmit(e)}
            className="submit-button"
          ></input>
        </>
      )}
    </>
  );
};

export default ChangePassword;
