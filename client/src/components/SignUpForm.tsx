type SignUpFormProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  handleSubmit: (e: React.MouseEvent) => Promise<void>;
};

const SignUpForm = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSubmit,
}: SignUpFormProps) => {
  return (
    <>
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
    </>
  );
};

export default SignUpForm;
