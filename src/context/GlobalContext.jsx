import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // Backend base URL (local dev tunnel)
  // const baseUrl = "https://ml3xdkmd-5050.inc1.devtunnels.ms".replace(/\/+$/, "");
  const baseUrl = "https://api.carveeps.com";

  const [activeLink, setActiveLink] = useState("Dashboard");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // Subadmin & permission auth state
  const [subadmin, setSubadmin] = useState(() => {
    try {
      const stored = localStorage.getItem("subadmin");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const isSubadmin = !!subadmin;
  const permissions = subadmin?.permissions || [];

  const setSubadminData = (data) => {
    if (data) {
      setSubadmin(data);
      localStorage.setItem("subadmin", JSON.stringify(data));
    } else {
      setSubadmin(null);
      localStorage.removeItem("subadmin");
    }
  };

  const clearAuth = () => {
    Cookies.remove("token");
    Cookies.remove("email");
    Cookies.remove("verifyToken");
    setSubadmin(null);
    localStorage.removeItem("subadmin");
  };

  const canAccess = (moduleName) => {
    // If not a subadmin (i.e. full admin), grant access to everything
    if (!subadmin) return true;
    const perms = subadmin?.permissions || [];
    return Array.isArray(perms) && perms.includes(moduleName);
  };

  const navigateToLink = (link, name) => {
    navigate(link);
    if (name) setActiveLink(name);
  };

  // Axios interceptor to catch any 403 Forbidden responses across the app
  // and display the exact error message in the toast instead of logging out
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (err) => {
        if (err?.response?.status === 403) {
          const msg =
            err?.response?.data?.message ||
            "Forbidden - You do not have permission to access this module.";
          setError(msg);
        }
        return Promise.reject(err);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        activeLink,
        setActiveLink,
        navigateToLink,
        baseUrl,
        error,
        setError,
        success,
        setSuccess,
        subadmin,
        isSubadmin,
        permissions,
        setSubadminData,
        clearAuth,
        canAccess,
      }}
    >
      <div>{children}</div>
    </GlobalContext.Provider>
  );
};
