import { Box, Container, TextField, Typography, Button, styled } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useEffect } from "react";
import axiosClient from "../../axios/axiosClient";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNotifications } from "../../contexts/Notifications";
import { useNavigate, useParams } from "react-router";
import { Image, Loading } from "../../components";
import { useLocation } from "react-router";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PhonesTable from "./PhonesTable";
import { compressImg } from "../../utils";

const AddUser = () => {
  const schema = Yup.object().shape({
    userName: Yup.string().required("User name required"),
    firstName: Yup.string().required("First name required"),
    lastName: Yup.string().required("Last name required"),
    // phone: Yup.string()
    //   .matches(
    //     /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    //     "Number not valid"
    //   )
    //   .min(9, "Incorrect number length")
    //   .max(10, "Incorrect number length"),
  });
  const VisuallyHiddenInput = styled("input")({
    height: "100%",
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: "100%",
    opacity: 0,
    cursor: "pointer",
  });
  const [loading, setLoading] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [user, setUser] = React.useState({});
  const [fileError, setFileError] = React.useState("");
  const [viewImg, setViewImg] = React.useState("");
  const { setError, setSuccess } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const { name } = useParams();

  const getUserDetails = async () => {
    setLoading(true);
    await axiosClient
      .get(`/user/${location.state.userId}`)
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data);
          setViewImg(res.data.image2);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  useEffect(() => {
    console.log({ ...location.state });
    name && getUserDetails();
  }, []);

  return (
    <Container fixed sx={{ py: "50px", display: "flex", flexDirection: "column", gap: 5 }}>
      {!name && <Typography fontSize={20}>إضافة مستخدم</Typography>}
      {name && <Typography fontSize={20}>تعديل المستخدم: {user.userName}</Typography>}
      {loading && name ? (
        <Loading />
      ) : (
        <Formik
          validationSchema={schema}
          initialValues={{
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            phone: [],
          }}
          onSubmit={(values) => {
            setUpdating(true);
            if (!name) {
              axiosClient
                .post(`/user`, {
                  userName: values.userName,
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  phones: values.phone,
                  password: values.password,
                  image2: viewImg,
                })
                .then((res) => {
                  if (res.status === 200) {
                    setSuccess(res.statusText);
                    setUpdating(false);
                    navigate(-1);
                    console.log(res);
                  }
                })
                .catch((err) => {
                  setError(err.message);
                  setUpdating(false);
                  console.log(err);
                });
            } else {
              axiosClient
                .put(`/user/${location.state.userId}`, {
                  userName: values.userName,
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  phones: values.phone,
                  password: values.password,
                  image2: viewImg,
                })
                .then((res) => {
                  if (res.status === 200) {
                    setSuccess("User Updated Successfuly");
                    setUpdating(false);
                    navigate(-1);
                  }
                })
                .catch((err) => {
                  setError(err.message);
                  setUpdating(false);
                  console.log(err);
                });
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            handleFormChange = (index, event) => {
              let data = [...values.phone];
              data[index][event.target.name] = event.target.value;
              setFieldValue("phone", data);
            },
            addFields = () => {
              let newfield = { phone: "" };
              setFieldValue("phone", [...values.phone, newfield]);
            },
            removeFields = (index) => {
              let data = [...values.phone];
              data.splice(index, 1);
              setFieldValue("phone", data);
            },
          }) => (
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <TextField
                required
                id="userName"
                type="text"
                label="اسم المستخدم"
                name="userName"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.userName}
                helperText={
                  <Typography color="error">
                    {errors.userName && touched.userName && errors.userName}
                  </Typography>
                }
              />
              <TextField
                required
                id="firstName"
                type="text"
                label="الاسم الأول"
                name="firstName"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
                helperText={
                  <Typography color="error">
                    {errors.firstName && touched.firstName && errors.firstName}
                  </Typography>
                }
              />
              <TextField
                required
                id="lastName"
                type="text"
                label="الاسم الأخير"
                name="lastName"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
                helperText={
                  <Typography color="error">
                    {errors.lastName && touched.lastName && errors.lastName}
                  </Typography>
                }
              />
              <TextField
                required
                id="email"
                type="text"
                label="الايميل"
                name="email"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                helperText={
                  <Typography color="error">
                    {errors.email && touched.email && errors.email}
                  </Typography>
                }
              />
              {!name && (
                <TextField
                  id="password"
                  type="text"
                  label="كلمة المرور"
                  name="password"
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  helperText={
                    <>
                      <Typography color="error">
                        {errors.password && touched.password && errors.password}
                      </Typography>
                    </>
                  }
                />
              )}
              <Button
                catonent="button"
                variant="contained"
                color="secondary"
                startIcon={<CloudUploadIcon sx={{ ml: 2 }} />}
                onChange={(e) => {
                  if (e.target.files[0].size > 1024 * 1024 * 2) {
                    e.target.value = "";
                    setFileError("File size is more then 2MB!");
                  } else {
                    setFileError("");
                    compressImg(e.target.files[0]).then((res) => {
                      setViewImg(res);
                    });
                  }
                }}
              >
                رفع صورة
                <VisuallyHiddenInput type="file" />
              </Button>
              {viewImg && (
                <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
                  <Image src={`${viewImg}`} alt="projImg" width={200} height={200} />
                </Box>
              )}
              {values.phone.map((item, key) => {
                return (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      id={`${item}-${key}`}
                      type="text"
                      label="الهاتف"
                      name="phone"
                      variant="outlined"
                      onChange={(event) => handleFormChange(key, event)}
                      onBlur={handleBlur}
                      value={item.phone}
                      helperText={
                        <Typography color="error">
                          {errors.phone && touched.phone && errors.phone}
                        </Typography>
                      }
                      sx={{ flex: 1 }}
                    />
                    <Box
                      sx={{ cursor: "pointer", padding: "0.5rem" }}
                      onClick={() => removeFields(key)}
                    >
                      <RemoveCircleIcon color="secondary" />
                    </Box>
                  </Box>
                );
              })}
              {!name && (
                <Button
                  sx={{ cursor: "pointer", padding: "0.5rem", alignSelf: "end" }}
                  onClick={addFields}
                  variant="contained"
                  color="secondary"
                >
                  <Typography>إضافة هاتف</Typography>
                  <AddIcCallIcon sx={{ ml: "0.5rem" }} />
                </Button>
              )}
              {name && (
                <PhonesTable
                  phones={user.userPhones || []}
                  userId={user.userId}
                  getDetails={() => getUserDetails()}
                />
              )}
              <LoadingButton loading={updating} color="secondary" variant="contained" type="submit">
                {!name && <Typography>إضافة مستخدم</Typography>}
                {name && <Typography>تعديل المستخدم</Typography>}
              </LoadingButton>
            </Box>
          )}
        </Formik>
      )}
    </Container>
  );
};

export default AddUser;
