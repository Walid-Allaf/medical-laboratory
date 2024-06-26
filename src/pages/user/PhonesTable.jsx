import React from "react";
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
import { Box } from "@mui/system";
import { useConfirm } from "material-ui-confirm";
import axiosClient from "../../axios/axiosClient";
import { useNotifications } from "../../contexts/Notifications";
import AddPhone from "./AddPhone";

const PhonesTable = ({ phones, userId, getDetails }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState();
  const [isAdd, setIsAdd] = React.useState(false);
  const { setSuccess, setError } = useNotifications();
  const confirm = useConfirm();

  const handleClose = (value) => {
    setOpen(false);
    // setValue(value);
    getDetails();
  };
  const handleAdd = (value) => {
    setValue({ userId });
    setIsAdd(true);
    setOpen(true);
  };
  const handleEdit = (value) => {
    console.log(value);
    setValue(value);
    setIsAdd(false);
    setOpen(true);
  };
  const handleDelete = async (id) => {
    confirm({
      title: "هل انت متأكد؟",
      description: "أنت على وشك حذف هذا الرقم!",
      cancellationText: "إلغاء",
      confirmationText: "حسناً",
      confirmationButtonProps: { color: "error", variant: "contained" },
      cancellationButtonProps: { color: "secondary", variant: "contained" },
    })
      .then(
        async () =>
          await axiosClient
            .delete(`/UserPhone/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getDetails();
                setSuccess("تم حذف الرقم");
              }
            })
            .catch((err) => {
              setError(err.message);
            })
      )
      .catch((err) => console.log(err));
  };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 610 }}>
        <Table stickyHeader aria-label="sticky table">
          {phones.length > 0 && (
            <TableHead sx={{ background: "transparent" }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>الهاتف</TableCell>
                <TableCell>التحكم</TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {phones.length > 0 ? (
              phones?.map((phone, key) => {
                return (
                  <TableRow hover tabIndex={-1} key={phone.userId}>
                    <TableCell>{key + 1}</TableCell>
                    <TableCell>{phone.phone}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "nowrap",
                          justifyContent: "center",
                          gap: 2,
                        }}
                      >
                        <Button variant="contained" onClick={() => handleEdit(phone)}>
                          تعديل
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(phone.userPhoneId)}
                        >
                          حذف
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "center", fontSize: "18px" }}>
                  لايوجد هواتف
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        sx={{ width: "100%", borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        variant="contained"
        color="secondary"
        onClick={() => handleAdd(phones)}
      >
        إضافة رقم
      </Button>
      <AddPhone value={value} open={open} onClose={handleClose} isAdd={isAdd} />
    </Paper>
  );
};

export default PhonesTable;
