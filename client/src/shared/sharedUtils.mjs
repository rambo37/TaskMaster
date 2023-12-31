
export const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Eventually add checks against common/easily guessed passwords
export const adequatePasswordComplexity = (password) => {
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
