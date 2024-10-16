import React, { createContext, useState, useRef } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // Sidebar link toggles
  const baseUrl = "https://api.carveeps.com";

  const [activeLink, setActiveLink] = useState("Dashboard");
  const navigateToLink = (link, name) => {
    navigate(link);
    setActiveLink(name);
  };

  const [error, setError] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        activeLink,
        setActiveLink,
        navigateToLink,
        baseUrl,
        error,
        setError,
      }}
    >
      <div>{children}</div>
    </GlobalContext.Provider>
  );
};
