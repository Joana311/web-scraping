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
import prisma from "../../../lib/prisma";
import { Exercise, PrismaClient } from "@prisma/client";
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
}

//React Functional Component
export default function user({ user, exercises }: UserPageProps) {
  const [User, setUser] = useState<User>(user);
  // get today's date as Day of the Week/Month/Day
  // const getDate = () => {
  //   //format like "Fri, Mar 15"
  //   return dayjs().format("dddd, MMM D");
  // }
  const [todaysDate, setTodaysDate] = useState(dayjs().format("dddd, MMM D"));
  console.log(todaysDate);

  const [addEmptyWorkout, { error: addWorkoutError }] =
    useMutation(ADD_EMPTY_WORKOUT);
  const addWorkoutHandler = async () => {
    if (addWorkoutError) {
      return <pre>ERROR ADDING WORKOUT</pre>;
    }
    const res = await addEmptyWorkout({ variables: { ownerId: user.id } });
    if (res) {
      setUser({ ...User, workouts: res.data.addEmptyWorkout.workouts });
    }
  };

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
        {/* <Grid
          container
          xs={12}
          sx={{
            marginTop: "22vh",
            height: 300,
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Grid 
            item
            xs={6}
            sx={{ display: "flex", justifyContent: "center", minWidth: 110 }}
          >
            <Link as={`/${User.name}/addWorkout`} href="/[user]/addWorkout">
              <Button variant="outlined" sx={{ ...buttonClass }}>
                {"Continue or Add Workout "}
              </Button>
            </Link>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: "flex", justifyContent: "center", minWidth: 110 }}
          >
            <Button disabled sx={{ ...buttonClass }}>
              PlaceHolder
            </Button>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: "flex", justifyContent: "center", minWidth: 110 }}
          >
            <Button sx={{ ...buttonClass }}>Workout History</Button>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: "flex", justifyContent: "center", minWidth: 110 }}
          >
            <Button sx={{ ...buttonClass }}>Friends</Button>
          </Grid>
        </Grid> */}
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
export const getServerSideProps: GetServerSideProps<UserPageProps> = async (
  context
) => {
  const prisma = new PrismaClient();
  //this is the one we want to use with caching
  //const apolloClient = initializeApollo();

  //this is the one im currently using coz dumb
  // const apolloClient = myApolloClient;

  // const { data, error } = await myApolloClient.query({
  //   query: QUERY_USER,
  //   variables: { name: context.query.user },
  // });
  // const result = data.user;
  // if (error) {
  //   return <pre>Error getting User: {`${error.message}`}</pre>;
  // }
  const exercises = await prisma.exercise.findMany();
  const user = await prisma.user.findFirst({
    where: { name: context.query.user as string },
  });
  return {
    props: {
      user: user,
      exercises: exercises,
    },
  };
};
