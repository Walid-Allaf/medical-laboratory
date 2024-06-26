import { Navigate, createBrowserRouter } from "react-router-dom";
import {
  AddDoctor,
  AddInsuranceCompany,
  AddPatient,
  AddUser,
  AiResult,
  Analysis,
  Categories,
  DataEntry,
  Doctors,
  DownloadCSV,
  Groups,
  InsuranceCompany,
  Login,
  Main,
  MainTest,
  NaturalField,
  Patients,
  Profile,
  Registers,
  Reports,
  Search,
  Settings,
  TestSettings,
  Users,
} from "./pages";
import { DefaultLayout, GuestLayout } from "./components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "/doctors",
        element: <Doctors />,
      },
      {
        path: "/doctors/new",
        element: <AddDoctor key="newDoctor" />,
      },
      {
        path: "/doctors/:id",
        element: <AddDoctor key="editDoctor" />,
      },

      {
        path: "/patients",
        element: <Patients />,
      },
      {
        path: "/patients/new",
        element: <AddPatient key="newPatient" />,
      },
      {
        path: "/patients/:name",
        element: <AddPatient key="editPatient" />,
      },

      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/new",
        element: <AddUser key="newUser" />,
      },
      {
        path: "/users/:name",
        element: <AddUser key="editUser" />,
      },

      {
        path: "/insurance-company",
        element: <InsuranceCompany />,
      },
      {
        path: "/insurance-company/new",
        element: <AddInsuranceCompany key="newUser" />,
      },
      {
        path: "/insurance-company/:name",
        element: <AddInsuranceCompany key="editUser" />,
      },

      {
        path: "/test-settings",
        element: <TestSettings />,
        children: [
          {
            path: "/test-settings/categories",
            element: <Categories />,
          },
          {
            path: "/test-settings/groups",
            element: <Groups />,
          },
          {
            path: "/test-settings/natural-field",
            element: <NaturalField />,
          },
          {
            path: "/test-settings/analysis",
            element: <Analysis />,
          },
        ],
      },

      {
        path: "/main-test",
        element: <MainTest />,
      },
      {
        path: "/data-entry",
        element: <DataEntry />,
      },
      {
        path: "/registers",
        element: <Registers />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/ai",
        element: <AiResult />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/download-csv",
        element: <DownloadCSV />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/search",
        element: <Search />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
