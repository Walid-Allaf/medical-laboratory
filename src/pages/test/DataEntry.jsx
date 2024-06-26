import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  ImageListItem,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useNotifications } from "../../contexts/Notifications";
import axiosClient from "../../axios/axiosClient";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { Heart, Kidney, Pancreas } from "../../assets";
import { Loading, PatientReport } from "../../components";
import SaveIcon from "@mui/icons-material/Save";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DeleteIcon from "@mui/icons-material/Delete";
import AddchartIcon from "@mui/icons-material/Addchart";

export const Boxes = [
  {
    title: "Heart Attack",
    analyse: ["troponin", "glucose"],
    path: "/",
    code: "heart-attack",
    img: Heart,
  },
  {
    title: "Kidney Failure",
    analyse: ["creatinine", "potassium", "hemoglobin", "urea"],
    path: "/",
    code: "ckd",
    img: Kidney,
  },
  {
    title: "Diabetes",
    analyse: ["glucose", "hba1c"],
    path: "/",
    code: "diabetes",
    img: Pancreas,
  },
];
const BoxStyles = {
  borderRadius: "10px",
  background: "linear-gradient(50deg, #ffffff90 0%, transparent 40%, #ffffff90)",
  padding: "15px",
  cursor: "pointer",
  textAlign: "center",
  userSelect: "none",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
};

const DataEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setError, setSuccess } = useNotifications();
  const [analysisByTest, setAnalysisByTest] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [analysisByCategory, setAnalysisByCategory] = React.useState([]);
  const [newAnalyses, setNewAnalyses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openReport, setOpenReport] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [loadingCategory, setLoadingCategory] = React.useState(true);
  const getAnalysis4Test = async () => {
    setLoading(true);
    await axiosClient
      .get(`/Test/GetTestWithGroupByCategory/${location.state.testId}`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
          setAnalysisByTest(res.data.groupedTestDetails);
          setLoading(false);
          console.log(res.data.testId);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };
  const updateAnalysis = async () => {
    analysisByTest.map(async (cat) => {
      await cat.details.map(async (item) => {
        if (item.updated) {
          await axiosClient
            .put(`/testDetail/${item.testDetailId}`, {
              testId: location.state.testId,
              analyseId: item.analyseId,
              result: item.result,
            })
            .then((res) => {
              console.log("Analyse Update");
            })
            .catch((err) => {
              setError("حدث خطأ أثناء الحفظ");
            });
        }
      });
    });
    setUpdating(false);
    setSuccess("تم الحفظ");
  };
  const addAnalysis = async () => {
    setOpenAdd(true);
    setLoadingCategory(true);
    await axiosClient
      .get(`/Test/${location.state.testId}/unused-analyses`)
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
  const deleteAnalysis = async () => {
    setOpenDelete(true);
    setLoadingCategory(true);
    await axiosClient
      .get(`/Test/${location.state.testId}/used-analyses`)
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
    getAnalysis4Test();
  }, []);

  const [expanded, setExpanded] = React.useState(null);
  const [analysis, setAnalysis] = React.useState([]);
  const handleChangeAccordion = (id) => (_, isExpanded) => {
    // if expanded, set id to open/expand, close it otherwise
    setExpanded(isExpanded ? id : null);
  };

  return (
    <Container
      fixed
      sx={{
        py: "50px",
        display: "flex",
        flexDirection: "column",
        gap: 5,
        minHeight: "95vh",
        justifyContent: "space-between",
      }}
    >
      {loading ? (
        <Typography>جاري التحميل...</Typography>
      ) : (
        <Grid container spacing={2}>
          {analysisByTest.length > 0 ? (
            analysisByTest.map((el, i) => {
              const { categoryName, details } = el;
              return (
                <Grid
                  item
                  xs={12}
                  key={i}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    direction: "ltr",
                  }}
                >
                  <Typography sx={{ alignSelf: "flex-end" }}>{categoryName}</Typography>
                  <Box>
                    {details.map((ele) => {
                      const { analyseId, analyseName, nUint, result } = ele;
                      return (
                        <Box sx={{ width: "100%" }}>
                          <Typography>{analyseName}</Typography>
                          <TextField
                            disabled={location.state.disable == true ? true : false}
                            required
                            value={result}
                            sx={{
                              width: "100%",
                              "& *": { fontWeight: 700 },
                            }}
                            type="text"
                            name={analyseName}
                            variant="outlined"
                            onChange={(e) =>
                              setAnalysisByTest(() =>
                                analysisByTest.map((cat) => {
                                  cat.details.map((item) => {
                                    if (item.analyseId === analyseId) {
                                      item.result = e.target.value;
                                      item.updated = true;
                                      console.log(item.result);
                                    }
                                  });
                                  return cat;
                                })
                              )
                            }
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Grid>
              );
            })
          ) : (
            <Box sx={{ display: "grid", placeItems: "center", height: "50vh", width: "100%" }}>
              <Typography variant="h5">لايوجد تحاليل</Typography>
            </Box>
          )}
        </Grid>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 2, "& button": { flex: 1 } }}>
          <LoadingButton
            variant="contained"
            color="secondary"
            loading={adding}
            onClick={addAnalysis}
            disabled={location.state.disable == true ? true : false}
          >
            إضافة تحليل
            <AddchartIcon sx={{ mr: 2 }} />
          </LoadingButton>
          <LoadingButton
            variant="contained"
            color="error"
            loading={deleting}
            onClick={deleteAnalysis}
            disabled={location.state.disable == true ? true : false}
          >
            حذف تحليل
            <DeleteIcon sx={{ mr: 2 }} />
          </LoadingButton>
        </Box>
        <Box sx={{ display: "flex", gap: 2, "& button": { flex: 1 } }}>
          <LoadingButton
            variant="contained"
            color="primary"
            loading={updating}
            onClick={updateAnalysis}
          >
            حفظ
            <SaveIcon sx={{ mr: 2 }} />
          </LoadingButton>
          <LoadingButton
            variant="contained"
            color="primary"
            loading={updating}
            onClick={() => {
              updateAnalysis();
              setOpenReport(true);
            }}
          >
            حفظ وطباعة
            <PictureAsPdfIcon sx={{ mr: 2 }} />
            <Typography sx={{ fontSize: "24px" }}> / </Typography>
            <LocalPrintshopIcon />
          </LoadingButton>
        </Box>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            updateAnalysis();
            setOpen(true);
          }}
        >
          التشخيص بمساعدة الذكاء الصنعي
          <AutoAwesomeIcon sx={{ mr: 2 }} />
        </Button>
      </Box>

      <Dialog maxWidth={"lg"} open={open} onClose={() => setOpen(false)}>
        <Box sx={{ backgroundColor: "secondary.main" }}>
          <IconButton
            sx={{ width: "max-content" }}
            variant="contained"
            onClick={() => setOpen(false)}
          >
            <CloseIcon fontSize="large" color="#fff" />
          </IconButton>
        </Box>
        <DialogTitle>اختر المرض المطلوب</DialogTitle>
        <Box sx={{ display: "flex", gap: 3, p: 4 }}>
          {Boxes.map((item, key) => {
            const { title, analyse, code, img } = item;
            let valid = false;
            let count = 0;
            analysisByTest.map((cat) => {
              cat.details.map((item) => {
                if (analyse.includes(item.analyseName.toLowerCase())) {
                  count++;
                }
              });
              if (analyse.length === count) {
                valid = true;
              }
            });
            return (
              <Box
                key={key}
                sx={{ userSelect: valid ? "" : "none" }}
                onClick={() => {
                  navigate(valid ? `/ai?disease=${code}` : "", {
                    state: data,
                  });
                }}
              >
                <Box
                  sx={{
                    borderRadius: "10px",
                    background: "linear-gradient(50deg, #ffffff90 0%, transparent 40%, #ffffff90)",
                    padding: "15px",
                    cursor: valid ? "pointer" : "initial",
                    textAlign: "center",
                    userSelect: "none",
                    boxShadow:
                      "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
                    border: "3px solid",
                    borderColor: valid ? "success.main" : "#eee",
                  }}
                >
                  <ImageListItem
                    sx={{
                      width: "18rem",
                      minHeight: "18rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      filter: valid ? "opacity(1)" : "opacity(0.2)",
                    }}
                  >
                    <img src={img} alt={title} />
                  </ImageListItem>
                  <Typography
                    color={valid ? "success.main" : "#ccc"}
                    sx={{ fontWeight: 700, fontSize: 18 }}
                  >
                    {title}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Dialog>
      <Dialog maxWidth={"lg"} open={openReport} onClose={() => setOpenReport(false)}>
        <Box sx={{ backgroundColor: "secondary.main" }}>
          <IconButton
            sx={{ width: "max-content" }}
            variant="contained"
            onClick={() => setOpenReport(false)}
          >
            <CloseIcon fontSize="large" color="#fff" />
          </IconButton>
          <PatientReport testId={location.state.testId} />
        </Box>
      </Dialog>
      <Dialog maxWidth={"lg"} open={openAdd} onClose={() => setOpenAdd(false)}>
        <Box sx={{ backgroundColor: "secondary.main" }}>
          <IconButton
            sx={{ width: "max-content" }}
            variant="contained"
            onClick={() => setOpenAdd(false)}
          >
            <CloseIcon fontSize="large" color="#fff" />
          </IconButton>
          <Box sx={{ width: 500, minHeight: 450, p: 2 }}>
            <Typography mb={2}>إضافة تحليل</Typography>
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
                          }}
                        />
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </Box>
          </Box>
        </Box>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            sx={{ ml: 2 }}
            onClick={() => {
              setOpenAdd(false);
              setAnalysis([]);
            }}
          >
            إلغاء
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (analysis.length > 0) {
                analysis.map(async (el) => {
                  await axiosClient
                    .post(`/testDetail`, {
                      testId: location.state.testId,
                      result: "0",
                      analyseId: el.analyseId,
                    })
                    .then((res) => getAnalysis4Test())
                    .catch((err) => console.log(err));
                });
              }
              setOpenAdd(false);
              setAnalysis([]);
            }}
          >
            إضافة
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog maxWidth={"lg"} open={openDelete} onClose={() => setOpenDelete(false)}>
        <Box sx={{ backgroundColor: "#aaa", border: "3px solid #f00", borderRadius: 1 }}>
          <IconButton
            sx={{ width: "max-content" }}
            variant="contained"
            onClick={() => setOpenDelete(false)}
          >
            <CloseIcon fontSize="large" color="#fff" />
          </IconButton>
          <Box sx={{ width: 500, minHeight: 450, p: 2 }}>
            <Typography mb={2}>إضافة تحليل</Typography>
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
                              console.log(analysis);
                            } else {
                              setAnalysis([
                                ...analysis,
                                { analyseId: el.analyseId, testDetailId: el.testDetailId },
                              ]);
                            }
                          }}
                        />
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </Box>
          </Box>
          <DialogActions>
            <Button
              variant="contained"
              color="info"
              sx={{ ml: 2 }}
              onClick={() => setOpenDelete(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                if (analysis.length > 0) {
                  analysis.map(async (el) => {
                    await axiosClient
                      .delete(`/testDetail/${el.testDetailId}`)
                      .then((res) => getAnalysis4Test())
                      .catch((err) => console.log(err));
                  });
                }
                setOpenDelete(false);
                setAnalysis([]);
              }}
            >
              حذف
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
};

export default DataEntry;
