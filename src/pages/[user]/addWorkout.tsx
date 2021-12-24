import React, { useState } from "react";
import HeaderBar from "../../components/HeaderBar";
import {
  Exercise,
  Set,
  User,
  Workout,
  ExerciseResolvers,
} from "../../../graphql/generated/graphql";
import { GetServerSideProps, GetStaticProps, NextPage } from "next";
import myApolloClient from "../../../lib/apollo";
import { gql, useMutation } from "@apollo/client";
import { Grid, FormControl, Box, Card } from "@mui/material";
import { useEffect } from "react";
import Router from "next/router";
const GET_ALL_EXERCISES = gql`
  query AllExercises {
    allExercises {
      name
      url
      uuid
    }
  }
`;
const ADD_SET_TO_WORKOUT = gql`
  mutation AddWorkoutSet(
    $workoutID: ID!
    $exerciseID: ID!
    $reps: Int
    $rpe: Int
  ) {
    addWorkoutSet(
      workoutID: $workoutID
      exerciseID: $exerciseID
      reps: $reps
      rpe: $rpe
    ) {
      name
    }
  }
`;
const GET_ID_BY_NAME = gql`
  query User($name: String) {
    user(name: $name) {
      name
      id
    }
  }
`;
export interface addWorkoutProps {
  User: User | any;
  Exercises: [Exercise] | any;
}
export interface workoutData {
  sets: [Set];
}
//need a workoutForm that follow imported type for workout.
//need to send it and object with a key of the exercise id
//and the value is gonna be an array of set objects with reps and rpe

//pick an exercise
//add a set (prolly needs its own container)
//set amount of reps
// have option for new set.
// have option ok or save
function addWorkout({ Exercises, User }: addWorkoutProps) {
  const [showExercises, setShowExercises] = useState<Boolean>(true)
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();
  const [formData, setFormData] = useState<Set[]>([]);
  const [setCount, setSetCount] = useState(0);
  const [repCount, setRepCount] = useState(0);
  //Apollo Hooks
  const [addSet, { data }] = useMutation(ADD_SET_TO_WORKOUT);
  //State Related Handlers
  const toggleExerciseList = () =>{
    setShowExercises(prevState => !prevState)
  }
  const handleRepsUpdate = (updateFunction, index) => {
    const updateForm = [
      ...(formData.slice(0, index) || []),
      {
        ...formData[index],
        reps: updateFunction(formData[index].reps),
      },
      ...(formData.slice(index + 1) || []),
    ];
    setFormData(updateForm);
  };

  //Database Handlers
  const saveSets = async () => {
    for (const set of formData) {
      let { workoutID, exerciseID, reps, rpe } = set;
      console.log({set})
      await addSet({
        variables: {
          workoutID: workoutID,
          exerciseID: exerciseID,
          reps: reps,
          rpe: rpe,
        },
      });
    }
    console.log("hello");
  };
  const initializeSet = () => {
    let newSet: Set = {
      rpe: 0,
      reps: 0,
      exerciseID: selectedExercise.uuid,
      workoutID: String(Router.router.query.id),
    };

    setSetCount((prevState) => prevState + 1);
    setFormData((prevState) => [...prevState, newSet]);
  };

  useEffect(() => {
    if (setCount != 0) {
      console.log(setCount);
    }
  }, [formData]);

  return (
    <>
      <HeaderBar userName={User.name}>
        <Grid>
          {!showExercises && (
            <Grid item>
              <Box>
                <h2>{selectedExercise.name}</h2>
                {formData.length >= 0 && (
                  <>
                    {formData.map((current_set, index) => (
                      <Box
                        key={index}
                        sx={{ border: "1px dashed grey", padding: 2 }}
                      >
                        <button
                          onClick={() => {
                            handleRepsUpdate((x) => x + 1, index);
                          }}
                        >
                          +
                        </button>
                        <a>{formData[index].reps}</a>
                        <button
                          onClick={() => {
                            handleRepsUpdate((x) => x - 1, index);
                          }}
                        >
                          -
                        </button>
                      </Box>
                    ))}

                    <button
                      onClick={() => {
                        initializeSet();
                      }}
                    >
                      add a set
                    </button>
                    {formData.length != 0 && (
                      <button
                        onClick={() => {
                          saveSets();
                        }}
                      >
                        Save
                      </button>
                    )}
                    <button
                    onClick={toggleExerciseList}>
                      New Exercise
                    </button>
                  </>
                )}
              </Box>
            </Grid>
          )}
          {showExercises && (
            <Grid item>
              {Exercises.map((exercise, index) => (
                <Box
                  key={index}
                  sx={{ border: "1px dashed grey", padding: 2 }}
                  onClick={() => {
                    console.log(exercise);
                    setFormData([]);
                    toggleExerciseList();
                    setSelectedExercise(() => ({
                      name: exercise.name,
                      uuid: exercise.uuid,
          

                    }));
                  }}
                >
                  {exercise.name}
                </Box>
              ))}
            </Grid>
          )}
        </Grid>
      </HeaderBar>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<addWorkoutProps> = async (
  context
) => {
  //console.log(context.query.user)
  const { data } = await myApolloClient.query({
    query: GET_ALL_EXERCISES,
  });
  const { data: userData } = await myApolloClient.query({
    query: GET_ID_BY_NAME,
    variables: {
      name: context.query.user,
    },
  });
  const { user } = userData;
  //console.log(data.allExercises);
  return {
    props: {
      User: user,
      Exercises: data.allExercises,
    },
  };
};
export default addWorkout;
