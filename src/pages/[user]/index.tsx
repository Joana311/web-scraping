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
export default function user({ user }: UserPageProps) {

  const [User, setUser]= useState<User>(user);

  const run = (() => {
    console.log("render page")
    console.log (`this is Props: `)
    console.log(user)
    console.log(`this is State: $`)
    console.log(User)
  })();

  const editWorkoutHandler = () => {
    
    <Link as= { `/${User.name}/addWorkout` } href='/[user]/addWorkout'> add Exerercise</Link>
  }

  const [addEmptyWorkout, { error: addWorkoutError }] =
      useMutation(ADD_EMPTY_WORKOUT);

  const addWorkoutHandler = async () => {
    console.log('clicked Parent')
    if (addWorkoutError) {
      return <pre>ERROR ADDING WORKOUT</pre>;
    }
    const res = await addEmptyWorkout({ variables: { ownerId: user.id } })
      console.log('waiting')
      if (res) {
      console.log("adding workout in parent from child");
      console.log('updating state')
      setUser({ ...User, workouts: res.data.addEmptyWorkout.workouts});
    }
    console.log(myApolloClient.extract())
  };

  // useEffect(() => {
  //   console.log("User");
  // }, []);

  return (
    <HeaderBar userName={User.name}>
    <>
      <div>
        <h3>Workouts</h3>
        <UserWorkouts User={User} update={addWorkoutHandler} edit={editWorkoutHandler}/>
      </div>
      <div>
        <h3>{user.name}'s Exercises</h3>
      </div>
    </>
    </HeaderBar>
  );
}
//cannot use apollo's useQuery hook inside of another react hook must use the client
export const getServerSideProps: GetServerSideProps<UserPageProps> = async (
  context
) => {
  //this is the one we want to use with caching
  //const apolloClient = initializeApollo();

  //this is the one im currently using coz dumb
  const apolloClient = myApolloClient;
  console.log(myApolloClient.extract())
  console.log(context.query)

  const { data, error } = await myApolloClient.query({
    query: QUERY_USER,
    variables: { name: context.query.user },
  });
  const result = data.user;
  if (error) {
    return <pre>Error getting User: {`${error.message}`}</pre>;
  }
  //console.log({ data });

  return {
    props: {
      user: result,
      initialApolloState: null
    },
  };
};
