import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { User } from "./Account";
import { toast } from "react-toastify";
import { adequatePasswordComplexity } from "../utils";
import { useNavigate } from "react-router-dom";

type ChangeDisplayNameProps = {
  user: User;
  setSignedIn: React.Dispatch<boolean>;
};

const ChangePassword = ({ user, setSignedIn }: ChangeDisplayNameProps) => {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [error, setError] = useState("");
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
      await axios.delete(`/users/${user._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
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
    <section>
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
          <input
            type="password"
            className="max-width-input"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            value={password}
          />
          <input
            type="submit"
            value="Confirm account deletion"
            name="Confirm account deletion"
            onClick={(e) => handleConfirmDeleteAccountSubmit(e)}
            className="submit-button"
          ></input>
        </>
      )}
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
