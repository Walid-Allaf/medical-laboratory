import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useNotifications } from "../contexts/Notifications";
import { Alert } from "@mui/material";

export default function GuestLayout() {
  const { user } = useStateContext();
  const { error } = useNotifications();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div id="guestLayout">
      {error && (
        <Alert
          icon={false}
          translate="yes"
          variant="filled"
          severity="error"
          className="error slide"
        >
          {error}
        </Alert>
      )}

      <Outlet />
    </div>
  );
}
