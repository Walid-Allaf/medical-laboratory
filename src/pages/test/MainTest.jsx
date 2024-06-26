import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../axios/axiosClient";
import Loading from "../../components/Loading";
import { useNotifications } from "../../contexts/Notifications";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

const schema = Yup.object().shape({
  // patient: Yup.string().required("مطلوب"),
  // doctor: Yup.string().required("مطلوب"),
  // ic: Yup.string().required("مطلوب"),
  discount: Yup.number().min(0, "لايمكن ان يكون سالب").max(100, "لايمكن ان يكون اكبر من 100"),
});

const MainTest = () => {
  const [adding, setAdding] = React.useState(false);
  const [loadingPatients, setLoadingPatients] = React.useState(false);
  const [loadingDoctors, setLoadingDoctors] = React.useState(false);
  const [loadingInsuranceCompanies, setLoadingInsuranceCompanies] = React.useState(false);
  const [loadingCategory, setLoadingCategory] = React.useState(false);
  const [patients, setPatients] = React.useState([]);
  const [doctors, setDoctors] = React.useState([]);
  const [insuranceCompanies, setInsuranceCompanies] = React.useState([]);
  const [analysisByCategory, setAnalysisByCategory] = React.useState([]);
  const [analysis, setAnalysis] = React.useState([]);
  const [expanded, setExpanded] = React.useState(null);
  const { setError } = useNotifications();
  const navigate = useNavigate();
  const handleChangeAccordion = (id) => (_, isExpanded) => {
    // if expanded, set id to open/expand, close it otherwise
    setExpanded(isExpanded ? id : null);
  };

  const getAllData = async () => {
    setLoadingPatients(true);
    await axiosClient
      .get("/GetBigData/GetAllDoctorsAndPatientsAndInsuranceCompanies")
      .then((res) => {
        if (res.status === 200) {
          setPatients(res.data.patiens);
          setDoctors(res.data.doctors);
          setInsuranceCompanies(res.data.insuranceCompanys);
          setLoadingCategory(false);
          setLoadingPatients(false);
          setLoadingDoctors(false);
        }
      })
      .catch((err) => {
        setLoadingPatients(false);
        setError(err.message);
      });
  };

  const getCategories = async () => {
    setLoadingCategory(true);
    await axiosClient
      .get("/Category/WithAnalyses")
      .then((res) => {
        if (res.status === 200) {
          setAnalysisByCategory(res.data);
          setLoadingCategory(false);
        }
      })
      .catch((err) => {
        setLoadingCategory(false);
        setError(err.message);
      });
  };

  React.useEffect(() => {
    getCategories();
    getAllData();
  }, []);
  return (
    <Container fixed sx={{ py: "50px", display: "flex", flexDirection: "column", gap: 5 }}>
      <Formik
        validationSchema={schema}
        initialValues={{ patient: "", doctor: "", ic: null, discount: 0 }}
        onSubmit={async (values) => {
          console.log(values);
          setAdding(true);
          await axiosClient
            .post("/test", {
              patientId: values.patient,
              doctorId: values.doctor,
              userId: JSON.parse(sessionStorage.getItem("ai-lab-user")).userId,
              insuranceCompanyId: values.ic !== null ? values.ic.id : null,
              discount: values.discount,
              testDate: dayjs().add(2, "hour"),
              testDetailes: analysis,
            })
            .then((res) => {
              if (res.status === 200) {
                setAdding(false);
                navigate("/registers");
              }
            })
            .catch((err) => {
              setAdding(false);
              setError(err.message);
            });
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
          <Box
            component="form"
            sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <Box>
              <Autocomplete
                disablePortal
                freeSolo
                name="patient"
                options={patients.map((option) => ({
                  id: option.patientId,
                  label: option.firstName + " " + option.lastName,
                }))}
                onChange={(event, value) => setFieldValue("patient", value.id)}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="المريض" />}
              />
              <Typography color="error">
                {errors.patient && touched.patient && errors.patient}
              </Typography>
            </Box>

            <Box>
              <Autocomplete
                disablePortal
                freeSolo
                name="doctor"
                options={doctors.map((option) => ({
                  id: option.doctorId,
                  label: option.firstName + " " + option.lastName,
                }))}
                onChange={(event, value) => setFieldValue("doctor", value.id)}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="الطبيب" />}
              />
              <Typography color="error">
                {errors.doctor && touched.doctor && errors.doctor}
              </Typography>
            </Box>

            <Box>
              <Autocomplete
                disablePortal
                freeSolo
                name="ic"
                options={insuranceCompanies.map((option) => ({
                  id: option.icategoryId,
                  label: option.name,
                }))}
                onChange={(event, value) => setFieldValue("ic", value)}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="شركات التأمين" />}
              />
              {/* <Typography color="error">{errors.ic && touched.ic && errors.ic}</Typography> */}
            </Box>

            {values.ic !== null && (
              <TextField
                required
                id="discount"
                type="number"
                label="نسبة التخفيض"
                name="discount"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.discount}
                helperText={
                  <Typography color="error" textAlign="start">
                    {errors.discount && touched.discount && errors.discount}
                  </Typography>
                }
              />
            )}

            <Box sx={{ minWidth: "100%" }}>
              {loadingCategory ? (
                <Loading />
              ) : (
                analysisByCategory.map((analyses, index) => (
                  <Accordion
                    expanded={expanded === analyses.categoryId}
                    onChange={handleChangeAccordion(analyses.categoryId)}
                    key={index}
                    sx={{ direction: "ltr" }}
                  >
                    <AccordionSummary>{analyses.categoryName}</AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      {analyses.analyses.map((el, index) => (
                        <FormControlLabel
                          key={index}
                          name="analysis"
                          control={<Checkbox sx={{ display: "none" }} name={el.name} />}
                          label={el.name}
                          sx={{
                            userSelect: "none",
                            "& span": {
                              fontSize: { xs: "12px", sm: "20px" },
                              border: "1px solid",
                              borderRadius: "25px",
                              color: "#FFF",
                              backgroundColor:
                                analysis.filter((ele) => ele.analyseId === el.analyseId).length !==
                                0
                                  ? "#9c27b0"
                                  : "#aaa",
                              px: 1.5,
                              py: 0.75,
                            },
                          }}
                          onChange={(e) => {
                            if (!e.target.checked) {
                              setAnalysis((old) =>
                                old.filter((ele) => ele.analyseId !== el.analyseId)
                              );
                            } else {
                              setAnalysis([...analysis, { analyseId: el.analyseId }]);
                            }
                            console.log(analysis);
                          }}
                        />
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </Box>
            {/* <LoadingButton loading={adding} color="secondary" variant="contained">
              <Typography>إدخال النتائج</Typography>
            </LoadingButton> */}
            <LoadingButton
              sx={{ width: "100%" }}
              loading={adding}
              color="primary"
              variant="contained"
              type="submit"
            >
              <Typography>حفظ</Typography>
            </LoadingButton>
          </Box>
        )}
      </Formik>
    </Container>
  );
};

export default MainTest;
