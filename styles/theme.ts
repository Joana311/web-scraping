import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    text: {
      primary: "#fff",
      secondary: "#9B9B9B",
    },
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "rgba(53, 53, 53, 0.82)",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
