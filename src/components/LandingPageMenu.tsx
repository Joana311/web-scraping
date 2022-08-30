import { Button, Grid, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import React from "react";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import trpc from "@client/trpc";

import { signIn, signOut } from "next-auth/react";

const LandingPageMenu: React.FC = () => {
  return (
    <>
      {<Stack
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
        <Button
          variant="contained"
          // eslint-disable-next-line
          onClick={() => signIn("discord")}
          sx={{
            height: "45px",
            fontSize: "1rem",
          }}
        >
          Continue w/ Discord
        </Button>
      </Stack>}
    </>
  );
};


export default LandingPageMenu;
