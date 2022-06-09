import PropTypes from "prop-types";
import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { GetServerSideProps, NextPageContext } from "next";
import { ownerWindow } from "@mui/material";
import { User, Workout } from "../../__dep__graphql/generated/graphql";
import { Grid, Box } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
//Not sure if this is even needed tbh
const ADD_EMPTY_WORKOUT = gql`
  mutation AddEmptyWorkout($ownerId: ID!) {
    addEmptyWorkout(ownerID: $ownerId) {
      id
      ownerID
      date
      sets {
        id
        createdAt
        exerciseID
        reps
        rpe
      }
    }
  }
`;

const USER_WORKOUTS = gql`
  query Workout($ownerId: ID) {
    workout(ownerID: $ownerId) {
      id
      ownerID
      date
      sets {

        reps
        rpe
        exerciseID
      }
    }
  }
`;

// https://reactjs.org/docs/conditional-rendering.html

interface Props {
  User: any | null;
  update: any;
  edit: any;
}
export const parseDate = (intString) => {
  const res = new Date(parseInt(intString));
  return res;
};

export const UserWorkouts: NextPage<Props> = (props, NextPageContext) => {
  const { User, update, edit } = props;
  const [addWorkout, setAddWorkout] = useState(false);
  const router = useRouter();
  return (
    <>
      {User.workouts.length ? (
        <>
          {User.workouts.map((workout, index) => (
            <>
              <h2 key={index}> {parseDate(workout.date).toLocaleString()}</h2>
              {workout.sets.map((set, index) => {
                return (
                  <>
                    <div key={index}>
                      {set.exerciseID ? (
                        set.exerciseID
                      ) : (
                        <>
                          no data yet
                          <button
                            onClick={() => {
                              console.log(workout.id)
                              router.push({
                                pathname: "/[user]/addWorkout",
                                query: { user: User.name, 
                                        id: workout.id},
                              });
                            }}
                          >
                            add Exercise
                          </button>
                        </>
                      )}
                    </div>
                  </>
                );
              })}
            </>
          ))}
        </>
      ) : (
        "Nothing Logged Yet"
      )}{" "}
      <br></br>
      {/* {console.log(user.id)} */}
      <button
        onClick={() => {
          update();
          console.log("clicked");
        }}
      >
        Add
      </button>
    </>
  );
};
