import { ThemeOptions } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#28cb8b",
    },
    secondary: {
      main: "#263238",
    },
  },
  typography: {
    fontFamily: "Roboto",
    fontSize: 13,
    button: {
      textTransform: "none",
      tooltip: "#ffffff",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "lightgray",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          boxShadow: "none",
          border: "1px solid #ccc",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#263238",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            "& .MuiTypography-root": {
              color: "#28cb8b",
            },
          },
        },
        contained: {
          "&:hover": {
            "& .MuiTypography-root": {
              color: "#ffffff",
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          "&:hover": {
            "& .MuiTypography-root": {
              color: "#28cb8b",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#28cb8b", // Prevent color change on hover
            "& .MuiTypography-root": {
              backgroundColor: "inherit", // Prevent color change on hover for Typography
            },
          },
          fontSize: 13,
          border: "1px solid #ccc",
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          whiteSpace: "normal",
          overflowWrap: "break-word",
        },
      },
    },
  },
};
