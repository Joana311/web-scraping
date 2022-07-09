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
import { UserExercsieCard, SummaryCardProps } from "./components/UserExerciseCard";
import AddNewExerciseModal from "./containers/AddNewExerciseModal";
import { Exercise } from "@prisma/client";
import superjson from "superjson";
import trpc from "@client/trpc";
interface ExerciseSummaryProps {
  onNewExerciseClick: () => void;
  workout_id: string;
}
const CurrentWorkoutExercises: React.FC<ExerciseSummaryProps> = ({
  workout_id,
  onNewExerciseClick,
}: ExerciseSummaryProps) => {
  const { data: workout } = trpc.useQuery(["workout.get_by_id", { workout_id: workout_id }], { enabled: !!workout_id }
  );
  const [showMore, toggleShowMore] = React.useState(false)
  const [currentFocus, setCurrentFocus] = React.useState(-1)
  const formatted_exercises =
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
  // console.log(currentFocus)
  useEffect(() => {
    formatted_exercises.length > 2
      ? toggleShowMore(true)
      : toggleShowMore(false);
  }, [formatted_exercises.length]);

  const borders = false;

  return (
    <>
      {/* <div className="h-max"> */}
      <div id="title-bar" className="mb-1 flex flex-row justify-between" >
        <h1 className='font-light'>Exercises</h1>
        {showMore &&
          <Link href="">
            <span
              className="pr-[.8em] text-[.9rem] font-semibold text-blue underline">
              view all
            </span>
          </Link>
        }
      </div>
      <ButtonBase
        onClick={onNewExerciseClick}
        sx={{
          borderRadius: 2,
          backgroundColor: "secondary.main",
          display: "flex",
          border: "1px solid white",
          width: "100%",
          minHeight: "max-content",
          // px: "1rem",
          py: ".2rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <a className="text-[.9rem] font-semibold">
          {"New Exercise"}
        </a>
      </ButtonBase>
      {/* </div> */}

      <section id="exercise-forms"
        className="flex flex-col space-y-2 overflow-scroll border-2 border-dashed border-pink-600 py-4"
      >
        {formatted_exercises.map((exercise, index) => {
          return (
            <UserExercsieCard
              index={index}
              key={index}
              workout_id={workout_id}
              exercise={exercise}
              isFocused={index === currentFocus}
              setCurrentFocus={setCurrentFocus}
            />
          );
        })}
      </section>

      {workout?.exercises.length === 0 && (
        <div
          className="text-[1rem] font-light text-text.secondary "
        >
          <span>{"No Exercises"}</span>
          <br />
          <span>{'Click "New Exercise" to get started.'}</span>
        </div>
      )}
    </>
  );
};

export default CurrentWorkoutExercises;
