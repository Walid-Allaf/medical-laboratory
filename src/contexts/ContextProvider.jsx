import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  currentUser: null,
  search: null,
  notification: null,
  setUser: () => {},
  setSearch: () => {},
  setNotification: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, _setUser] = useState(sessionStorage.getItem("ai-lab-username") || null);
  const [search, _setSearch] = useState([]);
  const [notification, _setNotification] = useState("");

  const setSearch = (search) => {
    _setSearch(search);
    // if (search) {
    //   sessionStorage.setItem("ai-lab-search", search);
    // } else {
    //   sessionStorage.removeItem("ai-lab-search");
    // }
  };
  const setUser = (user) => {
    _setUser(user);
    if (user) {
      sessionStorage.setItem("ai-lab-username", user);
    } else {
      sessionStorage.removeItem("ai-lab-username");
    }
  };

  const setNotification = (message) => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification("");
    }, 5000);
  };

  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        search,
        setSearch,
        notification,
        setNotification,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
