type SignUpFormProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.MouseEvent) => Promise<void>;
};

const SignInForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
}: SignUpFormProps) => {
  return (
    <>
      <h3 className="form-title ">Sign in</h3>
      <input
        type="email"
        id="email"
        className="max-width-input"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        value={email}
        autoFocus
      />
      <input
        type="password"
        id="password"
        className="max-width-input"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        value={password}
      />
      <input
        type="submit"
        value="Sign in"
        name="Sign in"
        onClick={(e) => handleSubmit(e)}
        className="submit-button"
      ></input>
      <div className="form-footer">
        Don't have an account? <a href="/signup">Sign up</a>
        <p>
          Forgot your password? <a href="/account-recovery">Reset password</a>
        </p>
      </div>
    </>
  );
};

export default SignInForm;
