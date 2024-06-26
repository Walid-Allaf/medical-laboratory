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
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import CloseIcon from "@mui/icons-material/Close";
import { useNotifications } from "../../contexts/Notifications";

const KidneyFailure = () => {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState("");
  const [boolResult, setBoolResult] = React.useState(null);
  const { setSuccess } = useNotifications();

  const location = useLocation();
  const [creatinine, setCreatinine] = React.useState("");
  const [potassium, setPotassium] = React.useState("");
  const [hemoglobin, setHemoglobin] = React.useState("");
  const [urea, setUrea] = React.useState("");
  const [options, setOptions] = React.useState({ diabetesMellitus: false, appetite: false });

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
  
  الكرياتينين في الدم: ${creatinine} ✅
  
  اليوريا في الدم: ${urea} ✅
  
  الهيموغلوبين: ${hemoglobin} ✅
  
  البوتاسيوم: ${potassium} ✅

  يرجى الإجابة على الأسئلة التالية:
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
        if (item.analyseName.toLowerCase() === "creatinine") setCreatinine(item.result);
        else if (item.analyseName.toLowerCase() === "potassium") setPotassium(item.result);
        else if (item.analyseName.toLowerCase() === "hemoglobin") setHemoglobin(item.result);
        else if (item.analyseName.toLowerCase() === "urea") setUrea(item.result);
      });
    });
    console.log(location.state);
  }, []);

  const getResult = () => {
    setLoading(true);
    axiosClient
      .post("/Classification/CKD", {
        age: 2024 - Number(patientBirth),
        gender: location.state.patientGender === "Male" ? 0 : 1,
        serumCreatinine: Number(creatinine),
        potassium: Number(potassium),
        hemoglobin: Number(hemoglobin),
        bloodUrea: Number(urea),
        diabetesMellitus: options.diabetesMellitus,
        appetite: options.appetite,
      })
      .then((response) => {
        setLoading(false);
        setResult(response.data ? "يوجد إصابة بقصور الكلية" : "لايوجد إصابة بقصور الكلية");
        setBoolResult(response.data);
      });
  };

  const addRocordToCSV = (isOk) => {
    setOpen(false);
    axiosClient
      .post("/CKD", {
        age: 2024 - Number(patientBirth),
        gender: location.state.patientGender === "Male" ? 0 : 1,
        serumCreatinine: Number(creatinine),
        potassium: Number(potassium),
        hemoglobin: Number(hemoglobin),
        bloodUrea: Number(urea),
        diabetesMellitus: options.diabetesMellitus,
        appetite: options.appetite,
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
              <Typography>هل يوجد إصابة بمرض السكري؟</Typography>
              نعم
              <Switch
                checked={options.diabetesMellitus}
                onChange={(e) => setOptions({ ...options, diabetesMellitus: e.target.checked })}
              />
              لا
            </Box>
            <Box>
              <Typography>هل يوجد فقدان في الشهية؟</Typography>
              نعم
              <Switch
                checked={options.appetite}
                onChange={(e) => setOptions({ ...options, appetite: e.target.checked })}
              />
              لا
            </Box>
            <Button onClick={getResult} variant="contained">
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

export default KidneyFailure;
