import React, { useState } from "react";
import HeaderBar from "../../../components/__dep__HeaderBar";
import myApolloClient from "../../../../lib/apollo";
import { GetServerSideProps } from "next/types";
import {
  Exercise,
  Set,
  User,
  UserResolvers,
  Workout,
} from "../../../../__dep__graphql/generated/graphql";
import { gql } from "apollo-server-micro";
import { Box } from "@mui/material";
const GET_EXERCISES_BY_WORKOUT = gql`
query WorkoutByExercises($workoutByExercisesId: ID!) {
  workoutByExercises(id: $workoutByExercisesId) {
    inSets {
      reps
      rpe
      workoutID
      exerciseID
      createdAt
      id
    }
    name
    url
  }
}
`
const GET_WORKOUT_AND_USERNAME = gql`
  query workout($workoutId: ID!) {
    workout(id: $workoutId) {
      id
      date
      sets {
        id
        exerciseID
        workoutID
        reps
        rpe
      }
      owner {
        name
      }
    }
  }
`;
export interface overviewProps {
  Workout: Workout | any;
  User: any;
  exercises: Exercise[];
}
const overview = ({ User, Workout, exercises: _exercises }: overviewProps) => {
  const [exercises, setExercsies] = useState<Exercise[]>(_exercises);

  console.log(exercises);
  return (
    <HeaderBar userName={User.name}>
      <h2>Workout Overview</h2>
      <>
        {exercises.map((exercise , index) => {
          return (
            <>
              <Box key={index}>
                <h3>{exercise.name}</h3>
                <span>{exercise.inSets.map((set,index)=>{
                    return<><h4>{`Set: ${index+1} Reps: ${set.reps} RPE: ${set.rpe}`}</h4>
                    </>
                })
                    }</span>
              </Box>
            </>
          );
        })}
      </>
    </HeaderBar>
  );
};

export default overview;

export const getServerSideProps: GetServerSideProps<overviewProps> = async (
  context
) => {
  const { data } = await myApolloClient.query({
    query: GET_WORKOUT_AND_USERNAME,
    variables: {
      workoutId: context.query.id,
    },
  });

  const res = await data.workout;
  const {data: data2 } = await myApolloClient.query({
      query: GET_EXERCISES_BY_WORKOUT,
      variables:{
        workoutByExercisesId: context.query.id,
      }
  })

  const exData = await data2.workoutByExercises

  //console.log(exData);
  return {
    props: {
      User: res.owner,
      Workout: res,
      exercises: exData
    },
  };
};
