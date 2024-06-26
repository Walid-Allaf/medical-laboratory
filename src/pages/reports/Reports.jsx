import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { StatisticsReport } from "../../components";

const Reports = () => {
  const [from, setFrom] = React.useState(dayjs().add(-1, "day").format("YYYY-MM-DD"));
  const [to, setTo] = React.useState(dayjs().format("YYYY-MM-DD"));
  const [open, setOpen] = React.useState(false);

  const [customFrom, setCustomFrom] = React.useState("");
  const [customTo, setCustomTo] = React.useState("");
  const [validation, setValidation] = React.useState("");

  const BoxStyles = {
    userSelect: "none",
    fontSize: { xs: "12px", sm: "20px" },
    borderRadius: "5px",
    color: "#FFF",
    backgroundColor: "info.main",
    p: "3px",
    display: "flex",
    gap: 2,
    alignItems: "center",
    "& .MuiInputBase-root": {
      backgroundColor: "#FFF",
    },
  };

  return (
    <Container
      fixed
      sx={{
        py: "50px",
        display: "flex",
        flexDirection: "column",
        gap: 5,
        minHeight: "95vh",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                setTo(dayjs().format("YYYY-MM-DD"));
                setFrom(dayjs().add(-8, "day").format("YYYY-MM-DD"));
              }}
            >
              آخر اسبوع
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                setTo(dayjs().format("YYYY-MM-DD"));
                setFrom(dayjs().add(-1, "month").format("YYYY-MM-DD"));
              }}
            >
              آخر شهر
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                setTo(dayjs().format("YYYY-MM-DD"));
                setFrom(dayjs().add(-1, "year").format("YYYY-MM-DD"));
              }}
            >
              آخر سنة
            </Button>
            <Box sx={BoxStyles}>
              <DatePicker
                onChange={(date) => {
                  setFrom(dayjs(date).format("YYYY-01-01"));
                  setTo(dayjs(date).add(1, "year").format("YYYY-01-01"));
                }}
                label={"Year"}
                openTo="year"
                views={["year"]}
                color="#FFF"
              />
            </Box>
            <Box sx={BoxStyles}>
              <DatePicker
                onChange={(date) => {
                  setFrom(dayjs(date).format("YYYY-MM-01"));
                  setTo(dayjs(date).add(1, "month").format("YYYY-MM-01"));
                }}
                label={"Month"}
                openTo="month"
                views={["year", "month"]}
              />
            </Box>
            <Box sx={BoxStyles}>
              <DatePicker
                onChange={(date) => {
                  setFrom(dayjs(date).format("YYYY-MM-DD"));
                  setTo(dayjs(date).add(1, "day").format("YYYY-MM-DD"));
                }}
                label={"Day"}
              />
            </Box>

            <Button
              variant="contained"
              color="info"
              onClick={() => {
                setOpen(true);
                setCustomFrom("");
                setCustomTo("");
              }}
            >
              مخصص
            </Button>
          </Box>
        </LocalizationProvider>
        <Box sx={{ mt: 3 }}>
          <StatisticsReport fromDate={from} toDate={to} />
        </Box>
      </Box>

      <Dialog
        maxWidth={"lg"}
        open={open}
        onClose={() => {
          setOpen(false);
          setValidation("");
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ backgroundColor: "secondary.main" }}>
            <IconButton
              sx={{ width: "max-content" }}
              variant="contained"
              onClick={() => {
                setOpen(false);
                setValidation("");
              }}
            >
              <CloseIcon fontSize="large" color="#fff" />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", gap: 3, p: 4 }}>
            <Box sx={BoxStyles}>
              <DatePicker
                onChange={(date) => setCustomFrom(dayjs(date).format("YYYY-MM-DD"))}
                label={"من"}
              />
            </Box>
            <Box sx={BoxStyles}>
              <DatePicker
                onChange={(date) => setCustomTo(dayjs(date).format("YYYY-MM-DD"))}
                label={"إلى"}
              />
            </Box>
          </Box>
        </LocalizationProvider>
        <Typography color="error.main" sx={{ textAlign: "center" }}>
          {validation}
        </Typography>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              if (customFrom !== "" && customTo !== "") {
                setFrom(customFrom);
                setTo(customTo);
                setOpen(false);
                setValidation("");
              } else {
                setValidation("يجب تحديد الحقلين معاً");
              }
            }}
          >
            إنشاء التقرير
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reports;
