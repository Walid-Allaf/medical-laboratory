import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box, Grid } from "@mui/material";
import { Image } from "../../components";
import { useNotifications } from "../../contexts/Notifications";
import axiosClient from "../../axios/axiosClient";
import { useNavigate } from "react-router";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    userId: JSON.parse(sessionStorage.getItem("ai-lab-user")).userId,
    username: JSON.parse(sessionStorage.getItem("ai-lab-user")).userName,
    name:
      JSON.parse(sessionStorage.getItem("ai-lab-user")).firstName +
      " " +
      JSON.parse(sessionStorage.getItem("ai-lab-user")).lastName,
    email: JSON.parse(sessionStorage.getItem("ai-lab-user")).email,
    img: JSON.parse(sessionStorage.getItem("ai-lab-user")).image2,
  });
  const { setError, setSuccess } = useNotifications();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword === passwords.confirmNewPassword) {
      // Send the new password to the server
      axiosClient
        .post(`/User/ChangePassword`, {
          userId: userInfo.userId,
          oldPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        })
        .then((res) => {
          console.log("تم تغيير كلمة المرور بنجاح");
          setSuccess("تم تغيير كلمة المرور بنجاح");
        })
        .catch((err) => {
          setError(err.response.data);
        });
    } else {
      setError("كلمة المرور غير مطابقة");
    }
  };

  return (
    <Container fixed sx={{ py: "50px", display: "flex", flexDirection: "column", gap: 5 }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          الملف الشخصي
        </Typography>
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ "& p": { mb: 2, fontSize: 24 } }}>
            <Typography>اسم المستخدم: {userInfo.username}</Typography>
            <Typography>الاسم: {userInfo.name}</Typography>
            <Typography>البريد الإلكتروني: {userInfo.email}</Typography>
          </Box>
          <Box>
            <Image src={userInfo.img} width={200} height={200} />
          </Box>
        </Box>
        <Box component="form" onSubmit={handlePasswordSubmit}>
          <Typography variant="h5" gutterBottom>
            تغيير كلمة السر
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="كلمة السر الحالية"
                name="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="كلمة السر الجديدة"
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="تأكيد كلمة السر الجديدة"
                name="confirmNewPassword"
                type="password"
                value={passwords.confirmNewPassword}
                onChange={handlePasswordChange}
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            تغيير كلمة السر
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, mr: 2 }}
            onClick={() =>
              navigate(`/users/${userInfo.username}`, {
                state: {
                  ...userInfo,
                },
              })
            }
          >
            تعديل المعلومات الشخصية
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
