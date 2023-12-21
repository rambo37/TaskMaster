import { useEffect, useState } from "react";
import { adequatePasswordComplexity } from "../utils";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
      await axios.post("/password/update", passwordResetInfo);
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
      <div className="form-section">
        <input
          type="password"
          id="password"
          className="max-width-input"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          value={password}
        />
      </div>
      <div className="form-section">
        <input
          type="password"
          id="confirmPassword"
          className="max-width-input"
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          value={confirmPassword}
        />
      </div>
      <div className="form-section">
        <input
          type="submit"
          value="Update password"
          className="max-width-input"
          onClick={(e) => updatePassword(e)}
        ></input>
      </div>
      {loading && (
        <div className="form-section" style={{ textAlign: "center" }}>
          <ClipLoader />
        </div>
      )}
      {error && <div className="status error">{error}</div>}
    </form>
  );
};

export default ResetPassword;
