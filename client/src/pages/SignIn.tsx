import { useEffect, useState } from "react";
import { adequatePasswordComplexity, isEmailValid } from "../utils";
import axios from "axios";
import SignInForm from "../components/SignInForm";
import Verify from "../components/Verify";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useSetSignedIn } from "../components/Layout";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [setSignedIn] = useSetSignedIn();

  useEffect(() => {
    clearErrors();
  }, [email, password]);

  const clearErrors = () => {
    setError("");
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Reduce number of clearly invalid requests being sent to server by checking
    // the email and password fields using the same checks as the sign up form
    if (!isEmailValid(email)) {
      setError("Please input a valid email address.");
      setLoading(false);
      return;
    }

    const errorMessage = adequatePasswordComplexity(password);
    if (errorMessage) {
      setError("Incorrect password. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const credentials = {
        email: email,
        password: password,
      };
      const response = await axios.post("/login", credentials);
      localStorage.setItem("token", response.data.token);
      setSignedIn(true);
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 404) {
        setError(
          "The email you entered is not registered with any account. " +
            "Please make sure you have entered the correct email or sign " +
            "up for a new account."
        );
      } else if (error.response.status === 401) {
        setError("Incorrect password. Please try again.");
      } else if (error.response.status === 403) {
        setError("Please verify your email address before logging in.");
        setIsVerificationMode(true);
      } else {
        setError("Something went wrong. Please try again later.");
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
      <SignInForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
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

export default SignIn;
