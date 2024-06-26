import React from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  Box,
  Button,
  Collapse,
  Container,
  Dialog,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Loading, PatientReport } from "../../components";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router";
import { useNotifications } from "../../contexts/Notifications";
import { useConfirm } from "material-ui-confirm";

const Search = () => {
  const { search } = useStateContext();
  const [tests, setTests] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openReport, setOpenReport] = React.useState(false);
  const [testId, setTestId] = React.useState(null);
  const navigate = useNavigate();
  const { setSuccess, setError } = useNotifications();
  const confirm = useConfirm();
  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTests(search);
      setLoading(false);
    }, 200);
  }, [search]);
  return (
    <Container fixed sx={{ py: "50px", display: "flex", flexDirection: "column", gap: 5 }}>
      <Typography fontSize={20}>التحاليل</Typography>
      <Paper sx={{ width: "100%", overflow: "hidden", p: 1 }}>
        <TableContainer sx={{ maxHeight: 610 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>اسم المريض</TableCell>
                <TableCell>الجنس</TableCell>
                <TableCell>العمر</TableCell>
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
                  const { patientId, firstName, lastName, birthDay, gender, tests } = test;
                  return (
                    <Row
                      key={key}
                      row={test}
                      citiesIn={tests}
                      firstName={firstName}
                      lastName={lastName}
                      birthDay={birthDay}
                      gender={gender}
                      onDelete={(id, bool) => {
                        setTestId(id);
                        setOpenReport(bool);
                      }}
                    />
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
};

export default Search;

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
function Row(props) {
  const { row, citiesIn, onDelete, firstName, lastName, birthDay, gender } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        {/* <TableCell></TableCell> */}
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {firstName} {lastName}
        </TableCell>
        <TableCell>{gender === "Male" ? "ذكر" : "انثى"}</TableCell>
        <TableCell>{2024 - Number(birthDay.substring(0, 4))}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>رقم التحليل</TableCell>
                    <TableCell>تاريخ التحليل</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citiesIn.map((row, i) => (
                    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                      <TableCell component="th" scope="row">
                        {i + 1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.testId}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.testDate?.substring(0, 10)}
                      </TableCell>
                      <TableCell
                        component="th"
                        sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                        scope="row"
                      >
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={() =>
                            navigate(`/data-entry`, {
                              state: { testId: row.testId, disable: true },
                            })
                          }
                        >
                          التفاصيل
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            onDelete(row.testId, true);
                          }}
                          sx={{ display: "flex", gap: 1 }}
                        >
                          <PictureAsPdfIcon />
                          <Typography>/</Typography>
                          <LocalPrintshopIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {citiesIn.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={10}>لايوجد تحاليل</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
