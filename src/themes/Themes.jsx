import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2b29a5",
    },
    secondary: {
      main: "#65b1f7",
    },
    warning: {
      main: "#2b29a552",
    },
    info: {
      main: "#323639",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffffbb",
        },
      },
    },
  },
});

export default theme;
