import React from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, TextField, Box, Typography, Container } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import { useNotifications } from "../../contexts/Notifications";
import { Loading } from "../../components";
import axiosClient from "../../axios/axiosClient";

const AddPhone = (props) => {
  const { onClose, value, open, isAdd } = props;
  const schema = Yup.object().shape({
    name: Yup.string().required("الاسم مطلوب"),
  });
  const { setError, setSuccess } = useNotifications();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{isAdd ? "إضافة رقم" : "تعديل رقم"}</DialogTitle>
      <Container
        sx={{
          py: "30px",
          display: "flex",
          flexDirection: "column",
          gap: 5,
          minWidth: "500px",
        }}
      >
        {false ? (
          <Loading />
        ) : (
          <Formik
            validationSchema={schema}
            initialValues={{ name: value?.phone }}
            onSubmit={(values) => {
              if (isAdd) {
                axiosClient
                  .post(`/doctorPhone`, {
                    doctorId: value.doctorId,
                    phone: values.name,
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      setSuccess(res.statusText);
                      handleClose();
                      console.log(res);
                    }
                  })
                  .catch((err) => {
                    setError(err.message);
                    handleClose();
                  });
              } else {
                axiosClient
                  .put(`/doctorPhone/${value.doctorPhoneId}`, {
                    doctorId: value.doctorId,
                    phone: values.name,
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      setSuccess(res.statusText);
                      handleClose();
                      console.log(res);
                    }
                  })
                  .catch((err) => {
                    setError(err.message);
                    handleClose();
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
                  label="الرقم"
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
                <LoadingButton
                  loading={loading}
                  color="secondary"
                  variant="contained"
                  type="submit"
                >
                  {isAdd && <Typography>إضافة رقم</Typography>}
                  {!isAdd && <Typography>تعديل رقم</Typography>}
                </LoadingButton>
              </Box>
            )}
          </Formik>
        )}
      </Container>
    </Dialog>
  );
};

AddPhone.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
  isAdd: PropTypes.bool.isRequired,
};

export default AddPhone;
