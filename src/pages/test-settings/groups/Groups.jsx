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
import AddGroup from "./AddGroup";

const Groups = () => {
  const navigate = useNavigate();
  const { setSuccess, setError } = useNotifications();
  const [loading, setLoading] = React.useState(false);
  const [isAdd, setIsAdd] = React.useState("");
  const [groups, setGroups] = React.useState([]);
  const confirm = useConfirm();

  const getGroups = async () => {
    setLoading(true);
    await axiosClient
      .get("/group")
      .then((res) => {
        if (res.status === 200) {
          setGroups(res.data);
          setLoading(false);
          console.log(res);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const deleteGroup = async (id) => {
    confirm({
      title: "هل انت متأكد؟",
      description: "أنت على وشك حذف هذه المجموعة!",
      cancellationText: "إلغاء",
      confirmationText: "حسناً",
      confirmationButtonProps: { color: "error", variant: "contained" },
      cancellationButtonProps: { color: "secondary", variant: "contained" },
    })
      .then(
        async () =>
          await axiosClient
            .delete(`/group/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getGroups();
                setSuccess("Group Deleted");
              }
            })
            .catch((err) => {
              setError(err.message);
            })
      )
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    getGroups();
  }, []);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
    setIsAdd("");
    setValue("");
  };
  const handleUpdate = (cat) => {
    setOpen(true);
    setIsAdd(cat.groupId);
    setValue(cat.groupName);
  };

  const handleClose = (value) => {
    setOpen(false);
    setValue(value);
    getGroups();
  };

  return (
    <Container fixed sx={{ py: "10px", display: "flex", flexDirection: "column", gap: 5 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClickOpen}
        sx={{ alignSelf: "self-end" }}
      >
        إضافة مجموعة
      </Button>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 610 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>اسم المجموعة</TableCell>
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
              ) : groups.length > 0 ? (
                groups
                  .filter((g) => g.groupName !== "General")
                  .map((group, key) => {
                    const { groupName, groupId } = group;
                    return (
                      <TableRow hover tabIndex={-1} key={groupId}>
                        <TableCell>{key + 1}</TableCell>
                        <TableCell>{groupName}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "nowrap",
                              justifyContent: "center",
                              gap: 2,
                            }}
                          >
                            <Button
                              variant="contained"
                              onClick={() => {
                                handleUpdate(group);
                              }}
                            >
                              تعديل
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => deleteGroup(groupId)}
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
                  لايوجد مجموعات!
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <AddGroup value={value} open={open} onClose={handleClose} isAdd={isAdd} />
    </Container>
  );
};

export default Groups;
