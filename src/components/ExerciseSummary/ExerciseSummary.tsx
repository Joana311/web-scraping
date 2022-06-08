import React, { useEffect } from "react";
import {
  Box,
  ButtonBase,
  colors,
  Fade,
  Grid,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import Link from "next/link";
import {
  SummaryCard,
  SummaryCardProps,
} from "./components/SummaryCardComponent";
import AddNewExerciseModal from "./containers/AddNewExerciseModal";
import { Exercise } from "@prisma/client";
import { UserWorkoutWithExercises } from "../../../lib/mutations/createWorkout";
import superjson from "superjson";
import superJsonWithNext from "babel-plugin-superjson-next";
interface ExerciseSummaryProps {
  exrx_data: Exercise[];
  workout_exercises: UserWorkoutWithExercises["exercises"];
}
const ExerciseSummary = ({
  exrx_data,
  workout_exercises,
}: ExerciseSummaryProps) => {
  const [showMore, toggleShowMore] = React.useState(false);
  const [showExerciseModal, setShowExerciseModal] = React.useState(false);
  const [workoutExercises, setWorkoutExercises] =
    React.useState(workout_exercises);
  console.log(workout_exercises);
  const fetch_callback = (res_json: string) => {
    // debugger;
    const workout: UserWorkoutWithExercises = superjson.parse(res_json);
    setWorkoutExercises((prev) => [...prev, ...workout.exercises]);

    setShowExerciseModal(false);
  };

  const exercise_summaries: SummaryCardProps["exercise"][] =
    workoutExercises?.map((exercise) => {
      return {
        name: exercise.exercise.name,
        muscle: exercise.exercise.muscle_name,
        variant: exercise.exercise.equipment_name,
        sets: exercise.sets.map((set) => {
          return {
            weight: set.weight,
            reps: set.reps,
            rpe: set.rpe,
          };
        }),
      };
    }) || [];
  useEffect(() => {
    exercise_summaries.length > 2
      ? toggleShowMore(true)
      : toggleShowMore(false);
  }, [exercise_summaries.length]);

  const borders = false;

  const addExercise = () => {
    setShowExerciseModal(true);
  };
  if (showExerciseModal) {
    return (
      <AddNewExerciseModal
        exercises={exrx_data}
        toggle={() => {
          setShowExerciseModal(false);
        }}
        fetch_callback={fetch_callback}
      />
    );
  }

  return (
    <>
      <Stack sx={{ width: "100%" }}>
        <Box
          className="exercises-title-bar"
          sx={{
            display: "flex",
            // border: "1px dashed white",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography fontWeight={"light"}>Exercises</Typography>
          {showMore ? (
            <Link href="">
              <Typography
                fontWeight={"semibold"}
                sx={{
                  pr: ".8em",
                  fontSize: ".9rem",
                  textDecoration: "underline",
                  color: colors.blue[600],
                }}
              >
                view all
              </Typography>
            </Link>
          ) : (
            <></>
          )}
        </Box>
        <Stack spacing={"0.7rem"}>
          <ButtonBase
            onClick={addExercise}
            sx={{
              borderRadius: 2,
              backgroundColor: "secondary.main",
              display: "flex",
              border: "1px solid white",
              width: "100%",
              px: ".5rem",
              py: ".2rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              fontWeight={"bold"}
              fontSize=".9rem"
              sx={{ height: "max-content" }}
            >
              New Exercise
            </Typography>
          </ButtonBase>

          {exercise_summaries.map((exercise, index) => {
            return (
              <SummaryCard exercise={exercise} isActive={true} key={index} />
            );
          })}
          {workoutExercises.length === 0 && (
            <Typography
              // component="body"
              sx={{
                fontSize: "1rem",
                fontWeight: "light",
                color: "text.secondary",
                width: "100%",
                display: "inline-block",
              }}
            >
              <span>{"No Exercises"}</span>
              <br />
              <span>{'Click "New Exercise" to get started.'}</span>
            </Typography>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default ExerciseSummary;
