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
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { blue } from "@mui/material/colors";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { Formik } from "formik";
import * as Yup from "yup";
import axiosClient from "../../../axios/axiosClient";
import { useNotifications } from "../../../contexts/Notifications";
import { useNavigate, useParams } from "react-router";
import { Loading } from "../../../components";
const AddUpdateAnalysis = (props) => {
  const { onClose, value, open, isAdd } = props;

  const [loadingCategory, setLoadingCategory] = React.useState(false);
  const [loadingGroup, setLoadingGroup] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [groups, setGroups] = React.useState([]);

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

  const getCategories = async () => {
    setLoadingCategory(true);
    await axiosClient
      .get("/category")
      .then((res) => {
        if (res.status === 200) {
          setCategories(res.data);
          setLoadingCategory(false);
          console.log(res);
        }
      })
      .catch((err) => {
        setLoadingCategory(false);
        setError(err.message);
      });
  };

  const getGroups = async () => {
    setLoadingGroup(true);
    await axiosClient
      .get("/group")
      .then((res) => {
        if (res.status === 200) {
          setGroups(res.data);
          setLoadingGroup(false);
          console.log(res);
        }
      })
      .catch((err) => {
        setLoadingGroup(false);
        setError(err.message);
      });
  };

  React.useEffect(() => {
    getCategories();
    getGroups();
  }, []);
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{isAdd ? "إضافة تحليل" : "تعديل تحليل"}</DialogTitle>
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
            initialValues={{
              name: value.name,
              nUnits: value.nUint,
              category: value.categoryId,
              group: value.groupId,
            }}
            onSubmit={(values) => {
              console.log(values);
              if (isAdd) {
                axiosClient
                  .post(`/analyse`, {
                    name: values.name,
                    nUint: values.nUnits,
                    categoryId: values.category,
                    groupId: values.group,
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
                    console.log(err);
                  });
              } else {
                axiosClient
                  .put(`/analyse/${value.analyseId}`, {
                    name: values.name,
                    nUint: values.nUnits,
                    categoryId: values.category,
                    groupId: values.group,
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
                  label="اسم التحليل"
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
                  id="nUnits"
                  type="number"
                  label="عدد الوحدات"
                  name="nUnits"
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.nUnits}
                  helperText={
                    <Typography color="error">
                      {errors.nUnits && touched.nUnits && errors.nUnits}
                    </Typography>
                  }
                />
                <FormControl sx={{ width: "100%" }} variant="outlined">
                  <InputLabel id="category">الفئة</InputLabel>
                  <Select
                    error={errors.category && touched.category && errors.category ? true : false}
                    id="category"
                    name="category"
                    label="الفئة"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.category}
                    sx={{ background: "#fff" }}
                  >
                    {loadingCategory ? (
                      <MenuItem disabled>جاري التحميل...</MenuItem>
                    ) : (
                      categories.map((item) => {
                        const { categoryName, categoryId } = item;
                        return (
                          <MenuItem key={categoryId} value={categoryId}>
                            {categoryName}
                          </MenuItem>
                        );
                      })
                    )}
                  </Select>
                </FormControl>
                <FormControl sx={{ width: "100%" }} variant="outlined">
                  <InputLabel id="group">المجموعة</InputLabel>
                  <Select
                    error={errors.group && touched.group && errors.group ? true : false}
                    id="group"
                    name="group"
                    label="المجموعة"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.group}
                    sx={{ background: "#fff" }}
                  >
                    {loadingGroup ? (
                      <MenuItem disabled>جاري التحميل...</MenuItem>
                    ) : (
                      groups.map((item) => {
                        const { groupName, groupId } = item;
                        return (
                          <MenuItem key={groupId} value={groupId}>
                            {groupName}
                          </MenuItem>
                        );
                      })
                    )}
                  </Select>
                </FormControl>
                <LoadingButton
                  loading={loading}
                  color="secondary"
                  variant="contained"
                  type="submit"
                >
                  {isAdd && <Typography>إضافة تحليل</Typography>}
                  {!isAdd && <Typography>تعديل تحليل</Typography>}
                </LoadingButton>
              </Box>
            )}
          </Formik>
        )}
      </Container>
    </Dialog>
  );
};

AddUpdateAnalysis.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
  isAdd: PropTypes.bool.isRequired,
};

export default AddUpdateAnalysis;
