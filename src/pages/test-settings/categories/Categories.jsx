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
import AddCategory from "./AddCategory";

const Categories = () => {
  const navigate = useNavigate();
  const { setSuccess, setError } = useNotifications();
  const [loading, setLoading] = React.useState(false);
  const [isAdd, setIsAdd] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const confirm = useConfirm();

  const getCategories = async () => {
    setLoading(true);
    await axiosClient
      .get("/category")
      .then((res) => {
        if (res.status === 200) {
          setCategories(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const deleteCategories = async (id) => {
    confirm({
      title: "هل انت متأكد؟",
      description: "أنت على وشك حذف هذه الفئة!",
      cancellationText: "إلغاء",
      confirmationText: "حسناً",
      confirmationButtonProps: { color: "error", variant: "contained" },
      cancellationButtonProps: { color: "secondary", variant: "contained" },
    })
      .then(
        async () =>
          await axiosClient
            .delete(`/category/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getCategories();
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
    getCategories();
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
    setIsAdd(cat.categoryId);
    setValue(cat.categoryName);
  };

  const handleClose = (value) => {
    setOpen(false);
    setValue(value);
    getCategories();
  };

  return (
    <Container fixed sx={{ py: "10px", display: "flex", flexDirection: "column", gap: 5 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClickOpen}
        sx={{ alignSelf: "self-end" }}
      >
        إضافة فئة
      </Button>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 610 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>اسم الفئة</TableCell>
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
              ) : categories.length > 0 ? (
                categories.map((category, key) => {
                  const { categoryName, categoryId } = category;
                  return (
                    <TableRow hover tabIndex={-1} key={categoryId}>
                      <TableCell>{key + 1}</TableCell>
                      <TableCell>{categoryName}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "nowrap",
                            justifyContent: "center",
                            gap: 2,
                          }}
                        >
                          <Button variant="contained" onClick={() => handleUpdate(category)}>
                            تعديل
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => deleteCategories(category.categoryId)}
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
                  لايوجد فئات!
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <AddCategory value={value} open={open} onClose={handleClose} isAdd={isAdd} />
    </Container>
  );
};

export default Categories;

// refetch data in handleClose when proccess is complete
