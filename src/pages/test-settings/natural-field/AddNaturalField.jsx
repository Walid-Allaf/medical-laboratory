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
  InputLabel,
  Select,
  MenuItem,
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

const AddNaturalField = (props) => {
  const { onClose, value, open, isAdd } = props;
  const schema = Yup.object().shape({
    analyses: Yup.string().required("التحليل مطلوب"),
    minimum: Yup.string().required("الحد الأدنى مطلوب"),
    maximum: Yup.string().required("الحد الأعلى مطلوب"),
  });
  const { setError, setSuccess } = useNotifications();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const [loadingAnalyses, setLoadingAnalyses] = React.useState(false);
  const [analyses, setAnalyses] = React.useState([]);

  const handleClose = () => {
    onClose(value);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const getAnalyses = async () => {
    setLoadingAnalyses(true);
    await axiosClient
      .get("/analyse")
      .then((res) => {
        if (res.status === 200) {
          setAnalyses(res.data);
          setLoadingAnalyses(false);
          console.log(res);
        }
      })
      .catch((err) => {
        setLoadingAnalyses(false);
        setError(err.message);
      });
  };

  React.useEffect(() => {
    getAnalyses();
    console.log(value);
  }, [value]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{isAdd ? "إضافة مجال طبيعي" : "تعديل مجال طبيعي"}</DialogTitle>
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
              analyses: value.analyseId,
              minimum: value.min,
              maximum: value.max,
              gender: value.gender,
            }}
            onSubmit={(values) => {
              setLoading(true);
              if (isAdd) {
                console.log("add", values);
                axiosClient
                  .post(`/naturalField`, {
                    analyseId: values.analyses,
                    min: values.minimum,
                    max: values.maximum,
                    gender: values.gender,
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      setSuccess(res.statusText);
                      setLoading(false);
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
                console.log("put", values);
                axiosClient
                  .put(`/naturalField/${value.naturalFieldId}`, {
                    analyseId: values.analyses,
                    min: values.minimum,
                    max: values.maximum,
                    gender: values.gender,
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      setSuccess("تم التعديل بنجاح");
                      handleClose();
                      setLoading(false);
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
                <FormControl sx={{ width: "100%" }} variant="outlined">
                  <InputLabel id="analyses">التحليل</InputLabel>
                  <Select
                    error={errors.analyses && touched.analyses && errors.analyses ? true : false}
                    id="analyses"
                    name="analyses"
                    label="التحليل"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.analyses}
                    sx={{ background: "#fff" }}
                  >
                    {loadingAnalyses ? (
                      <MenuItem disabled>جاري التحميل...</MenuItem>
                    ) : (
                      analyses.map((item) => {
                        const { name, analyseId } = item;
                        return (
                          <MenuItem key={analyseId} value={analyseId}>
                            {name}
                          </MenuItem>
                        );
                      })
                    )}
                  </Select>
                </FormControl>
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
                  <MenuItem value="Child">طفل</MenuItem>
                </TextField>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    "& > div": { flexGrow: 1 },
                  }}
                >
                  <TextField
                    required
                    id="minimum"
                    type="text"
                    label="الحد الأدنى"
                    name="minimum"
                    variant="outlined"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.minimum}
                    helperText={
                      <Typography color="error">
                        {errors.minimum && touched.minimum && errors.minimum}
                      </Typography>
                    }
                  />
                  <TextField
                    required
                    id="maximum"
                    type="text"
                    label="الحد الأعلى"
                    name="maximum"
                    variant="outlined"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.maximum}
                    helperText={
                      <Typography color="error">
                        {errors.maximum && touched.maximum && errors.maximum}
                      </Typography>
                    }
                  />
                </Box>
                <LoadingButton
                  loading={loading}
                  color="secondary"
                  variant="contained"
                  type="submit"
                >
                  {isAdd && <Typography>إضافة مجال طبيعي</Typography>}
                  {!isAdd && <Typography>تعديل مجال طبيعي</Typography>}
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

AddNaturalField.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
  isAdd: PropTypes.bool.isRequired,
};

export default AddNaturalField;
