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
import { SummaryCard, SummaryCardProps } from "./components/UserExerciseCard";
import AddNewExerciseModal from "./containers/AddNewExerciseModal";
import { Exercise } from "@prisma/client";
import { UserWorkoutWithExercises } from "../../../__dep__lib/mutations/createWorkout";
import superjson from "superjson";
import trpc from "@client/trpc";
interface ExerciseSummaryProps {
  exrx_data: Exercise[];
  workout_id: string;
}
const ExerciseSummary: React.FC<ExerciseSummaryProps> = ({
  exrx_data,
  workout_id
}: ExerciseSummaryProps) => {
  const { data: workout } = trpc.useQuery(["workout.get_by_id", { workout_id: workout_id }], { enabled: !!workout_id }
  );
  const [showMore, toggleShowMore] = React.useState(false);
  const [showExerciseModal, setShowExerciseModal] = React.useState(false);

  const exercise_summaries =
    workout?.exercises.map((exercise) => {
      return {
        user_exercise_id: exercise.id,
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
        workout_id={workout_id}
        toggle={() => {
          setShowExerciseModal(false);
        }}
      />
    );
  }

  return (
    <>
      <Stack sx={{ width: "100%", height: "100%" }}>
        <Box
          className="exercises-title-bar"
          sx={{
            display: "flex",
            // border: "1px dashed white",
            justifyContent: "space-between",
            width: "100%",
            height: "max-content",
          }}
        >
          <Typography fontWeight={"light"}>Exercises</Typography>
          {showMore ? (
            <Link href="">
              <Typography
                fontWeight={"semi-bold"}
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
        <Stack
          spacing={"0.7rem"}
          sx={{ border: "2px solid white", height: "84vh" }}
        >
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

          <Stack
            spacing=".5rem"
            sx={{ py: "1rem", border: "1px dashed pink", overflow: "scroll" }}
          >
            {exercise_summaries.map((exercise, index) => {
              return (
                <SummaryCard workout_id={workout_id} exercise={exercise} isActive={true} key={index} />
              );
            })}
          </Stack>

          {workout?.exercises.length === 0 && (
            <Typography
              // component="body"
              sx={{
                fontSize: "1rem",
                fontWeight: "light",
                color: "text.secondary",
                width: "100%",
                display: "inline-block",
                height: "max-content",
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
