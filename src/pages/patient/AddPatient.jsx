import { Box, Button, Container, MenuItem, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useEffect } from "react";
import axiosClient from "../../axios/axiosClient";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNotifications } from "../../contexts/Notifications";
import { useNavigate, useParams } from "react-router";
import { Loading } from "../../components";
import { useLocation } from "react-router";
import PhonesTable from "./PhonesTable";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const AddPatient = () => {
  const schema = Yup.object().shape({
    firstName: Yup.string().required("الاسم الاول مطلوب"),
    lastName: Yup.string().required("الاسم الاخير مطلوب"),
    // phone: Yup.string()
    //   .matches(/[0,9]+([0-9])*/, "الرقم غير صالح")
    //   .min(9, "خطأ بطول الرقم")
    //   .max(10, "خطأ بطول الرقم"),
  });
  const [loading, setLoading] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const { setError, setSuccess } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [patient, setPatient] = React.useState({});
  const { name } = useParams();

  const getPateintDetails = async () => {
    setLoading(true);
    await axiosClient
      .get(`/patient/${location.state.patientId}`)
      .then((res) => {
        if (res.status === 200) {
          setPatient(res.data);
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
    name && getPateintDetails();
  }, []);

  return (
    <Container fixed sx={{ py: "50px", display: "flex", flexDirection: "column", gap: 5 }}>
      {!name && <Typography fontSize={20}>إضافة مريض</Typography>}
      {name && (
        <Typography fontSize={20}>
          تعديل المريض: {patient.firstName} {patient.lastName}
        </Typography>
      )}
      {loading ? (
        <Loading />
      ) : (
        <Formik
          validationSchema={schema}
          initialValues={{
            firstName: patient.firstName,
            lastName: patient.lastName,
            gender: patient.gender,
            birthDay: dayjs(patient.birthDay),
            phone: [],
          }}
          onSubmit={(values) => {
            setUpdating(true);
            if (!name) {
              axiosClient
                .post(`/patient`, {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  gender: values.gender || "Male",
                  birthDay: values.birthDay,
                  phones: values.phone,
                })
                .then((res) => {
                  if (res.status === 200) {
                    setSuccess(res.statusText);
                    setUpdating(false);
                    navigate("/patients");
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
                .put(`/patient/${location.state.patientId}`, {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  gender: values.gender,
                  birthDay: values.birthDay,
                })
                .then((res) => {
                  if (res.status === 200) {
                    setSuccess("Patient Updated Successfuly");
                    setUpdating(false);
                    navigate("/patients");
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
                select
                label="الجنس"
                defaultValue={values.gender || "Male"}
                onChange={(e) => setFieldValue("gender", e.target.value)}
              >
                <MenuItem value="Male">ذكر</MenuItem>
                <MenuItem value="Female">أنثى</MenuItem>
              </TextField>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="تاريخ الميلاد"
                  onChange={(date) => {
                    setFieldValue("birthDay", dayjs(date.format("YYYY-MM-DD")));
                  }}
                  onBlur={handleBlur}
                  value={values.birthDay}
                />
              </LocalizationProvider>
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
                  phones={patient.patientPhones || []}
                  patientId={patient.patientId}
                  getDetails={() => getPateintDetails()}
                />
              )}
              <LoadingButton loading={updating} variant="contained" type="submit">
                {!name && <Typography>إضافة المريض</Typography>}
                {name && <Typography>تعديل المريض</Typography>}
              </LoadingButton>
            </Box>
          )}
        </Formik>
      )}
    </Container>
  );
};

export default AddPatient;
