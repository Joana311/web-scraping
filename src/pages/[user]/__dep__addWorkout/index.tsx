import React, { useState } from "react";
import HeaderBar from "../../../components/HeaderBar";
import {
  Exercise,
  Set,
  User,
  ExerciseResolvers,
} from "../../../../__dep__graphql/generated/graphql";
import {
  MutationAddWorkoutSetArgs,
  Workout,
} from "../../../../__dep__graphql/generated/graphql";
import { GetServerSideProps, GetStaticProps, NextPage } from "next";
import myApolloClient from "../../../../lib/apollo";
import { gql, OperationVariables, useMutation } from "@apollo/client";
import { Grid, FormControl, Box, Card } from "@mui/material";
import { useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import { WorkOutlineRounded } from "@mui/icons-material";
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
    $id: ID
    $workoutID: ID!
    $exerciseID: ID!
    $reps: Int
    $rpe: Int
  ) {
    addWorkoutSet(
      id: $id
      workoutID: $workoutID
      exerciseID: $exerciseID
      reps: $reps
      rpe: $rpe
    ) {
      id
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
  const [showExercises, setShowExercises] = useState<Boolean>(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();
  const [formData, setFormData] = useState<Set[]>([]);
  const [setCount, setSetCount] = useState(0);
  const [repCount, setRepCount] = useState(0);
  //Apollo Hooks
  const [addSet, { data }] = useMutation<any, MutationAddWorkoutSetArgs>(
    ADD_SET_TO_WORKOUT
  );
  
  //Routing Handlers
  const overviewWorkoutHandler = (workoutId) => (
    <Link
      as={`/${User.name}/addWorkout/overview?id=${workoutId}`}
      href="/[user]/addWorkout/overview"
    >
      <button> Overview</button>
    </Link>
  );

  //State Related Handlers
  const toggleExerciseList = () => {
    setShowExercises((prevState) => !prevState);
  };
  const handleRepsUpdate = (updateFunction, index) => {
    setFormData((prevState) => [
      ...(prevState.slice(0, index) || []),
      {
        ...prevState[index],
        reps: updateFunction(prevState[index].reps),
      },
      ...(prevState.slice(index + 1) || []),
    ]);
  };

  const handleSetId = (setId: string, index) => {
    setFormData((prevState) => [
      ...(prevState.slice(0, index) || []),
      {
        ...prevState[index],
        id: setId,
      },
      ...(prevState.slice(index + 1) || []),
    ]);
  };

  //Database Handlers
  const saveSets = async () => {
    for (const [index, set] of formData.entries()) {
      let { workoutID, exerciseID, reps, rpe, id: SetId } = set;
      // console.log({ set });
      //console.log(`${SetId} lives in state`);

      const { data } = await addSet({
        variables: {
          id: SetId,
          workoutID: workoutID,
          exerciseID: exerciseID,
          reps: reps,
          rpe: rpe,
        },
      });
      if (await data.addWorkoutSet) {
        let { id } = data.addWorkoutSet;
        //console.log(id)

        if (id) {
          console.log(
            `updating id ${data.addWorkoutSet.id} to Set state on index: ${index}`
          );
          handleSetId(id, index);
        }
      } else {
        console.log("Previous Set Updated");
      }
    }
    //console.log(formData);
  };
  const initializeSet = () => {
    let newSet: Set = {
      createdAt: undefined,
      id: undefined,
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
      console.log(formData);
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
                          //console.log(formData)
                        }}
                      >
                        Save
                      </button>
                    )}
                    <button onClick={toggleExerciseList}>New Exercise</button>
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
        {formData.length > 0 && (
          <Grid item>
            {overviewWorkoutHandler(String(Router.router.query.id))}
          </Grid>
        )}
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
