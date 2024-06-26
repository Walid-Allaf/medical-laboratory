import * as React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Container,
  Dialog,
  IconButton,
  FormControl,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

import axiosClient from "../../axios/axiosClient";
import { useNavigate } from "react-router";
import { useConfirm } from "material-ui-confirm";

import { useNotifications } from "../../contexts/Notifications";
import { Loading, PatientReport } from "../../components";
import { dateAgo } from "../../utils";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SearchIcon from "@mui/icons-material/Search";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

export default function Registers() {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tests, setTests] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openReport, setOpenReport] = React.useState(false);
  const [testId, setTestId] = React.useState(null);
  const navigate = useNavigate();
  const { setSuccess, setError } = useNotifications();
  const confirm = useConfirm();

  const getTests = async (rowsPerPage) => {
    setLoading(true);
    await axiosClient
      .get(`/Test/GetByToday`)
      .then((res) => {
        if (res.status === 200) {
          setTests(res.data);
          setLoading(false);
          console.log(res.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const getTestsForSpecificDay = async (value) => {
    setLoading(true);
    await axiosClient
      .get(
        `/Test/GetByFromDateToDate?from=${value}&to=${dayjs(value)
          .add(1, "day")
          .format("YYYY-MM-DD")}`
      )
      .then((res) => {
        if (res.status === 200) {
          setTests(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const deleteTest = async (id) => {
    confirm({
      title: "هل انت متأكد؟",
      description: "أنت على وشك حذف هذا التحليل!",
      cancellationText: "إلغاء",
      confirmationText: "حسناً",
      confirmationButtonProps: { color: "error", variant: "contained" },
      cancellationButtonProps: { color: "secondary", variant: "contained" },
    })
      .then(
        async () =>
          await axiosClient
            .delete(`/test/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getTests();
                setSuccess("Test Deleted");
              }
            })
            .catch((err) => {
              setError(err.message);
            })
      )
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    getTests();
    console.log(dayjs(new Date().getTime()));
  }, []);
  const [search, setSearch] = React.useState(null);

  return (
    <Container fixed sx={{ py: "50px", display: "flex", flexDirection: "column", gap: 5 }}>
      <Typography fontSize={20}>التحاليل</Typography>
      <Paper sx={{ width: "100%", overflow: "hidden", p: 1 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="تحديد يوم"
              onChange={(date) => getTestsForSpecificDay(dayjs(date).format("YYYY-MM-DD"))}
            />
          </LocalizationProvider>
          {/* <Button disabled={loading} variant="contained" onClick={getTestsForSpecificDay()}>
            <SearchIcon fontSize="large" />
          </Button> */}
          <Autocomplete
            disablePortal
            freeSolo
            name="patient"
            options={tests.map((option) => ({
              id: option.testId,
              label:
                option.patient.firstName +
                " " +
                option.patient.lastName +
                " - " +
                option.patient.birthDay.substring(0, 4),
            }))}
            onChange={(event, value) => setSearch(value)}
            sx={{ width: 600 }}
            renderInput={(params) => <TextField {...params} label="البحث عن مريض" />}
          />
        </Box>
        <TableContainer sx={{ maxHeight: 610 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>اسم المريض</TableCell>
                <TableCell>اسم الطبيب</TableCell>
                <TableCell>المستخدم</TableCell>
                <TableCell>تاريخ التحليل</TableCell>
                <TableCell>التحكم</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Loading />
                  </TableCell>
                </TableRow>
              ) : tests.length > 0 ? (
                tests.map((test, key) => {
                  const {
                    doctorId,
                    discount,
                    insuranceCompanyId,
                    patientId,
                    testId,
                    testDate,
                    patient,
                    doctor,
                    user,
                  } = test;
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={testId}
                      sx={{
                        // FOR FILTERING
                        display:
                          search === null
                            ? "table-row"
                            : search.id === testId
                            ? "table-row"
                            : "none",
                      }}
                    >
                      <TableCell>{key + 1}</TableCell>
                      <TableCell>{patient.firstName + " " + patient.lastName}</TableCell>
                      <TableCell>{doctor.firstName + " " + doctor.lastName}</TableCell>
                      <TableCell>{user.firstName + " " + user.lastName}</TableCell>
                      <TableCell>{dateAgo(testDate)}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "nowrap",
                            gap: 2,
                          }}
                        >
                          <Button
                            color="secondary"
                            variant="contained"
                            onClick={() =>
                              navigate(`/data-entry`, {
                                state: { testId: testId },
                              })
                            }
                          >
                            إدخال النتائج
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => deleteTest(testId)}
                          >
                            حذف
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setTestId(testId);
                              setOpenReport(true);
                            }}
                            sx={{ display: "flex", gap: 1 }}
                          >
                            <PictureAsPdfIcon />
                            <Typography sx={{ fontSize: "28px" }}>/</Typography>
                            <LocalPrintshopIcon />
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableCell colSpan={7} style={{ textAlign: "center", fontSize: "18px" }}>
                  لايوجد تحاليل
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog maxWidth={"lg"} open={openReport} onClose={() => setOpenReport(false)}>
          <Box sx={{ backgroundColor: "secondary.main" }}>
            <IconButton
              sx={{ width: "max-content" }}
              variant="contained"
              onClick={() => setOpenReport(false)}
            >
              <CloseIcon fontSize="large" color="#fff" />
            </IconButton>
            <PatientReport testId={testId} />
          </Box>
        </Dialog>
      </Paper>
    </Container>
  );
}
