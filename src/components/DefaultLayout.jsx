import React from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useNotifications } from "../contexts/Notifications";
import {
  Alert,
  AppBar,
  Avatar,
  Drawer,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { LeftNav } from "../layout";
import { useStateContext } from "../contexts/ContextProvider";
import { Landing, LoginBg } from "../assets";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "./Image";
import axiosClient from "../axios/axiosClient";

const drawerWidth = 240;
const DefaultLayout = (props) => {
  const { error, success, setError } = useNotifications();
  const { user, setSearch } = useStateContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { window } = props;

  const username = sessionStorage.getItem("ai-lab-username");
  const fullName = `${JSON.parse(sessionStorage.getItem("ai-lab-user"))?.firstName} ${
    JSON.parse(sessionStorage.getItem("ai-lab-user"))?.lastName
  }`;
  const userImage = `${JSON.parse(sessionStorage.getItem("ai-lab-user"))?.image2}`;

  const container = window !== undefined ? () => window().document.body : undefined;

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const searchByName = (name) => {
    setSearchValue(name);
    let split = name.split(" ");
    axiosClient
      .get(`/Patient/SearchByName?firstName=${split[0] || ""}&lastName=${split[1] || ""}`)
      .then((response) => {
        setSearch(response.data);
      })
      .catch((error) => {
        if (error.response.status !== 400) {
          setError(error?.response?.data);
        }
        setSearch([]);
      });
  };

  React.useEffect(() => {
    if (pathname !== "/search") {
      setSearch([]);
      setSearchValue("");
    }
  }, [pathname]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "start",
        // backgroundImage: `url(${Landing})`,
        // backgroundColor: "#2b29a552",
        backgroundColor: "#2f79bea1",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "calc(100vh - 80px)",
        py: "40px",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mr: { sm: `${drawerWidth}px` },
          background: "#121621",
          // backdropFilter: "blur(8px)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Avatar sx={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>
            <Image src={userImage} width={50} />
          </Avatar>
          <TextField
            // fullWidth
            sx={{ minWidth: 500 }}
            size="small"
            placeholder="البحث"
            value={searchValue}
            onChange={(e) => searchByName(e.target.value)}
            onFocus={() => navigate("/search")}
            // onBlur={() => navigate(-1)}
          />
          <Typography variant="h6" noWrap component="div">
            {username} : {fullName}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              // background: "transparent",
              // backdropFilter: "blur(7px)",
            },
          }}
          anchor="right"
        >
          <LeftNav />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
          anchor="right"
        >
          <LeftNav />
        </Drawer>
      </Box>
      {error && (
        // <Typography color="#fff" bgcolor="#f14b4b" className="error slide">
        //   {error}
        // </Typography>
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
      {success && (
        // <Typography color="#fff" bgcolor="#66bb6a" className="success slide">
        //   {success}
        // </Typography>
        <Alert
          icon={false}
          translate="yes"
          variant="filled"
          severity="success"
          className="success slide"
        >
          {success}
        </Alert>
      )}

      <Outlet />
    </Box>
  );
};

export default DefaultLayout;
