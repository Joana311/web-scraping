import {
  gql,
  useLazyQuery,
  useQuery,
  ApolloClient,
  useMutation,
} from "@apollo/client";
import myApolloClient from "../../../lib/apollo";
//import { initializeApollo } from "../../../lib/apollo";
import { GetServerSideProps, NextPageContext } from "next";
import { UserWorkouts } from "../../containers/UserWorkouts";
import { useEffect, useState } from "react";
import { User } from "../../../graphql/generated/graphql";
import Link from "next/link";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import styled from "@mui/system/styled";
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
const QUERY_USER = gql`
  query User($name: String) {
    user(name: $name) {
      id
      name
      email
      workouts {
        id
        ownerID
        date
        sets {
          id
          createdAt
          exerciseID
          workoutID
          reps
          rpe
        }
      }
    }
  }
`;
const ADD_EMPTY_WORKOUT = gql`
  mutation AddEmptyWorkout($ownerId: ID!) {
    addEmptyWorkout(ownerID: $ownerId) {
      id
      name
      email
      workouts {
        id
        ownerID
        date
        sets {
          id
          createdAt
          exerciseID
          workoutID
          reps
          rpe
        }
      }
    }
  }
`;
export interface UserPageProps {
  user: User;
  exercises: Exercise[];
  recent_workouts: UserWorkoutWithExercises[];
}

//TODO
// Pull last 5 workouts from database
//React Functional Component
export default function user({
  user,
  exercises,
  recent_workouts,
}: UserPageProps) {
  const [User, setUser] = useState<User>(user);
  const [todaysDate, setTodaysDate] = useState(dayjs().format("dddd, MMM D"));
  console.log(todaysDate);
  const router = useRouter();
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
          <RecentWorkouts
            recentWorkouts={recent_workouts}
          />
        </Box>
      </Stack>
    </>
  );
}
export const Banner = styled("div")({
  color: "aliceblue",
  backgroundColor: "darkslategray",
});
export const buttonClass = {
  color: "aliceblue",
  backgroundColor: "darkslategray",
  maxWidth: 110,
  maxHeight: 110,
  minWidth: 110,
  minHeight: 110,
  borderRadius: "50%",
  //border: "2px solid",
};

//cannot use apollo's useQuery hook inside of another react hook must use the client
export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const prisma = new PrismaClient();
  const exercises = await prisma.exercise.findMany();
  const user = await prisma.user.findFirst({
    where: { name: context.query.user as string },
  });
  const recent_workouts: UserWorkoutWithExercises[] = await getWorkouts(
    user.id
  );
  
  return {
    props: {
      user: user,
      exercises: exercises,
      recent_workouts: recent_workouts,
    },
  };
};
