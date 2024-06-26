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
} from "@mui/material";
import { Box, Stack } from "@mui/system";

import axiosClient from "../../axios/axiosClient";
import { useNavigate } from "react-router";
import { useConfirm } from "material-ui-confirm";

import { useNotifications } from "../../contexts/Notifications";
import ReactPaginate from "react-paginate";
import { Loading } from "../../components";

export default function Doctors() {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [doctors, setDoctors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { setSuccess, setError } = useNotifications();
  const confirm = useConfirm();

  const getDoctors = async (rowsPerPage) => {
    setLoading(true);
    await axiosClient
      .get(`/doctor`)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          setDoctors(res.data);
          console.log(res.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const deleteDoctor = async (id) => {
    confirm({
      title: "هل انت متأكد؟",
      description: "أنت على وشك حذف هذا الطبيب!",
      cancellationText: "إلغاء",
      confirmationText: "حسناً",
      confirmationButtonProps: { color: "error", variant: "contained" },
      cancellationButtonProps: { color: "secondary", variant: "contained" },
    })
      .then(
        async () =>
          await axiosClient
            .delete(`/doctor/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getDoctors(rowsPerPage);
                setSuccess("تم حذف الطبيب");
              }
            })
            .catch((err) => {
              setError(err.message);
            })
      )
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    getDoctors(rowsPerPage);
  }, []);

  return (
    <Container fixed sx={{ py: "50px", display: "flex", flexDirection: "column", gap: 5 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(`/doctors/new`)}
        sx={{ alignSelf: "self-end" }}
      >
        إضافة طبيب
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
                <TableCell>الايميل</TableCell>
                <TableCell>الإختصاص</TableCell>
                <TableCell>الهاتف</TableCell>
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
              ) : doctors.length > 0 ? (
                doctors?.map((doctor, key) => {
                  return (
                    <TableRow hover tabIndex={-1} key={doctor.doctorId}>
                      <TableCell>{key + 1}</TableCell>
                      <TableCell>{doctor.firstName}</TableCell>
                      <TableCell>{doctor.lastName}</TableCell>
                      <TableCell>{doctor.gender === "Male" ? "ذكر" : "انثى"}</TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>
                        {doctor.doctorPhones.map((el) => (
                          <Box>
                            {el.phone}
                            <br />
                          </Box>
                        ))}
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
                            onClick={() => navigate(`/doctors/${doctor.doctorId}`)}
                          >
                            تعديل
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => deleteDoctor(doctor.doctorId)}
                          >
                            حذف
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableCell colSpan={7} style={{ textAlign: "center", fontSize: "18px" }}>
                  No Doctors Found!
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
