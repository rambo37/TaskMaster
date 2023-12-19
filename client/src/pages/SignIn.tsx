import { useEffect, useState } from "react";
import { adequatePasswordComplexity, isEmailValid } from "../utils";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    clearErrors();
  }, [email, password]);

  const clearErrors = () => {
    setError("");
  }

  const handleSubmit = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault();
    setError("");

    // Reduce number of clearly invalid requests being sent to server by checking
    // the email and password fields using the same checks as the sign up form
    if (!isEmailValid(email)) {
      setError("Please input a valid email address.");
      return;
    }

    const errorMessage = adequatePasswordComplexity(password);
    if (errorMessage) {
      setError("Incorrect password. Please try again.");
      return;
    }

    // TODO: Send request to login endpoint
  };

  return (
    <form>
      <h3 className="form-title ">Sign in</h3>
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
          type="submit"
          value="Sign in"
          name="Sign in"
          onClick={(e) => handleSubmit(e)}
          className="submit-button"
        ></input>
      </div>
      <div className="form-footer">
        Don't have an account? <a href="/signup">Sign up</a>
        <p>
          Forgot your password? <a href="/account-recovery">Reset password</a>
        </p>
      </div>
      {error && <div className="error-div">{error}</div>}
    </form>
  );
};

export default SignIn;
