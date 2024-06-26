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
import { Image, Loading } from "../../components";
import { useNotifications } from "../../contexts/Notifications";
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router";

const Users = () => {
  const navigate = useNavigate();
  const { setSuccess, setError } = useNotifications();
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const confirm = useConfirm();

  const getUsers = async () => {
    setLoading(true);
    await axiosClient
      .get("/user")
      .then((res) => {
        if (res.status === 200) {
          setUsers(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const deleteUsers = async (id) => {
    confirm({
      title: "هل أنت متأكد؟",
      description: "أنت على وشك حذف هذا المستخدم!",
      cancellationText: "إلغاء",
      confirmationText: "حسناً",
      confirmationButtonProps: { color: "error", variant: "contained" },
      cancellationButtonProps: { color: "secondary", variant: "contained" },
    })
      .then(
        async () =>
          await axiosClient
            .delete(`/user/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getUsers();
                setSuccess("تم حذف المستخدم");
              }
            })
            .catch((err) => {
              setError(err.message);
            })
      )
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    getUsers();
  }, []);

  return (
    <Container fixed sx={{ py: "50px", display: "flex", flexDirection: "column", gap: 5 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(`/users/new`)}
        sx={{ alignSelf: "self-end" }}
      >
        إضافة مستخدم
      </Button>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 610 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>اسم المستخدم</TableCell>
                <TableCell>الاسم الأول</TableCell>
                <TableCell>الاسم الأخير</TableCell>
                <TableCell>الهاتف</TableCell>
                <TableCell>الايميل</TableCell>
                <TableCell>الصورة</TableCell>
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
              ) : users.length > 0 ? (
                users.map((user, key) => {
                  return (
                    <TableRow hover tabIndex={-1} key={user.userId}>
                      <TableCell>{key + 1}</TableCell>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>
                        {user.userPhones.map((el) => (
                          <Box>
                            {el.phone}
                            <br />
                          </Box>
                        ))}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.image2 && (
                          <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
                            <Image src={`${user.image2}`} alt="projImg" width={50} height={50} />
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.userName !== "admin" && (
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
                                navigate(`/users/${user.userName}`, {
                                  state: {
                                    ...user,
                                  },
                                })
                              }
                            >
                              تعديل
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => deleteUsers(user.userId)}
                            >
                              حذف
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableCell colSpan={7} style={{ textAlign: "center", fontSize: "18px" }}>
                  لايوجد مستخدمين
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Users;
