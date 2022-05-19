import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { NextPage } from "next";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import path from "path";

export default function HeaderBar({ children, userName }) {
  const router = useRouter();
  return (
    <>
      <Box sx={{ height: 60, flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon
                onClick={() => {
                  router.push({
                    pathname: "/[user]",
                    query: {
                      user: userName,
                    },
                  });
                }}
              />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {`${userName}'s Profile`}
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
      {children}
    </>
  );
}
