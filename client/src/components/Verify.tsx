import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type VerifyProps = {
  clearErrors: () => void;
  setError: (errorMessage: string) => void;
  email: string;
  setLoading: (loading: boolean) => void;
  setSignedIn: (signedIn: boolean) => void;
};

const Verify = ({
  clearErrors,
  setError,
  email,
  setLoading,
  setSignedIn,
}: VerifyProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    if (!verificationCode.length) {
      setError("Please enter your verification code.");
      setLoading(false);
      return;
    }

    try {
      const verificationInfo = {
        email: email,
        code: Number(verificationCode),
      };
      const response = await axios.post("/users/verify", verificationInfo);
      toast.success("Successfully verified account.");
      localStorage.setItem("token", response.data.token);
      setSignedIn(true);
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error || "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    try {
      const accountInfo = {
        email: email,
      };
      await axios.post("/users/resend-verification", accountInfo);
      toast.success("Successfully resent verification code.");
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error || "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="form-title">Verify your email address</p>
      <p>
        A verification code has been sent to {email}. Please enter the code
        below to complete account creation.
      </p>
      <input
        type="string"
        id="code"
        className="max-width-input"
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="Verification code"
        value={verificationCode}
      />
      <p />
      <input
        type="submit"
        value="Verify"
        onClick={(e) => handleSubmit(e)}
        className="max-width-input"
      ></input>
      <p />
      <input
        type="submit"
        value="Resend code"
        onClick={(e) => resendConfirmationCode(e)}
        className="max-width-input"
      ></input>
      <p />
    </>
  );
};

export default Verify;
