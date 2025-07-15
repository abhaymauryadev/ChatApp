import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated and if so, set the user data and connect the socket

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axios.get("api/auth/check-auth");
      if (data.success) {
        setAuthUser(data.user);
        connectionSocket(data.user);
      }
    } catch (error) {
      console.log("Auth check failed:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Socket connection function
  const connectionSocket = (userData) => {
    const newSocket = io(backendUrl, {
      query: { userId: userData._id }
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);
  };

  //  Login function to handle user authentication and socket connection

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectionSocket(data.userData);
        axios.defaults.headers.common["token"] = `Bearer ${data.token}`;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout function to handle user logout and disconnect the socket

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logout Successfully");
    if (socket) {
      socket.disconnect();
    }
  };

  // Update profile function to handle updating user profile information

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
        return data;
      } else {
        toast.error(data.message || "Failed to update profile");
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update profile");
      throw error;
    }
  };
  // Check authentication on mount
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token, checkAuth]);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    checkAuth,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
