import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

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
      <FloatingLabel label="Email address" className="mb-3">
        <Form.Control
          type="email"
          placeholder="Email address"
          className="max-width-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        value="Sign up"
        name="Sign up"
        onClick={(e) => handleSubmit(e)}
        className="submit-button"
      ></input>
      <p className="form-footer">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </>
  );
};

export default SignUpForm;
