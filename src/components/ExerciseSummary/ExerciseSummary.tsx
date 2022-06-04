import React from "react";
import {
  Box,
  ButtonBase,
  colors,
  Grid,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { SummaryCard } from "./UserExerciseSummaryCard";
import AddExercise from "../../containers/AddExercise";
import { Exercise } from "@prisma/client";
interface ExerciseSummaryProps {
  exrx_data: Exercise[];
}
const ExerciseSummary = ({ exrx_data }: ExerciseSummaryProps) => {
  const [showMore, toggleShowMore] = React.useState(false);
  const [showExercise, toggleShowExercise] = React.useState(false);
  const exercises = [
    {
      name: "Bench Press",
      muscle: "Chest",
      variant: "Barbell",
      sets: [
        { weight: 45, reps: 8, rpe: 8 },
        { weight: 45, reps: 8, rpe: 8 },
        { weight: 45, reps: 9, rpe: 9 },
        { weight: 45, reps: 7, rpe: 10 },
      ],
    },
    {
      name: "Front Raise",
      muscle: "Deltoid",
      variant: "Dumbbell",
      sets: [
        { weight: 15, reps: 7, rpe: 8 },
        { weight: 15, reps: 7, rpe: 8 },
        { weight: 15, reps: 6, rpe: 9 },
        { weight: 15, reps: 7, rpe: 9 },
      ],
    },
  ];
  exercises.length > 2 && toggleShowMore(true);
  const borders = false;

  const addExercise = () => {
    toggleShowExercise(true);
  };
  if (showExercise) {
    return (
      <AddExercise 
        toggle={() => {
          toggleShowExercise(false);
        }}
        exercises={exrx_data}
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
          {exercises.map((exercise, index) => {
            return (
              <SummaryCard exercise={exercise} isActive={true} key={index} />
            );
          })}
        </Stack>
      </Stack>
    </>
  );
};

export default ExerciseSummary;
