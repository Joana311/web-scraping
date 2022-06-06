import { Stack, Box, Grid, Typography, Input } from "@mui/material";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import dayjs from "dayjs";
import ExerciseSummary from "../../../components/ExerciseSummary/ExerciseSummary";
import Link from "next/link";
import { Set as Prisma_Set, Exercise, PrismaClient } from "@prisma/client";
import { GetStaticProps, GetServerSideProps } from "next";
import prisma from "../../../../lib/prisma";
import createWorkout, {
  UserWorkoutWithExercises,
} from "../../../../lib/mutations/createWorkout";
import { getWorkoutById } from "../../../../lib/queries/getWorkouts";
interface WorkoutPageProps {
  exercise_directory: Exercise[];
  user_workout: UserWorkoutWithExercises;
}

type Set = Omit<Prisma_Set, "id" | "updatedAt">;

function workout({ exercise_directory, user_workout }: WorkoutPageProps) {
  const [todaysDate, setTodaysDate] = React.useState(
    dayjs().format("dddd, MMM D")
  );
  const [workout_exercises, setWorkoutExercises] =
    React.useState<typeof user_workout.exercises>(undefined);
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#000",
          height: "100vh",
          maxHeight: "100vh",
          pl: "1em",
          pr: "1em",
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden",
        }}
      >
        <Box
          className="nav-bar"
          sx={{
            marginTop: "1em",
            height: "5vh",
            backgroundColor: "#000",
          }}
        >
          <Grid
            container
            sx={{
              // border: "0.5px blue solid",
              justifyContent: "space-between",
            }}
          >
            <Grid
              item
              sx={{
                width: "max-content",
                // border: ".5px solid pink"
              }}
            >
              <span>
                <Typography
                  className="date"
                  color="text.secondary"
                  fontSize={".85rem"}
                  sx={{ pl: "0.2rem" }}
                >
                  {todaysDate}
                </Typography>
              </span>

              <Typography
                variant={"h4"}
                sx={{
                  mt: "-.55rem",
                  fontWeight: "light",
                  minHeight: "max-content",
                }}
              >
                Workout Report
              </Typography>
            </Grid>
            <Grid
              item
              container
              sx={{
                width: "max-content",
                // border: ".5px solid pink",
                alignItems: "center",
                mr: ".6em",
              }}
            >
              <Link as="/guest" href="/[user]">
                <AccountCircleIcon fontSize="large"></AccountCircleIcon>
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            // border: "1px dashed orange",
            mt: "2em",
            mb: ".25em",
            backgroundColor: "inherit",
            height: "100%",
            maxHeight: "100%",
            width: "100%",
          }}
        >
          <ExerciseSummary
            exrx_data={exercise_directory}
            exercises={workout_exercises}
          />
        </Box>
      </Box>
    </>
  );
}

export default workout;
export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  let workout: UserWorkoutWithExercises | undefined = null;
  // console.log(context);
  const active_workout_id = context.query.id?.toString();
  const user_name = context.query.user?.toString();
  // const active_workout_id = "1";
  console.log(active_workout_id);
  console.log(context.query);
  const user_id = (
    await prisma.user.findFirst({
      where: {
        name: context.query.user.toString(),
      },
      select: {
        id: true,
      },
    })
  )?.id;

  if (active_workout_id) {
    switch (true) {
      case /new/.test(active_workout_id): {
        try {
          console.log("creating workout");
          workout = await createWorkout(user_id);
        } catch (error) {
          console.log(error);
          workout = null;
        }
        break;
      }
      case /c(\S){24}/.test(active_workout_id): {
        console.log(`finding workout -> ${active_workout_id}`);
        workout = await getWorkoutById(active_workout_id);
        break;
      }
      default: {
        workout = null;
      }
    }
  }
  if (!workout) {
    console.log("no workout found, error adding new workout");
    return {
      redirect: {
        permanent: false,
        destination: `/${user_name}#bad-request`,
      },
    };
  }
  console.log(workout);
  const exercise_directory = await prisma.exercise.findMany();
  return {
    props: {
      exercise_directory: exercise_directory,
      current_workout: workout,
    },
  };
};
