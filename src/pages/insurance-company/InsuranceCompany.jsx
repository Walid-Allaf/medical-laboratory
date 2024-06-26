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
import { Loading } from "../../components";

const InsuranceCompany = () => {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [insuranceCompanies, setInsuranceCompanies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { setSuccess, setError } = useNotifications();
  const confirm = useConfirm();

  const getInsuranceCompanies = async (rowsPerPage) => {
    setLoading(true);
    await axiosClient
      .get(`/insuranceCompany`)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          setInsuranceCompanies(res.data);
          console.log(res.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const deleteInsuranceCompany = async (id) => {
    confirm({
      title: "هل انت متأكد؟",
      description: "أنت على وشك حذف هذا الشركة تأمين!",
      cancellationText: "إلغاء",
      confirmationText: "حسناً",
      confirmationButtonProps: { color: "error", variant: "contained" },
      cancellationButtonProps: { color: "secondary", variant: "contained" },
    })
      .then(
        async () =>
          await axiosClient
            .delete(`/insuranceCompany/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getInsuranceCompanies(rowsPerPage);
                setSuccess("تم حذف الشركة تأمين");
              }
            })
            .catch((err) => {
              setError(err.message);
            })
      )
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    getInsuranceCompanies(rowsPerPage);
  }, []);

  return (
    <Container fixed sx={{ py: "50px", display: "flex", flexDirection: "column", gap: 5 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(`/insurance-company/new`)}
        sx={{ alignSelf: "self-end" }}
      >
        إضافة شركة تأمين
      </Button>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 610 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>الاسم</TableCell>
                <TableCell>الايميل</TableCell>
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
              ) : insuranceCompanies.length > 0 ? (
                insuranceCompanies?.map((insuranceCompany, key) => {
                  return (
                    <TableRow hover tabIndex={-1} key={insuranceCompany.insuranceCompanyId}>
                      <TableCell>{key + 1}</TableCell>
                      <TableCell>{insuranceCompany.name}</TableCell>
                      <TableCell>{insuranceCompany.email}</TableCell>
                      <TableCell>
                        {insuranceCompany.insuranceCompanyPhones.map((i) => {
                          return (
                            <p>
                              {i.phone} <br />
                            </p>
                          );
                        })}
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
                              navigate(`/insurance-company/${insuranceCompany.name}`, {
                                state: insuranceCompany,
                              })
                            }
                          >
                            تعديل
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() =>
                              deleteInsuranceCompany(insuranceCompany.insuranceCompanyId)
                            }
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
                  No Insurance Companies Found!
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default InsuranceCompany;
