import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  error: null,
  setError: () => {},
  success: null,
  setSuccess: () => {},
});

export const Notifications = ({ children }) => {
  const [error, _setError] = useState("");
  const [success, _setSuccess] = useState("");

  const setError = (message) => {
    _setError(message);

    setTimeout(() => {
      _setError("");
    }, 5000);
  };

  const setSuccess = (message) => {
    _setSuccess(message);

    setTimeout(() => {
      _setSuccess("");
    }, 5000);
  };

  return (
    <StateContext.Provider
      value={{
        error,
        setError,
        success,
        setSuccess,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useNotifications = () => useContext(StateContext);
