import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#15202b", light: "#6d6d6d", dark: "#1b1b1b" },
    secondary: { main: "#fafafa", light: "#ffffff", dark: "#c7c7c7" },
    background: {
      default: "#f3f4f6",
      paper: "#fafafa",
    },
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
});
