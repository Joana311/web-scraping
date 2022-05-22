import { Stack, Box, Grid, Typography } from "@mui/material";
import React from "react";
import DailyActivitySummary from "../../../components/DailyActivitySummary";
import RecentWorkouts from "../../../components/RecentWorkouts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import dayjs from "dayjs";
import ExerciseSummary from "../../../components/ExerciseSummary/ExerciseSummary";
import Link from "next/link";

function workout() {
  const [todaysDate, setTodaysDate] = React.useState(
    dayjs().format("dddd, MMM D")
  );
  return (
    <>
      <Stack
        sx={{
          backgroundColor: "#000",
          minHeight: "100vh",
          pl: "1em",
          pr: "1em",
        }}
      >
        <Box
          sx={{
            marginTop: "1em",
            minHeight: "max-content",
            // paddingTop: "3px",
            backgroundColor: "#000",
            // border: "1px solid white",
          }}
        >
          <Grid
            container
            sx={{
              // border: "0.5px blue solid",
              justifyContent: "space-between",
            }}
          >
            <Grid
              item
              sx={{
                width: "max-content",
                // border: ".5px solid pink"
              }}
            >
              <span>
                <Typography
                  className="date"
                  color="text.secondary"
                  fontSize={".85rem"}
                  sx={{ pl: "0.2rem" }}
                >
                  {todaysDate}
                </Typography>
              </span>

              <Typography
                variant={"h4"}
                sx={{
                  mt: "-.55rem",
                  fontWeight: "light",
                  minHeight: "max-content",
                }}
              >
                Workout Report
              </Typography>
            </Grid>
            <Grid
              item
              container
              sx={{
                width: "max-content",
                // border: ".5px solid pink",
                alignItems: "center",
                mr: ".6em",
              }}
            >
              <Link as="/guest" href="/[user]">
                <AccountCircleIcon fontSize="large"></AccountCircleIcon>
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            // border: "1px solid white",
            mt: "2em",
            backgroundColor: "inherit",
            // minHeight: "max-content",
          }}
        >
          <ExerciseSummary />
        </Box>
        <Box
          sx={{
            // border: "1px solid white",
            mt: "2em",
            backgroundColor: "inherit",
            minHeight: "max-content",
          }}
        ></Box>
      </Stack>
    </>
  );
}

export default workout;
