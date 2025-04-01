import { useEffect, useState } from "react";
import { adequatePasswordComplexity } from "../shared/sharedUtils.mjs";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    if (email) setEmail(email);
    if (token) setResetToken(token);
  }, []);

  useEffect(() => {
    checkPasswords();
  }, [password, confirmPassword]);

  const checkPasswords = () => {
    if (password !== confirmPassword) {
      setError("Passwords must match.");
      return false;
    }

    clearErrors();
    return true;
  };

  const clearErrors = () => {
    setError("");
  };

  const updatePassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!checkPasswords()) {
      setLoading(false);
      return;
    }

    const errorMessage = adequatePasswordComplexity(password);
    if (errorMessage) {
      setError(errorMessage);
      setLoading(false);
      return;
    }

    try {
      const passwordResetInfo = {
        email: email,
        resetToken: resetToken,
        newPassword: password,
      };
      await axios.post("/api/password/update", passwordResetInfo);
      navigate("/login");
      toast.success("Password successfully reset.");
    } catch (error: any) {
      console.error(error);
      if (error.response.data.error.toLowerCase().includes("expired")) {
        setError(
          "Your password reset link has expired. Please try resetting " +
            "your password again."
        );
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      <p>Please enter your new password.</p>
      <FloatingLabel label="Password" className="mb-3">
        <Form.Control
          type="password"
          placeholder="Password"
          className="max-width-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FloatingLabel>
      <FloatingLabel label="Confirm password" className="mb-3">
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          className="max-width-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FloatingLabel>
      <input
        type="submit"
        value="Update password"
        className="submit-button"
        onClick={(e) => updatePassword(e)}
      ></input>
      {loading && (
        <div style={{ textAlign: "center" }}>
          <ClipLoader />
        </div>
      )}
      {error && <div className="status error">{error}</div>}
    </form>
  );
};

export default ResetPassword;
