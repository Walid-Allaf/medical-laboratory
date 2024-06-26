import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocationCityRoundedIcon from "@mui/icons-material/LocationCityRounded";
import AssistWalkerIcon from "@mui/icons-material/AssistWalker";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Person4Icon from "@mui/icons-material/Person4";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const username = sessionStorage.getItem("ai-lab-username");
const isAdmin = username === "admin" ? true : false;

export const Boxes = [
  {
    title: "إضافة تحليل",
    path: "/main-test",
    img: <PostAddIcon sx={{ width: "150px", height: "150px" }} color="primary" />,
  },
  {
    title: "المرضى",
    path: "/patients",
    img: <AssistWalkerIcon sx={{ width: "150px", height: "150px" }} color="primary" />,
  },
  {
    title: "الأطباء",
    path: "/doctors",
    img: <Person4Icon sx={{ width: "150px", height: "150px" }} color="primary" />,
  },
  {
    title: "شركات التأمين",
    path: "/insurance-company",
    img: <LocationCityRoundedIcon sx={{ width: "150px", height: "150px" }} color="primary" />,
  },
  {
    title: "التقارير المالية",
    path: "/reports",
    img: <AssessmentIcon sx={{ width: "150px", height: "150px" }} color="primary" />,
  },
  {
    title: "المستخدمين",
    path: isAdmin ? "/users" : "/",
    img: (
      <ManageAccountsIcon
        sx={{ width: "150px", height: "150px" }}
        className={isAdmin ? "" : "disable"}
        color="primary"
      />
    ),
  },
  {
    title: "إعدادات التحاليل",
    path: "/test-settings/categories",
    img: (
      <SettingsIcon
        sx={{ width: "150px", height: "150px" }}
        className={isAdmin ? "" : "disable"}
        color="primary"
      />
    ),
  },
  {
    title: "ملفات CSV",
    path: "/download-csv",
    img: (
      <CloudDownloadIcon
        sx={{ width: "150px", height: "150px" }}
        className={isAdmin ? "" : "disable"}
        color="primary"
      />
    ),
  },
];
