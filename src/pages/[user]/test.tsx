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
import { ConstructionOutlined } from "@mui/icons-material";
import HeaderBar from "../../components/HeaderBar";
import Link from "next/link";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import RecentUserWokrouts from "../../components/page utility/RecentUserWokrouts";
import styled from "@mui/system/styled";
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
}

//React Functional Component
export default function test({ user }: UserPageProps) {
  const [User, setUser] = useState<User>(user);

  const editWorkoutHandler = () => {
    <Link as={`/${User.name}/addWorkout`} href="/[user]/addWorkout">
      {" "}
      add Exerercise
    </Link>;
  };

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
    <HeaderBar userName={User.name}>
      <>
        <Box
          sx={{
            backgroundColor: "#2c2f33",
            border: "3px dashed",
            height: "calc(100vh - 60px)",
          }}
        >
          <Box
            component={Banner}
            sx={{
              borderRadius: 4,
              marginTop: "5vh",
              minHeight: "100px",
              paddingTop: "3px",
              paddingLeft: "15px",

              //border: "4px solid green",
            }}
          >
            <Typography variant={"h5"}>Recent Workouts:</Typography>
            <RecentUserWokrouts></RecentUserWokrouts>
          </Box>
          <Grid
            container
            xs={12}
            sx={{
              marginTop: "22vh",
              height: 300,
              display: "flex",
              //border: "4px solid green",
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
          </Grid>
        </Box>
        <UserWorkouts
          User={User}
          update={addWorkoutHandler}
          edit={editWorkoutHandler}
        />

        <div>
          <h3>{user.name}'s Exercises</h3>
        </div>
      </>
    </HeaderBar>
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
  boxShadow: 3,
  //border: "2px solid",
};

//cannot use apollo's useQuery hook inside of another react hook must use the client
export const getServerSideProps: GetServerSideProps<UserPageProps> = async (
  context
) => {
  //this is the one we want to use with caching
  //const apolloClient = initializeApollo();

  //this is the one im currently using coz dumb
  const apolloClient = myApolloClient;

  const { data, error } = await myApolloClient.query({
    query: QUERY_USER,
    variables: { name: context.query.user },
  });
  const result = data.user;
  if (error) {
    return <pre>Error getting User: {`${error.message}`}</pre>;
  }
  return {
    props: {
      user: result,
      initialApolloState: null,
    },
  };
};
