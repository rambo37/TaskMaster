import { useState, useEffect } from "react";
import { adequatePasswordComplexity, isEmailValid } from "../utils";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

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

  const handleSubmit = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault();
    clearErrors();

    if (!isEmailValid(email)) {
      setError("Invalid email.");
      return;
    }

    if (!checkPasswords()) return;

    const errorMessage = adequatePasswordComplexity(password);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    // TODO
    // Send request to API to verify email is available
    // GET request to "/users?email=example@example.com"
    // Returns:
    // 200 if resource exists (do not return user details - empty response body)
    // 404 if the resource does not exist
  };

  return (
    <form>
      <h3 className="form-title ">Sign up</h3>
      <div className="form-section">
        <input
          type="email"
          id="email"
          className="max-width-input"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          value={email}
          autoFocus
        />
      </div>
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
          value="Sign up"
          name="Sign up"
          onClick={(e) => handleSubmit(e)}
          className="submit-button"
        ></input>
      </div>
      <p className="form-footer">
        Already have an account? <a href="/login">Log in</a>
      </p>
      {error && <div className="error-div">{error}</div>}
    </form>
  );
};

export default SignUp;
