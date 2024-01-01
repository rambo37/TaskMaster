import axios from "axios";

export const isSignedIn = async () => {
  // Reduce the number of requests sent to the server
  if (!getUserId()) return false;
  try {
    await axios.get("/check-auth");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getUserId = () => {
  return sessionStorage.getItem("userId");
};

export const isInvalidDate = (date: Date): boolean => {
  return isNaN(date.getTime());
};
