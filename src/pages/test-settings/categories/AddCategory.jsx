import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { blue } from "@mui/material/colors";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { Loading } from "../../../components";
import { Formik } from "formik";
import * as Yup from "yup";
import axiosClient from "../../../axios/axiosClient";
import { useNotifications } from "../../../contexts/Notifications";
import { useNavigate, useParams } from "react-router";

const AddCategory = (props) => {
  const { onClose, value, open, isAdd } = props;
  const schema = Yup.object().shape({
    name: Yup.string().required("الاسم مطلوب"),
  });
  const { setError, setSuccess } = useNotifications();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    onClose(value);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{isAdd === "" ? "إضافة فئة" : "تعديل فئة"}</DialogTitle>
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
            initialValues={{ name: value }}
            onSubmit={(values) => {
              // setLoading(true);
              if (isAdd === "") {
                axiosClient
                  .post(`/category`, { categoryName: values.name })
                  .then((res) => {
                    if (res.status === 200) {
                      setSuccess(res.statusText);
                      // setLoading(false);
                      handleClose();
                      console.log(res);
                    }
                  })
                  .catch((err) => {
                    setError(err.message);
                    // setLoading(false);
                    console.log(err);
                  });
              } else {
                console.log(values);
                axiosClient
                  .put(`/category/${isAdd}`, { categoryName: values.name })
                  .then((res) => {
                    if (res.status === 200) {
                      setSuccess("Category Updated Successfuly");
                      handleClose();
                      // setLoading(false);
                    }
                  })
                  .catch((err) => {
                    setError(err.message);
                    // setLoading(false);
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
                  label="اسم الفئة"
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
                  {isAdd === "" && <Typography>إضافة فئة</Typography>}
                  {isAdd !== "" && <Typography>تعديل فئة</Typography>}
                </LoadingButton>
              </Box>
            )}
          </Formik>
        )}
      </Container>
      {/* <List sx={{ pt: 0 }}>
        {emails.map((email) => (
          <ListItem disableGutters key={email}>
            <ListItemButton onClick={() => handleListItemClick(email)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={email} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("addAccount")}
          >
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItemButton>
        </ListItem>
      </List> */}
    </Dialog>
  );
};

AddCategory.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
  isAdd: PropTypes.string.isRequired,
};

export default AddCategory;

// add name field for category name in dialog
// logic for post and put
