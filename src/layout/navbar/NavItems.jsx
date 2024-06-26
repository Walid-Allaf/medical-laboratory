import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TuneIcon from "@mui/icons-material/Tune";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { SvgIcon } from "@mui/material";

const username = sessionStorage.getItem("ai-lab-username");
const isAdmin = username === "admin" ? true : false;

export const NavItems = [
  {
    title: "الرئيسية",
    path: "/",
    show: true,
    icon: (
      <SvgIcon>
        <HomeRoundedIcon />
      </SvgIcon>
    ),
  },
  {
    title: "إضافة تحليل",
    path: "/main-test",
    show: true,
    icon: (
      <SvgIcon>
        <PostAddIcon />
      </SvgIcon>
    ),
  },
  {
    title: "السجلات",
    path: "/registers",
    show: true,
    icon: (
      <SvgIcon>
        <ReceiptRoundedIcon />
      </SvgIcon>
    ),
  },
  {
    title: "التقارير المالية",
    path: "/reports",
    show: true,
    icon: (
      <SvgIcon>
        <AssessmentIcon />
      </SvgIcon>
    ),
  },
  {
    title: "الإعدادات",
    path: "/settings",
    show: isAdmin ? true : false,
    icon: (
      <SvgIcon>
        <SettingsRoundedIcon />
      </SvgIcon>
    ),
  },
  {
    title: "تحميل ملفات CSV",
    path: "/download-csv",
    show: isAdmin ? true : false,
    icon: (
      <SvgIcon>
        <CloudDownloadIcon />
      </SvgIcon>
    ),
  },
  {
    title: "الملف الشخصي",
    path: "/profile",
    show: true,
    icon: (
      <SvgIcon>
        <AccountCircleIcon />
      </SvgIcon>
    ),
  },
];

export const QuickAccess = [
  {
    title: "إضافة مريض",
    path: "/patients/new",
    show: true,
    icon: (
      <SvgIcon>
        <PersonAddAlt1Icon />
      </SvgIcon>
    ),
  },
  {
    title: "إضافة طبيب",
    path: "/doctors/new",
    show: true,
    icon: (
      <SvgIcon>
        <PersonAddAlt1Icon />
      </SvgIcon>
    ),
  },
  {
    title: "إعدادات التحاليل",
    path: "/test-settings/analysis",
    show: isAdmin ? true : false,
    icon: (
      <SvgIcon>
        <TuneIcon />
      </SvgIcon>
    ),
  },
];
