import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { colors } from "@mui/material";
declare module "@mui/material/styles" {
  interface Palette {
    blue: Palette["primary"];
  }
  interface PaletteOptions {
    blue?: Palette["primary"];
  }
}
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
    blue: {
      main: colors.blue[500],
      contrastText: "#fff",
      light: colors.blue[300],
      dark: colors.blue[900],
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
