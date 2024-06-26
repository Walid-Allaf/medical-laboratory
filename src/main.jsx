import ReactDOM from "react-dom/client";
import React from "react";

import { RouterProvider } from "react-router";
import router from "./routes";

import "./styles/style.scss";

import { Notifications } from "./contexts/Notifications";
import { ConfirmProvider } from "material-ui-confirm";
import { ThemeProvider } from "@mui/material";
import theme from "./themes/Themes";
import { ContextProvider } from "./contexts/ContextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <Notifications>
      <ContextProvider>
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
      </ContextProvider>
    </Notifications>
  </ThemeProvider>
  // </React.StrictMode>
);
