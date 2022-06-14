import { Box, Grid, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DailyActivitySummary from "../../components/DailyActivitySummary";
import RecentWorkouts from "../../components/RecentWorkouts.test";
import React from "react";

import { useAppUser } from "@client/context/app_user.test";
import trpc from "@client/trpc";

//React Functional Component

const UserPage = () => {
  const todaysDate = React.useMemo(
    () => dayjs().format("dddd, MMM D"),
    [dayjs().toDate()]
  );

  const user = useAppUser();
  // const { data: workouts } = trpc.useQuery(
  //   ["workout.all_by_owner_id", { owner_id: user.get_id as string }],
  //   {
  //     enabled: !!user?.get_id,
  //   }
  // );
  // console.log(user);
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
                Summary
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
              <AccountCircleIcon fontSize="large"></AccountCircleIcon>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            // border: "1px solid white",
            mt: "2em",
            backgroundColor: "inherit",
            minHeight: "max-content",
          }}
        >
          <DailyActivitySummary />
        </Box>
        <Box
          sx={{
            // border: "1px solid white",
            mt: "2em",
            backgroundColor: "inherit",
            minHeight: "max-content",
          }}
        >
          <RecentWorkouts />
        </Box>
      </Stack>
    </>
  );
};
export default UserPage;
