// Desc: Theme options for LexMedica Page
import { ThemeOptions } from "@mui/material/styles";
import { darken } from "@mui/system";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#580100",
    },
    secondary: {
      main: "#D7B15C",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#333333",
    },
  },
  typography: {
    fontFamily: "Roboto",
    fontSize: 13,
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#580100",
          color: "#FFFFFF",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#D7B15C",
          boxShadow: "none",
          border: "1px solid #ccc",
          color: "#333333",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: "#333333",
          backgroundColor: "#FFFFFF",
          "&:hover": {
            backgroundColor: darken("#D7B15C", 0.1),
          },
        }),
        contained: ({ theme }) => ({
          backgroundColor: "#D7B15C",
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#333333",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#580100",
          "&:hover": {
            color: "#D7B15C",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          whiteSpace: "normal",
          overflowWrap: "break-word",
          color: "#333333",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: "#333333",
          backgroundColor: "#D7B15C",
          "&:hover": {
            backgroundColor: darken("#D7B15C", 0.3),
          },
        },
        icon: {
          color: "#333333",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#333333",
        },
      },
    },
  },
};
