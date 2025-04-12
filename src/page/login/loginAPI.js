import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,30}$/;

const getToken = () => localStorage.getItem("accessToken"); // jwtToken
const getUserName = () => localStorage.getItem("username")
const setToken = (token) => localStorage.setItem("accessToken", token);
const setUserName = (username) => localStorage.setItem("username", username);

const removeTokens = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("username")
};
const getUserId = () => localStorage.getItem("userId");

// Checks if the JWT token is expired
const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

// Validates the token using your API.
const validateToken = async (token) => {
  try {
    const response = await axios.get((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_VALIDATE_TOKEN_URL), {
      headers: {
        'x-access-token': token,
      }
    });
    return response.status === 200 ? response.data.isValid : false;
  } catch (error) {
    return false;
  }
};

// Gets a valid token or logs out after timeout
const getValidToken = async () => {
  const token = getToken();
  if (!token || isTokenExpired(token)) return false;

  const timeout = 5000; // 5 seconds timeout
  try {
    return await Promise.race([
      validateToken(token),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Server is not responding")), timeout)
      ),
    ]);
  } catch {
    return false;
  }
};

const isSuperUser = (token) => {
  try {
    const decoded = jwtDecode(token);
    const isAdmin = decoded?.role === "Admin";
    return isAdmin;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};


export { PASSWORD_REGEX, getValidToken, getToken, getUserId, isTokenExpired, setToken, getUserName, setUserName, removeTokens, isSuperUser }
