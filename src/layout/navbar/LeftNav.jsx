import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { NavItems, QuickAccess } from "./NavItems";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import { useStateContext } from "../../contexts/ContextProvider";
import BiotechIcon from "@mui/icons-material/Biotech";
import { useConfirm } from "material-ui-confirm";

const LeftNav = () => {
  const navigate = useNavigate();
  const { setUser } = useStateContext();
  const param = useLocation();
  const confirm = useConfirm();

  const logout = () => {
    confirm({
      title: "هل انت متأكد؟",
      description: "أنت على وشك تسجيل الخروج!",
      cancellationText: "إلغاء",
      confirmationText: "حسناً",
      confirmationButtonProps: { color: "error", variant: "contained" },
      cancellationButtonProps: { color: "secondary", variant: "contained" },
    })
      .then(() => {
        setUser(null);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#121621" }}>
      <Toolbar
        sx={{
          "& *": { color: "#FFF" },
          display: "flex",
          gap: 1,
          alignItems: "center",
          px: "8px !important",
        }}
      >
        <BiotechIcon fontSize="large" />
        <Typography>المختبر الذكي</Typography>
      </Toolbar>
      <Divider color="#aaa" />
      <ListItem sx={{ color: "#aaa", py: 2 }}>القائمة</ListItem>
      <Divider color="#aaa" />

      <List disablePadding>
        {NavItems.map((item, key) => {
          const { title, path, show, icon } = item;
          return (
            <ListItem
              key={key}
              disablePadding
              onClick={() => navigate(path)}
              sx={{
                bgcolor: param.pathname === path ? "primary.main" : "",
                color: "#FFF",
                transition: "0.3s",
                display: show ? "block" : "none",
                ":hover": {
                  bgcolor: "secondary.main",
                  color: "#fff",
                },
              }}
            >
              <ListItemButton sx={{ textAlign: "right" }}>
                <ListItemText primary={title} />
                {icon}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider color="#aaa" />
      <ListItem sx={{ color: "#aaa", py: 2 }}>الوصول السريع</ListItem>
      <Divider color="#aaa" />
      <List disablePadding>
        {QuickAccess.map((item, key) => {
          const { title, path, show, icon } = item;
          return (
            <ListItem
              key={key}
              disablePadding
              onClick={() => navigate(path)}
              sx={{
                bgcolor: param.pathname === path ? "primary.main" : "",
                color: "#FFF",
                transition: "0.3s",
                display: show ? "block" : "none",
                ":hover": {
                  bgcolor: "#1976d2",
                  color: "#fff",
                },
              }}
            >
              <ListItemButton sx={{ textAlign: "right" }}>
                <ListItemText primary={title} />
                {icon}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider color="#aaa" />
      <List disablePadding>
        <ListItem
          disablePadding
          onClick={logout}
          sx={{
            color: "#FFF",
            transition: "0.3s",
            ":hover": {
              bgcolor: "#1976d2",
              color: "#fff",
            },
          }}
        >
          <ListItemButton sx={{ textAlign: "right" }}>
            <ListItemText primary={"تبديل الحساب"} />
            <SwitchAccountIcon />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider color="#aaa" />
    </Box>
  );
};

export default LeftNav;
