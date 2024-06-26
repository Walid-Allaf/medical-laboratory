import {
  Box,
  Button,
  Container,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useEffect } from "react";
import axiosClient from "../../axios/axiosClient";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNotifications } from "../../contexts/Notifications";
import { useNavigate, useParams } from "react-router";
import { Loading } from "../../components";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import PhonesTable from "./PhonesTable";

const AddDoctor = () => {
  const schema = Yup.object().shape({
    firstName: Yup.string().required("First name required"),
    lastName: Yup.string().required("Last name required"),
    email: Yup.string().required("Email is required").email("Enter a valid email"),

    // phone: Yup.string()
    //   .matches(
    //     /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    //     "Number not valid"
    //   )
    //   .min(9, "Incorrect number length")
    //   .max(10, "Incorrect number length"),
  });
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);
  const { setError, setSuccess } = useNotifications();
  const navigate = useNavigate();
  const [doctor, setDoctor] = React.useState({});
  const { id } = useParams();

  const getDoctorDetail = () => {
    axiosClient
      .get(`/doctor/${id}`)
      .then(({ data }) => {
        setDoctor({ ...data });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    id && getDoctorDetail();
  }, []);

  return (
    <Container fixed sx={{ py: "50px", display: "flex", flexDirection: "column", gap: 3 }}>
      {!id && <Typography fontSize={20}>إضافة طبيب</Typography>}
      {id && (
        <Typography fontSize={20}>
          تعديل الطبيب: {doctor.firstName} {doctor.lastName}
        </Typography>
      )}
      {loading && id ? (
        <Loading />
      ) : (
        <Formik
          validationSchema={schema}
          initialValues={{
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            gender: doctor.gender || "Male",
            email: doctor.email,
            Specialization: doctor.specialization || "قلبية",
            phone: [],
          }}
          onSubmit={(values) => {
            setUpdating(true);
            if (!id) {
              axiosClient
                .post(`/doctor`, {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  gender: values.gender,
                  email: values.email,
                  Specialization: values.Specialization,
                  phones: values.phone,
                })
                .then((res) => {
                  if (res.status === 200) {
                    setSuccess(res.statusText);
                    setUpdating(false);
                    navigate("/doctors");
                  }
                })
                .catch((err) => {
                  setError(err.message);
                  setUpdating(false);
                });
            } else {
              axiosClient
                .put(`/doctor/${id}`, {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  gender: values.gender,
                  email: values.email,
                  Specialization: values.Specialization,
                })
                .then((res) => {
                  if (res.status === 200) {
                    setSuccess("تم التعديل بنجاح");
                    setUpdating(false);
                    navigate("/doctors");
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
              console.log(values.phone);
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
                id="gender"
                name="gender"
                select
                label="الجنس"
                defaultValue={values.gender || "Male"}
                onChange={(e) => setFieldValue("gender", e.target.value)}
              >
                <MenuItem value="Male">ذكر</MenuItem>
                <MenuItem value="Female">أنثى</MenuItem>
              </TextField>
              <TextField
                required
                id="email"
                type="email"
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
              <TextField
                id="specialization"
                select
                label="الإختصاص"
                defaultValue={values.Specialization || "قلبية"}
                onChange={(e) => setFieldValue("Specialization", e.target.value)}
              >
                <MenuItem value="قلبية">قلبية</MenuItem>
                <MenuItem value="داخلية">داخلية</MenuItem>
                <MenuItem value="هضمية">هضمية</MenuItem>
                <MenuItem value="كلية">كلية</MenuItem>
              </TextField>

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
              {!id && (
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
              {id && (
                <PhonesTable
                  phones={doctor.doctorPhones || []}
                  doctorId={doctor.doctorId}
                  getDetails={() => getDoctorDetail()}
                />
              )}
              <LoadingButton loading={updating} color="primary" variant="contained" type="submit">
                {!id && <Typography>إضافة طبيب</Typography>}
                {id && <Typography>تعديل الطبيب</Typography>}
              </LoadingButton>
            </Box>
          )}
        </Formik>
      )}
    </Container>
  );
};

export default AddDoctor;
