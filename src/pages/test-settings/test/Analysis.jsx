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
import axiosClient from "../../../axios/axiosClient";
import { Box, Container } from "@mui/system";
import { Loading } from "../../../components";
import { useNotifications } from "../../../contexts/Notifications";
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router";
import AddUpdateAnalysis from "./AddUpdateAnalysis";

const Tests = () => {
  const navigate = useNavigate();
  const { setSuccess, setError } = useNotifications();
  const [loading, setLoading] = React.useState(false);
  const [analyses, setAnalyses] = React.useState([]);
  const confirm = useConfirm();

  const [value, setValue] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [isAdd, setIsAdd] = React.useState("");
  const handleClose = (value) => {
    setOpen(false);
    getAnalyses();
  };

  const getAnalyses = async () => {
    setLoading(true);
    await axiosClient
      .get("/Analyse/GetAllWithCategoryAndGroupAndNaturalField")
      .then((res) => {
        if (res.status === 200) {
          setAnalyses(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const deleteAnalyse = async (id) => {
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
            .delete(`/analyse/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getAnalyses();
                setSuccess("تم الحذف بنجاح");
              }
            })
            .catch((err) => {
              setError(err.message);
            })
      )
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    getAnalyses();
  }, []);

  return (
    <Container fixed sx={{ py: "10px", display: "flex", flexDirection: "column", gap: 5 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setOpen(true);
          setIsAdd(true);
          setValue({});
        }}
        sx={{ alignSelf: "self-end" }}
      >
        إضافة تحليل
      </Button>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 610 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>الاسم</TableCell>
                <TableCell>الفئة</TableCell>
                <TableCell>المجموعة</TableCell>
                <TableCell>الوحدات</TableCell>
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
              ) : analyses.length > 0 ? (
                analyses.map((analyse, key) => {
                  const { analyseId, name, category, group, nUint } = analyse;
                  return (
                    <TableRow hover tabIndex={-1} key={analyseId}>
                      <TableCell>{key + 1}</TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{category.categoryName}</TableCell>
                      <TableCell>{group.groupName}</TableCell>
                      <TableCell>{nUint}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            flexWrap: "nowrap",
                            gap: 2,
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => {
                              setOpen(true);
                              setValue(analyse);
                              setIsAdd(false);
                            }}
                          >
                            تعديل
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => deleteAnalyse(analyseId)}
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
                  لايوجد تحاليل!
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <AddUpdateAnalysis value={value} open={open} onClose={handleClose} isAdd={isAdd} />
    </Container>
  );
};

export default Tests;
