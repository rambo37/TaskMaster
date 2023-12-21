import { useState, useEffect } from "react";
import { adequatePasswordComplexity, isEmailValid } from "../utils";
import axios from "axios";
import SignUpForm from "../components/SignUpForm";
import Verify from "../components/Verify";
import { ClipLoader } from "react-spinners";
import { useSetSignedIn } from "../components/Layout";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [setSignedIn] = useSetSignedIn();

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

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    if (!isEmailValid(email)) {
      setError("Invalid email.");
      setLoading(false);
      return;
    }

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
      const accountInfo = {
        email: email,
        password: password,
      };
      await axios.post("/users", accountInfo);
      // Show the verification form
      setIsVerificationMode(true);
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 409) {
        // Display a specific error message for email already in use
        setError(
          "An account with that amail address already exists. Please try " +
            "with a different email address."
        );
      }
      else {
        setError("Error creating account. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (isVerificationMode) {
      return (
        <Verify
          clearErrors={clearErrors}
          setError={setError}
          email={email}
          setLoading={setLoading}
          setSignedIn={setSignedIn}
        />
      );
    }
    return (
      <SignUpForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handleSubmit={handleSubmit}
      />
    );
  };

  return (
    <form>
      {renderContent()}
      {loading && (
        <div className="form-section" style={{ textAlign: "center" }}>
          <ClipLoader />
        </div>
      )}
      {error && <div className="error-div">{error}</div>}
    </form>
  );
};

export default SignUp;
