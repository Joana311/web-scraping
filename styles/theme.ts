import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    text: {
      primary: "#fff",
      secondary: "#898A8A",
    },
    primary: {
      main: "#000",
    },
    secondary: {
      main: "rgba(53, 53, 53, 0.72)",
    },
    info: {
      main: "#fff",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
