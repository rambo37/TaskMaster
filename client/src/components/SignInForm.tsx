import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

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
      <FloatingLabel label="Email address" className="mb-3">
        <Form.Control
          type="email"
          name="email"
          placeholder="Email address"
          className="max-width-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
      </FloatingLabel>
      <FloatingLabel label="Password" className="mb-3">
        <Form.Control
          type="password"
          placeholder="Password"
          className="max-width-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FloatingLabel>
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
