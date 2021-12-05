import PropTypes from "prop-types";
import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import apolloClient from "../../lib/apollo";
import { GetServerSideProps, NextPageContext } from "next";
import { resolvers } from "../../graphql/resolvers";
import user from "../pages/[user]/index";
//Not sure if this is even needed tbh
const addWorkoutQuery = gql`
  mutation Mutation($ownerID: ID!) {
    addEmptyWorkout(ownerID: $ownerID) {
      exerciseHistory {
    #     sets {
    #       rpe
    #       reps
    #       exerciseID
    #     }
        ownerID
      }
    }
  }
`;
// https://reactjs.org/docs/conditional-rendering.html

export interface User {
  name: string;
  email: string;
  id: string;
  exerciseHistory: {} | undefined;
}
interface Props {
  user: User;
}

export const UserWorkouts: NextPage<Props> = (props, NextPageContext) => {
  const [addUserWorkout, { data, loading, error }] =
    useMutation(addWorkoutQuery);

  console.log(data)
  const [addWorkout, setAddWorkout] = useState(false);
  useEffect(() => {
      if (data){
          console.log(data.user);
          props.user.exerciseHistory = data.user.exerciseHistory;
      }
  }, [addWorkout]);

  //have to destructre the interface
  const { user } = props;
  //console.log(props)
  return (
    <>
      {console.log(user.exerciseHistory)}
      {}
      <a>
        {user.exerciseHistory
          ? () => {
              <>
                <a>"THIS SHOULD SHOW UP WHEN WE HAVE SOME EXERCISE HISTORY"</a>
              </>;
            }
          : "Nothing Logged Yet"}{" "}
      </a>
      <br></br>
      {console.log(user.id)}
      <button
        onClick={() =>
          addUserWorkout({
            variables: {
              ownerID: user.id,
            },
          })
        }
      >
        Add
      </button>
    </>
  );
};
