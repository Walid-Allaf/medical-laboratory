import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import axiosClient from "../../axios/axiosClient";
import { useLocation } from "react-router";
import CloseIcon from "@mui/icons-material/Close";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { useNotifications } from "../../contexts/Notifications";

const HeartAttack = () => {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState("");
  const [boolResult, setBoolResult] = React.useState(null);
  const { setSuccess } = useNotifications();

  const location = useLocation();
  const [troponin, setTroponin] = React.useState("");
  const [glucose, setGlucose] = React.useState("");
  const [options, setOptions] = React.useState({ hypertension: false, heartDisease: false });

  const patientName = location.state.patientName;
  const patientBirth = location.state.patientBirth.substring(
    0,
    location.state.patientBirth.indexOf("-")
  );
  const patientGender = location.state.patientGender === "Male" ? "ذكر" : "انثى";

  const [displayedText, setDisplayedText] = React.useState("");
  const [displayedText1, setDisplayedText1] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [index1, setIndex1] = React.useState(0);
  const [start, setStart] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  let text = `

    شكراً لاستخدامك نظامنا المتطور في تشخيص الامراض

  الاسم: ${patientName} ✅

  العمر: ${2024 - Number(patientBirth)} ✅

  الجنس: ${patientGender} ✅

  التروبونين: ${troponin} ✅

  السكر: ${glucose} ✅

  للمتابعة يرجى ادخال المعلومات الإختيارية التالية:
`;

  const dialogText = `

إدعمنا في تطوير التطبيق وتحسين 

دقة تشخيص الأمراض لإفادة المرضى الآخرين

هل كان تشخيص الطبيب مطابق لنتائج

الذكاء الاصطناعي؟

`;
  React.useEffect(() => {
    setTimeout(
      () => {
        if (index < text.length) {
          const timeoutId = setTimeout(() => {
            setDisplayedText((prev) => prev + text.charAt(index));
            setIndex((prev) => prev + 1);
          }, 50);
          return () => clearTimeout(timeoutId);
        } else {
          setVisible(true);
        }
      },
      start ? 0 : 3000
    );
  }, [index, text]);

  React.useEffect(() => {
    if (index1 < dialogText.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText1((prev) => prev + dialogText.charAt(index1));
        setIndex1((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [index1, dialogText, open]);

  React.useEffect(() => {
    setTimeout(() => {
      setStart(true);
    }, 3000);

    location.state.groupedTestDetails.map((cat) => {
      cat.details.map((item) => {
        if (item.analyseName.toLowerCase() === "troponin") {
          setTroponin(item.result);
        }
        if (item.analyseName.toLowerCase() === "glucose") {
          setGlucose(item.result);
        }
      });
    });
    console.log(location.state);
  }, []);

  const getResult = () => {
    setLoading(true);
    axiosClient
      .post("/Classification/HeartAttack", {
        age: 2024 - Number(patientBirth),
        gender: location.state.patientGender === "Male" ? 0 : 1,
        troponin: Number(troponin),
        glucose: Number(glucose),
        impluse: options.impluse === true ? 1 : 0,
      })
      .then((response) => {
        setLoading(false);
        setResult(!response.data ? "لايوجد إصابة بالنوبة القلبية" : "يوجد إصابة بالنوبة القلبية");
        setBoolResult(response.data);
      });
  };

  const addRocordToCSV = (isOk) => {
    setOpen(false);
    axiosClient
      .post("/HeartAttack", {
        age: 2024 - Number(patientBirth),
        gender: location.state.patientGender === "Male" ? 0 : 1,
        troponin: Number(troponin),
        glucose: Number(glucose),
        impluse: options.impluse === true ? 1 : 0,
        class: isOk ? boolResult : !boolResult,
      })
      .then((response) => setSuccess("تم تخزين التشخيص بنجاح"));
  };

  return (
    <Box>
      <Box className="typewriter">
        {!start && (
          <Typography>
            يتم الآن جلب البيانات
            <CircularProgress size={"25px"} color="secondary" />
          </Typography>
        )}
        {start && <div className="typewriter-container">{displayedText}</div>}
        {visible && (
          <Box sx={{ p: 2 }}>
            <Box>
              <TextField
                value={options.impluse}
                placeholder="ماهي قيمة نبض القلب؟"
                onChange={(e) => setOptions({ ...options, impluse: e.target.value })}
                fullWidth
              />
            </Box>
            <Button sx={{ mt: 2 }} onClick={getResult} variant="contained">
              تشخيص الآن
            </Button>
          </Box>
        )}
      </Box>
      {loading ? (
        <Typography>
          جاري التشخيص <CircularProgress />
        </Typography>
      ) : (
        <Typography sx={{ fontSize: "40px", mt: 2, textAlign: "center" }}>
          {result}{" "}
          {result !== "" && (
            <IconButton
              sx={{ position: "absolute", top: 240, left: 305 }}
              onClick={() => {
                setDisplayedText1("");
                setIndex1(0);
                // setTimeout(() => {
                setOpen(true);
                // }, 500);
              }}
            >
              <TipsAndUpdatesIcon fontSize="large" color="secondary" />
            </IconButton>
          )}
        </Typography>
      )}

      <Dialog
        maxWidth={"lg"}
        open={open}
        onClose={() => {
          setOpen(false);
          setIndex1(0);
          setDisplayedText1("");
        }}
      >
        <Box sx={{ backgroundColor: "secondary.main", border: "3px solid #00f", borderRadius: 1 }}>
          <IconButton
            sx={{ width: "max-content" }}
            variant="contained"
            onClick={() => {
              setOpen(false);
              setIndex1(0);
              setDisplayedText1("");
            }}
          >
            <CloseIcon fontSize="large" color="#fff" />
          </IconButton>
          <Box sx={{ width: 750, minHeight: 450, p: 2 }}>
            <Box
              component={"div"}
              sx={{ color: "#fff", fontSize: 40, mr: 0 }}
              className="typewriter-container"
            >
              {displayedText1}
            </Box>
          </Box>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              "& button": {
                fontSize: 20,
              },
            }}
          >
            <Box>
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                color="error"
                onClick={() => {
                  addRocordToCSV(false);
                }}
              >
                غير مطابق
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addRocordToCSV(true);
                }}
              >
                مطابق
              </Button>
            </Box>
            <Button variant="contained" color="info" onClick={() => setOpen(false)}>
              تخطي
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};
export default HeartAttack;
