import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const isSignedIn = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    const decodedToken: { exp: number } = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) return false;
    else return true;
  }
  return false;
};

export const getUserIdFromToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    try {
      const decodedToken: { userId: string } = jwtDecode(accessToken);
      return decodedToken.userId;
    } catch (error) {
      console.error("Invalid token");
      return null;
    }
  }
  return null;
};

export const getAuthHeader = async () => {
  // Generate a fresh access token first if necessary
  if (!isSignedIn()) {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post("/refresh-token", { refreshToken });
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
  }

  const accessToken = localStorage.getItem("accessToken");

  return { 
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
};

export const isInvalidDate = (date: Date): boolean => {
  return isNaN(date.getTime());
};

export const isFutureDate = (date: Date): boolean => {
  const currentDate = new Date();
  return currentDate < date;
};
