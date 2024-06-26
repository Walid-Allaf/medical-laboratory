import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import axiosClient from "../../axios/axiosClient";
import { Box, Container } from "@mui/system";
import { Loading } from "../../components";
import { useNotifications } from "../../contexts/Notifications";
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router";

const Patients = () => {
  const navigate = useNavigate();
  const { setSuccess, setError } = useNotifications();
  const [loading, setLoading] = React.useState(false);
  const [patients, setPatients] = React.useState([]);
  const confirm = useConfirm();

  const getPateints = async () => {
    setLoading(true);
    await axiosClient
      .get("/patient")
      .then((res) => {
        if (res.status === 200) {
          setPatients(res.data);
          setLoading(false);
          console.log(res);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const deletePatient = async (id) => {
    confirm({
      title: "هل انت متأكد؟",
      description: "أنت على وشك حذف هذا المريض!",
      cancellationText: "إلغاء",
      confirmationText: "حسناً",
      confirmationButtonProps: { color: "error", variant: "contained" },
      cancellationButtonProps: { color: "secondary", variant: "contained" },
    })
      .then(
        async () =>
          await axiosClient
            .delete(`/patient/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getPateints();
                setSuccess("تم حذف المريض");
              }
            })
            .catch((err) => {
              setError(err.message);
            })
      )
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    getPateints();
  }, []);

  return (
    <Container fixed sx={{ py: "50px", display: "flex", flexDirection: "column", gap: 5 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(`/patients/new`)}
        sx={{ alignSelf: "self-end" }}
      >
        إضافة مريض
      </Button>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 610 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>الاسم الأول</TableCell>
                <TableCell>الاسم الأخير</TableCell>
                <TableCell>الجنس</TableCell>
                <TableCell>الهاتف</TableCell>
                <TableCell>تارخ الميلاد</TableCell>
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
              ) : patients.length > 0 ? (
                patients.map((patient, key) => {
                  return (
                    <TableRow hover tabIndex={-1} key={patient.patientId}>
                      <TableCell>{key + 1}</TableCell>
                      <TableCell>{patient.firstName}</TableCell>
                      <TableCell>{patient.lastName}</TableCell>
                      <TableCell>{patient.gender === "Male" ? "ذكر" : "انثى"}</TableCell>
                      <TableCell>
                        {patient.patientPhones.map((el) => (
                          <Box>
                            {el.phone}
                            <br />
                          </Box>
                        ))}
                      </TableCell>
                      <TableCell>
                        {patient.birthDay.substring(0, patient.birthDay.indexOf("T"))}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "nowrap",
                            gap: 2,
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() =>
                              navigate(`/patients/${patient.firstName}-${patient.lastName}`, {
                                state: {
                                  ...patient,
                                },
                              })
                            }
                          >
                            تعديل
                          </Button>
                          {/* <Button
                            variant="contained"
                            color="error"
                            onClick={() => deletePatient(patient.patientId)}
                          >
                            حذف
                          </Button> */}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableCell colSpan={7} style={{ textAlign: "center", fontSize: "18px" }}>
                  لايوجد مرضى
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Patients;
