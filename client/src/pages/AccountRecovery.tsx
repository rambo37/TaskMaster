import { useState } from "react";
import { isEmailValid } from "../utils";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const AccountRecovery = () => {
  const [email, setEmail] = useState("");
  const [emailSentMessage, setEmailSentMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendRecoveryEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEmailSentMessage("");

    if (!isEmailValid(email)) {
      setError("Please input a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const userEmail = {
        email: email,
      };
      await axios.post("/password/reset", userEmail);
      setEmailSentMessage(
        `An email with a link to reset your password has been sent to ${email}.`
      );
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 404) {
        setError(
          "The email you entered is not registered with any account. " +
            "Please make sure you have entered the correct email or sign " +
            "up for a new account."
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
      <p>Please enter your email address to reset your password.</p>
      <FloatingLabel label="Email address" className="mb-3">
        <Form.Control
          type="email"
          placeholder="Email address"
          className="max-width-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
      </FloatingLabel>
      <input
        type="submit"
        value="Send recovery email"
        className="max-width-input"
        onClick={(e) => sendRecoveryEmail(e)}
      />
      {loading && (
        <div style={{ textAlign: "center" }}>
          <ClipLoader />
        </div>
      )}
      {emailSentMessage && (
        <div className="status success">{emailSentMessage}</div>
      )}
      {error && <div className="status error">{error}</div>}
    </form>
  );
};

export default AccountRecovery;
