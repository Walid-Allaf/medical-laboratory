import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
// import { useAuth } from "../../contexts/AuthProvider";
// import { axios } from "../../utils";
import { Paper } from "@mui/material";
import { LoginBg } from "../../assets";
import axiosClient from "../../axios/axiosClient";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { LoadingButton } from "@mui/lab";
import { Copyright } from "../../components";
import { useNotifications } from "../../contexts/Notifications";

const Login = () => {
  const { setUser } = useStateContext();
  const { setError } = useNotifications();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await axiosClient
      .post(`/User/login`, {
        password: data.get("password"),
        userName: data.get("username"),
      })
      .then((res) => {
        event.preventDefault();
        setLoading(false);
        setUser(data.get("username"));
        sessionStorage.setItem("ai-lab-user", JSON.stringify(res.data));
        navigate("/");
        window.location.reload();
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response.data);
      });
  };

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        backgroundImage: `url(${LoginBg})`,
        backgroundRepeat: "no-repeat",
        backgroundColor: (t) =>
          t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <CssBaseline />
      <Grid
        container
        component="main"
        sx={{ height: "100vh", display: "grid", placeItems: "center" }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{ backgroundColor: "#061a2ea8", p: 3, borderRadius: "10px" }}
        >
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main", mb: 2 }}></Avatar>
            <Typography component="h1" variant="h5" marginBottom={5} color={"#fff"}>
              تسجيل الدخول
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    required
                    fullWidth
                    id="username"
                    label="اسم المستخدم"
                    name="username"
                    autoComplete="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="كلمة المرور"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <LoadingButton
                loading={loading}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                تسجيل دخول
              </LoadingButton>
            </Box>
            <Copyright />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
