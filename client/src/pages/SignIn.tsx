import { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          className="submit-button"
        ></input>
      </div>
      <div className="form-footer">
        Don't have an account? <a href="/signup">Sign up</a>
        <p>
          Forgot your password? <a href="/account-recovery">Reset password</a>
        </p>
      </div>
    </form>
  );
};

export default SignIn;
