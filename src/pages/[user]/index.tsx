import { gql, useLazyQuery,useQuery } from "@apollo/client";
import apolloClient from "../../../lib/apollo";
import { GetServerSideProps, NextPageContext } from "next";
import { UserWorkouts } from "../../containers/UserWorkouts";
import { useEffect, useState } from "react";
import { typeDefs } from "../../../graphql/schema";
const QUERY_USER = gql`
  query User($name: String) {
  user(name: $name) {
    id
    name
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
    sets {
      reps
      rpe
      exerciseID
    }
  }
}`;

export interface User {
  name: string;
  email: string;
  id: string;
  workouts: undefined;
}

export interface UserPageProps {
  user: User;
}
export default function user({ user }: UserPageProps) {
  const [User, setUser] = useState(user)
  useEffect(()=>{
    console.log(User)
  },[user])


  return (
    <div>
      <h1>{user.name}'s Profile</h1>
      {console.log(user.workouts)}
      <div>
          <h3>Workouts</h3>
          <UserWorkouts user={user}/>
      </div>
      <div>
          <h3>{user.name}'s Exercises</h3>
      </div>
    </div>
  );
}
//cannot use apollo's useQuery hook inside of another react hook must use the client
export const getServerSideProps: GetServerSideProps<UserPageProps> = async (context) => {
  //console.log(context.query.user)
  const  {data, error}  = await apolloClient.query({
    query: QUERY_USER,
    variables:{name: context.query.user}
  });
  const result = data.user;

  console.log({result})
  //console.log(context.query.user)
  return {props: {user: result }}
};
