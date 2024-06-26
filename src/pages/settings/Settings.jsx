import React from "react";
import axiosClient from "../../axios/axiosClient";
import { TextField, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { Loading } from "../../components";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNotifications } from "../../contexts/Notifications";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router";

const Settings = () => {
  const schema = Yup.object().shape({
    hospitalName: Yup.string().required("Hospital name required"),
    labName: Yup.string().required("Laboratory name required"),
    address: Yup.string().required("Address required"),
    manageName: Yup.string().required("Manager Name required"),
    priceOfUnit: Yup.string().required("Price Of Unit required"),
    // phone: Yup.string()
    //   .matches(
    //     /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    //     "Number not valid"
    //   )
    //   .min(9, "Incorrect number length")
    //   .max(10, "Incorrect number length")
    //   .required("Phone required"),
  });
  const [laboratory, setLaboratory] = React.useState([]);
  const [updating, setUpdating] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const { setError, setSuccess } = useNotifications();
  const navigate = useNavigate();

  const UpdateLaboratory = () => {
    axiosClient
      .post(`/LaboratoryConstant`, {
        lc_id: 1,
        labName: null,
        logoImage: null,
        address: null,
        hospitalName: null,
        email: "laboratory@gmail.com",
        priceOfUnit: null,
        mangarName: null,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  React.useEffect(() => {
    axiosClient
      .get(`/LaboratoryConstant`)
      .then((res) => {
        console.log(res.data);
        setLaboratory(res.data[0]);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container fixed sx={{ py: "50px", display: "flex", flexDirection: "column", gap: 5 }}>
      <Typography fontSize={20}>الإعدادات</Typography>

      {loading ? (
        <Loading />
      ) : (
        <Formik
          validationSchema={schema}
          initialValues={{
            hospitalName: laboratory.hospitalName,
            labName: laboratory.labName,
            address: laboratory.address,
            email: laboratory.email,
            logo: laboratory.logoImage,
            manageName: laboratory.mangarName,
            phone: "0930202105 - 2631630 - 2631640",
            priceOfUnit: laboratory.priceOfUnit,
          }}
          onSubmit={(values) => {
            setUpdating(true);
            axiosClient
              .put(`/LaboratoryConstant/1`, {
                hospitalName: values.hospitalName,
                labName: values.labName,
                address: values.address,
                email: values.email,
                logoImage: values.logo,
                mangarName: values.manageName,
                phones: values.phone,
                priceOfUnit: values.priceOfUnit,
              })
              .then((res) => {
                if (res.status === 200) {
                  setSuccess("تم حفظ التعديلات");
                  setUpdating(false);
                  // navigate("/users");
                  console.log(res);
                }
              })
              .catch((err) => {
                setError(err.message);
                setUpdating(false);
                console.log(err);
              });
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <TextField
                required
                id="hospitalName"
                type="text"
                label="اسم المشفى"
                name="hospitalName"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.hospitalName}
                helperText={
                  <Typography color="error">
                    {errors.hospitalName && touched.hospitalName && errors.hospitalName}
                  </Typography>
                }
              />
              <TextField
                required
                id="labName"
                type="text"
                label="اسم المخبر"
                name="labName"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.labName}
                helperText={
                  <Typography color="error">
                    {errors.labName && touched.labName && errors.labName}
                  </Typography>
                }
              />
              <TextField
                required
                id="address"
                type="text"
                label="العنوان"
                name="address"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
                helperText={
                  <Typography color="error">
                    {errors.address && touched.address && errors.address}
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
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <TextField
                  sx={{ flex: 1 }}
                  required
                  id="manageName"
                  type="text"
                  label="اسم المدير"
                  name="manageName"
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.manageName}
                  helperText={
                    <Typography color="error">
                      {errors.manageName && touched.manageName && errors.manageName}
                    </Typography>
                  }
                />
                <TextField
                  sx={{ flex: 1 }}
                  required
                  id="priceOfUnit"
                  type="number"
                  label="سعر الوحدة"
                  name="priceOfUnit"
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.priceOfUnit}
                  helperText={
                    <Typography color="error">
                      {errors.priceOfUnit && touched.priceOfUnit && errors.priceOfUnit}
                    </Typography>
                  }
                />
              </Box>
              <TextField
                required
                id="phone"
                type="text"
                label="رقم الهاتف"
                name="phone"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
                helperText={
                  <Typography color="error">
                    {errors.phone && touched.phone && errors.phone}
                  </Typography>
                }
              />
              <LoadingButton loading={updating} color="secondary" variant="contained" type="submit">
                <Typography>حفظ التعديلات</Typography>
              </LoadingButton>
            </Box>
          )}
        </Formik>
      )}
    </Container>
  );
};

export default Settings;
