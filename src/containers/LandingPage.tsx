import Link from "next/link";
import { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import LandingPageMenu from "../components/LandingPageMenu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
export function LandingPage() {
  const [userName, setUserName] = useState(undefined);
  const router = useRouter();
  useEffect(() => {
  }, [userName]);
  const { data: session, status } = useSession();
  // console.log("session info : ", session?.user)

  if (status !== "loading" && session?.user && typeof window !== "undefined") {
    router.push(`/${session?.user?.name}`);
  }

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
        {session == null ? <Grid
          item
          container
          justifyContent="center"
          xs={12}
          sx={{ border: "1px solid black", height: "max-content" }}
        >
          <LandingPageMenu />
        </Grid> : <></>}
      </Grid>
    </>
  );
}
