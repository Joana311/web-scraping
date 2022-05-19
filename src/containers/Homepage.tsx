import Link from "next/link";
import { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import HomePageMenu from "../components/HomePageMenu";
export function HomePage({ UserInfo }) {
  const [userName, setUserName] = useState(undefined);
  useEffect(() => {
    setUserName(UserInfo.name);
  }, [userName]);

  return (
    <>
      <Grid container sx={{ height: "100vh", border: "1px solid black" }}>
        <Grid
          item
          container
          justifyContent="center"
          xs={12}
          sx={{ mt: "2rem", border: "1px solid black", height: "min-content" }}
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
          <HomePageMenu />
        </Grid>
      </Grid>
    </>
  );
}
HomePage.getInitialProps = async () => {
  const data = undefined;
  return { UserInfo: { name: data } };
};
