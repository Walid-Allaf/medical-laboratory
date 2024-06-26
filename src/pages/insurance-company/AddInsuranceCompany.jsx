import {
  Box,
  Button,
  Container,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useEffect } from "react";
import axiosClient from "../../axios/axiosClient";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNotifications } from "../../contexts/Notifications";
import { useLocation, useNavigate, useParams } from "react-router";
import { Loading } from "../../components";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import PhonesTable from "./PhonesTable";

const AddInsuranceCompany = () => {
  const schema = Yup.object().shape({
    name: Yup.string().required("Name required"),
    email: Yup.string().required("Email is required").email("Enter a valid email"),
  });
  const [loading, setLoading] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [insuranceCompany, setInsuranceCompany] = React.useState(false);
  const { setError, setSuccess } = useNotifications();
  const navigate = useNavigate();
  // const { name } = useParams();
  const location = useLocation();
  const name = location.state?.name;

  const getCompanyDetails = async () => {
    setLoading(true);
    await axiosClient
      .get(`/insuranceCompany/${location.state.insuranceCompanyId}`)
      .then((res) => {
        if (res.status === 200) {
          setInsuranceCompany(res.data);
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
    name && getCompanyDetails();
  }, []);

  return (
    <Container fixed sx={{ py: "50px", display: "flex", flexDirection: "column", gap: 3 }}>
      {!name && <Typography fontSize={20}>إضافة شركة تأمين</Typography>}
      {name && <Typography fontSize={20}>تعديل شركة التأمين: {name}</Typography>}
      {loading && name ? (
        <Loading />
      ) : (
        <Formik
          validationSchema={schema}
          initialValues={{
            name: name ? location.state?.name : "",
            email: name ? location.state?.email : "",
            phone: [],
          }}
          onSubmit={(values) => {
            setUpdating(true);
            if (!name) {
              axiosClient
                .post(`/insuranceCompany`, {
                  name: values.name,
                  email: values.email,
                  phones: values.phone,
                })
                .then((res) => {
                  if (res.status === 200) {
                    setSuccess(res.statusText);
                    setUpdating(false);
                    navigate("/insurance-company");
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
                .put(`/insuranceCompany/${location.state.insuranceCompanyId}`, {
                  name: values.name,
                  email: values.email,
                  phones: values.phone,
                })
                .then((res) => {
                  if (res.status === 200) {
                    setSuccess("Insurance Company Updated Successfuly");
                    setUpdating(false);
                    navigate("/insurance-company");
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
                id="name"
                type="text"
                label="الاسم الشركة"
                name="name"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                helperText={
                  <Typography color="error">
                    {errors.name && touched.name && errors.name}
                  </Typography>
                }
              />
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
                  phones={insuranceCompany.insuranceCompanyPhones || []}
                  insuranceCompanyId={insuranceCompany.insuranceCompanyId}
                  getDetails={() => getCompanyDetails()}
                />
              )}
              <LoadingButton loading={updating} color="secondary" variant="contained" type="submit">
                {!name && <Typography>إضافة شركة التأمين</Typography>}
                {name && <Typography>تعديل شركة التأمين</Typography>}
              </LoadingButton>
            </Box>
          )}
        </Formik>
      )}
    </Container>
  );
};
export default AddInsuranceCompany;
