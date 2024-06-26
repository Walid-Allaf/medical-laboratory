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
import { Box, Container } from "@mui/system";
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router";
import { useNotifications } from "../../../contexts/Notifications";
import Loading from "../../../components/Loading";
import axiosClient from "../../../axios/axiosClient";
import AddNaturalField from "./AddNaturalField";

const NaturalField = () => {
  const navigate = useNavigate();
  const { setSuccess, setError } = useNotifications();
  const [loading, setLoading] = React.useState(false);
  const [isAdd, setIsAdd] = React.useState("");
  const [naturalFields, setNaturalFields] = React.useState([]);
  const confirm = useConfirm();

  const getNaturalFields = async () => {
    setLoading(true);
    await axiosClient
      .get("/naturalField")
      .then((res) => {
        if (res.status === 200) {
          setNaturalFields(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const deleteNaturalField = async (id) => {
    confirm({
      title: "هل انت متأكد؟",
      description: "أنت على وشك حذف هذا المجال!",
      cancellationText: "إلغاء",
      confirmationText: "حسناً",
      confirmationButtonProps: { color: "error", variant: "contained" },
      cancellationButtonProps: { color: "secondary", variant: "contained" },
    })
      .then(
        async () =>
          await axiosClient
            .delete(`/naturalField/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getNaturalFields();
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
    getNaturalFields();
  }, []);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState({});

  const handleClickOpen = () => {
    setOpen(true);
    setIsAdd(true);
    setValue({});
  };
  const handleUpdate = (naturalField) => {
    setOpen(true);
    setIsAdd(false);
    setValue(naturalField);
  };

  const handleClose = (value) => {
    setOpen(false);
    // setValue(value);
    getNaturalFields();
  };

  return (
    <Container fixed sx={{ py: "10px", display: "flex", flexDirection: "column", gap: 5 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClickOpen}
        sx={{ alignSelf: "self-end" }}
      >
        إضافة مجال طبيعي
      </Button>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 610 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>التحليل</TableCell>
                <TableCell>الحد الأدنى</TableCell>
                <TableCell>الحد الأعلى</TableCell>
                <TableCell>الجنس</TableCell>
                <TableCell>التحكم</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Loading />
                  </TableCell>
                </TableRow>
              ) : naturalFields.length > 0 ? (
                naturalFields.map((naturalField, key) => {
                  const { naturalFieldId, analyse, min, max, gender } = naturalField;
                  return (
                    <TableRow hover tabIndex={-1} key={naturalFieldId}>
                      <TableCell>{key + 1}</TableCell>
                      <TableCell>{analyse.name}</TableCell>
                      <TableCell>{min}</TableCell>
                      <TableCell>{max}</TableCell>
                      <TableCell>
                        {gender === "Male" ? "ذكر" : gender === "Female" ? "انثى" : "طفل"}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "nowrap",
                            justifyContent: "center",
                            gap: 2,
                          }}
                        >
                          <Button variant="contained" onClick={() => handleUpdate(naturalField)}>
                            تعديل
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => deleteNaturalField(naturalFieldId)}
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
                  لايوجد مجالات!
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <AddNaturalField value={value} open={open} onClose={handleClose} isAdd={isAdd} />
    </Container>
  );
};

export default NaturalField;
