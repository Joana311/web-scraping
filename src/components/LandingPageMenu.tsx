import { Button, Grid, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import React from "react";
import Typography from "@mui/material/Typography";
import Link from "next/link";

function LandingPageMenu() {
  return (
    <>
      <Stack
        spacing={3}
        // component={Card}
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          width: "80%",
          //   border: "2px solid red",
          minHeight: "300px",
        }}
      >
        <Button
          variant="contained"
          disabled={true}
          sx={{
            height: "45px",
            fontSize: "1rem",
          }}
        >
          Log in
        </Button>
        <Link as={"/guest"} href={"/[user]"}>
          <Button
            variant="contained"
            sx={{
              height: "45px",
              fontSize: "1rem",
            }}
          >
            Continue As Guest
          </Button>
        </Link>
      </Stack>
    </>
  );
}

export default LandingPageMenu;
