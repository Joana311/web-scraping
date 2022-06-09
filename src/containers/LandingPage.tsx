import Link from "next/link";
import { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import LandingPageMenu from "../components/LandingPageMenu";
export function LandingPage() {
  const [userName, setUserName] = useState(undefined);
  useEffect(() => {
  }, [userName]);

  return (
    <>
      <Grid container sx={{ height: "100vh", border: "1px solid black" }}>
        <Grid
          item
          container
          justifyContent="center"
          xs={12}
          sx={{
            mt: "2rem",
            // border: "1px solid black",
            height: "min-content",
          }}
        >
          {userName ? (
            <h1>Welcome {userName}</h1>
          ) : (
            <Typography variant="h3"> Hello Stranger!</Typography>
          )}
        </Grid>
        <Grid
          item
          container
          justifyContent="center"
          xs={12}
          sx={{ border: "1px solid black", height: "max-content" }}
        >
          <LandingPageMenu />
        </Grid>
      </Grid>
    </>
  );
}
