import { GetServerSideProps, NextPage, NextPageContext } from "next";
import Link from "next/link";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DailyActivitySummary from "../../components/DailyActivitySummary";
import RecentWorkouts from "../../components/RecentWorkouts";
import { Exercise, PrismaClient } from "@prisma/client";
import createWorkout, {
  UserWorkoutWithExercises,
} from "../../../lib/mutations/createWorkout";
import getWorkouts from "../../../lib/queries/getWorkouts";
import { useRouter } from "next/router";
import React from "react";
import trpc from "../../client/trpc";

interface UserPageProps {
  user: any;
  recent_workouts: UserWorkoutWithExercises[];
}

//React Functional Component
const UserPage = () => {
  const { query: query_params } = useRouter();
  const [recentWorkouts, setRecentWorkouts] = React.useState<
    UserWorkoutWithExercises[]
  >([]);
  const { data: user_data } = trpc.useQuery([
    "user.get_by_name",
    { name: query_params.user?.toString() ?? "" },
  ]);

  React.useEffect(() => {
    console.group("useEffect");
    console.log(user_data?.workouts);
    if (user_data) {
      setRecentWorkouts(user_data.workouts);
    }
    console.groupEnd();
  }, [user_data?.workouts]);
  const [todaysDate, setTodaysDate] = React.useState(
    dayjs().format("dddd, MMM D")
  );
  console.log(todaysDate);

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
          <RecentWorkouts recentWorkouts={recentWorkouts} />
        </Box>
      </Stack>
    </>
  );
};
// UserPage.getInitialProps = async ({ query }: NextPageContext) => {
//   debugger;
//   const user = trpc.useQuery([
//     "user.get_by_name",
//     { name: query?.user?.toString() ?? "" },
//   ]);
//   console.log(user);
//   let recent_workouts: UserWorkoutWithExercises[] = [];
//   if (user.data) {
//     recent_workouts = user.data.workouts;
//   }
//   console.log(recent_workouts);

//   return {
//     props: {
//       user: user.data,
//       recent_workouts: [],
//     },
//   };
// };
export default UserPage;
