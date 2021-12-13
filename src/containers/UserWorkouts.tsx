import PropTypes from "prop-types";
import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import apolloClient from "../../lib/apollo";
import { GetServerSideProps, NextPageContext } from "next";
import { resolvers } from "../../graphql/resolvers";
import {User} from '../pages/[user]/index'
import { ownerWindow } from '@mui/material';

//Not sure if this is even needed tbh
const ADD_EMPTY_WORKOUT = gql`
mutation AddEmptyWorkout($ownerId: ID!) {
  addEmptyWorkout(ownerID: $ownerId) {
    ownerID
    date
    sets {
      exerciseID
      ownerID
      reps
      rpe
    }
  }
}
`;
// https://reactjs.org/docs/conditional-rendering.html

interface Props {
  user: User;
}

export const UserWorkouts: NextPage<Props> = (props, NextPageContext) => {
  const [addEmptyWorkout, { data, loading, error }] =
    useMutation(ADD_EMPTY_WORKOUT);

  //console.log(data)
  const [addWorkout, setAddWorkout] = useState(false);
  useEffect(() => {
      if (data){
          //console.log(data.user);
          props.user.workouts = data.user.workouts;
      }
  }, [addWorkout]);

  //have to destructre the interface
  const { user } = props;
  //console.log(props)
  return (
    <>
      {/* {console.log(user.exerciseHistory)} */}
      <a>
        {user.workouts.length?
            <>
              {user.workouts.map( (workout, index) =>(
                <h2 key={index}> { workout.date } </h2>
                ))
              }
            </>
        : "Nothing Logged Yet"}{" "}
      </a>
      <br></br>
      {console.log(user.id)}
      <button
        onClick={() =>
          addEmptyWorkout({variables:{
            ownerId: user.id
          }
          })
        }
      >
        Add
      </button>
    </>
  );
};
