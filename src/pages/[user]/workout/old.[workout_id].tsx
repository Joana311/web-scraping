//ts-ignore
import { Stack, Box, Grid, Typography, Input } from "@mui/material";
import React, { useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import dayjs from "dayjs";
import ExerciseSummary from "../../../components/ExerciseSummary/ExerciseSummary";
import Link from "next/link";
import { Set as Prisma_Set, Exercise, PrismaClient } from "@prisma/client";
import {
  GetStaticProps,
  GetServerSideProps,
  NextPageContext,
  NextPage,
} from "next";
import { useAppUser } from "../../../client/context/app_user.test";
import { useRouter } from "next/router";
import trpc from "@client/trpc";

interface WorkoutPageProps {
  exercise_directory: Exercise[];
}

type Set = Omit<Prisma_Set, "id" | "updatedAt">;

const workout: NextPage<WorkoutPageProps> = ({
  exercise_directory,
}: WorkoutPageProps) => {
  let {
    query: { workout_id },
  } = useRouter();
  if (workout_id === "new") {
    const { data } = trpc.useMutation("workout.create", {
      onError(error, variables, context) {
        console.error(error);
        useRouter().push("/${user}#bad");
      },
    });
    workout_id = data?.id;
  }
  const [todaysDate, setTodaysDate] = React.useState(
    dayjs().format("dddd, MMM D")
  );

  // const workout_exercises = getAppUser().workouts?.find((workout) => {
  //   return workout.id === workout_id;
  // });
  let current_workout;

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
          {workout_exercises != undefined ? (
            <ExerciseSummary
              exrx_data={exercise_directory}
              workout_exercises={workout_exercises}
            />
          ) : (
            <>loading...</>
          )}
        </Box>
      </Box>
    </>
  );
};
workout.getInitialProps = async (ctx: NextPageContext) => {
  const exercise_directory = getExerciseDirectory();

  return {
    exercise_directory,
  };
};

export default workout;
// export const getServerSideProps = async (context: NextPageContext) => {
//   const exrx_data = prisma?.exercise.findMany();
//   let workout: UserWorkoutWithExercises | undefined = undefined;
//   console.group(
//     "Workout Page getServerSideProps, id: ",
//     context?.query?.workout_id
//   );
//   const current_workout = context.query.workout_id?.toString();
//   const user_name = context.query.user?.toString();

//   console.log("workout id: ", current_workout);
//   console.log("query params: ", context.query);
//   // remove this eventually
//   const user_id = (
//     await prisma?.user.findFirst({
//       where: {
//         name: context.query.user?.toString(),
//       },
//       select: {
//         id: true,
//       },
//     })
//   )?.id;
//   // move this log into trpc
//   if (current_workout) {
//     switch (true) {
//       case /new/.test(current_workout): {
//         try {
//           console.log("creating workout");
//           workout = await createWorkout(user_id);
//         } catch (error: any) {
//           console.log(error.message);
//           workout = error.workout ?? null;
//         }
//         break;
//       }
//       case /c(\S){24}/.test(current_workout): {
//         console.log(`finding workout -> ${current_workout}`);
//         workout = (await getWorkoutById(current_workout)) || undefined;
//         break;
//       }
//       default: {
//         workout = undefined;
//       }
//     }
//   }

//   if (!workout) {
//     console.log("no workout found, error adding new workout");
//     console.groupEnd();
//     return {
//       redirect: {
//         permanent: false,
//         destination: `/${user_name}#bad-request`,
//       },
//     };
//   } else {
//     console.log("workout found");
//     console.log(workout);

//     let exercise_directory = await exrx_data;
//     console.log(
//       "exercise_directory (first 5): ",
//       exercise_directory?.slice(0, 5)
//     );
//     console.groupEnd();
//     return {
//       props: {
//         exercise_directory,
//         current_workout: workout,
//       },
//     };
//   }
// };
