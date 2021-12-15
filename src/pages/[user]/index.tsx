import {
  gql,
  useLazyQuery,
  useQuery,
  ApolloClient,
  useMutation,
} from "@apollo/client";
import myApolloClient from "../../../lib/apollo";
import { initializeApollo } from "../../../lib/apollo";
import { GetServerSideProps, NextPageContext } from "next";
import { UserWorkouts } from "../../containers/UserWorkouts";
import { useEffect, useState } from "react";
import { typeDefs } from "../../../graphql/schema";
const QUERY_USER = gql`
  query User($name: String) {
    user(name: $name) {
      id
      name
      email
      workouts {
        ownerID
        date
        sets {
          exerciseID
          reps
          rpe
          ownerID
        }
      }
    }
  }
`;
const USER_WORKOUTS = gql`
  query Workout($ownerId: ID) {
    workout(ownerID: $ownerId) {
      ownerID
      date
      sets {
        exerciseID
        reps
        rpe
      }
    }
  }
`;
const ADD_EMPTY_WORKOUT = gql`
  mutation AddEmptyWorkout($ownerId: ID!) {
    addEmptyWorkout(ownerID: $ownerId) {
      ownerID
      date
      sets {
        exerciseID
        reps
        rpe
      }
    }
  }
`;
export interface User {
  name: string;
  email: string;
  id: string;
  workouts: [];
}

export interface UserPageProps {
  user: User;
  initialApolloState: any;
}
export default function user({ user }: UserPageProps) {
  const [User, setUser] = useState(user);

  const { data } = useQuery(USER_WORKOUTS, {
    variables: {
      ownerId: User.id,
    },
  });

  const addWorkoutHandler = () => {
    const [addEmptyWorkout, { data, error: addWorkoutError }] =
      useMutation(ADD_EMPTY_WORKOUT);
    if (addWorkoutError) {
      return <pre>ERROR ADDING WORKOUT</pre>;
    }
    addEmptyWorkout({ variables: { ownerId: user.id } });
    if (data) {
      console.log({ data });
      console.log("adding workout in parent from child");
      //setUser({ ...User, workouts: data.user });
    }
  };

  useEffect(() => {
    //console.log("renderParent");
  }, [User.workouts]);

  if (data) {
    // console.log(data.workout);
    if (User.workouts != data.workout) {
      //console.log("here");
      //setUser({ ...User, workouts: data.workout });
    }
  }

  return (
    <div>
      <h1>{user.name}'s Profile</h1>
      <div>
        <h3>Workouts</h3>
        <UserWorkouts user={User} update={addWorkoutHandler} />
      </div>
      <div>
        <h3>{user.name}'s Exercises</h3>
      </div>
    </div>
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

  const { data, error } = await apolloClient.query({
    query: QUERY_USER,
    variables: { name: context.query.user },
  });
  const result = data.user;
  if (error) {
    return <pre>Error: {`${error.message}`}</pre>;
  }
  console.log({ data });

  return {
    props: {
      user: result,
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
