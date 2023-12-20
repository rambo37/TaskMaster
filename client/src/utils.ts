import { jwtDecode } from "jwt-decode";

export const isSignedIn = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken: { exp: Number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) return false;
    else return true;
  }
  return false;
};

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken: { userId: string } = jwtDecode(token);
      return decodedToken.userId;
    } catch (error) {
      console.error("Invalid token");
      return null;
    }
  }
  return null;
};

export const isEmailValid = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Eventually add checks against common/easily guessed passwords
export const adequatePasswordComplexity = (password: string) => {
  // At least 8 characters
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  // At least one digit
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  // At least one special character
  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain at least one special character.";
  }

  return "";
};
