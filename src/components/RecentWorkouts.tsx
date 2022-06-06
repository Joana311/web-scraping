import {
  Box,
  colors,
  Grid,
  Stack,
  Typography,
  Button,
  ButtonBase,
  CircularProgress,
  SxProps,
} from "@mui/material";
import { Exercise, UserExercise } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { UserWorkoutWithExercises } from "../../lib/mutations/createWorkout";
interface RecentWorkoutsProps {
  recentWorkouts: UserWorkoutWithExercises[];
}
const RecentWorkouts = ({ recentWorkouts }: RecentWorkoutsProps) => {
  const [showMore, toggleShowMore] = React.useState(false);
  const [openWorkoutId, setOpenWorkoutId] = React.useState<string>(null);
  const [todaysWorkouts, setTodaysWorkouts] =
    React.useState<UserWorkoutWithExercises[]>();

  // find todays workouts
  React.useEffect(() => {
    const predicate = (workout: UserWorkoutWithExercises) => {
      return dayjs().isSame(dayjs(workout.createdAt), "day");
    };
    // partition the workouts into those that are today and those that are not
    const [todays_sessions, previous_sessions] = recentWorkouts.reduce(
      (
        results: UserWorkoutWithExercises[][],
        workout: UserWorkoutWithExercises
      ) => (results[+!predicate(workout)].push(workout), results),
      [[], []]
    );

    // find the first open workout if exists
    todays_sessions.find((workout) => {
      if (workout.endedAt === null) {
        setOpenWorkoutId(workout.id);
        console.log("found open workout", workout);
        return true;
      }
    });
  }, [recentWorkouts]);

  const w1 = {
    start: "8:00AM",
    end: "10:00AM",
    exercises: 8,
    sets: 36,
    estimated_cals: 1000,
  };
  let w2 = null;
  try {
    w2 = {
      start: dayjs(recentWorkouts[0].createdAt).format("h:mmA"),
      end: recentWorkouts[0].endedAt
        ? dayjs(recentWorkouts[0].endedAt)?.format("h:mmA")
        : null,
      exercises: recentWorkouts[0].exercises.length,
      sets: (recentWorkouts[0].exercises as Array<any>).reduce(
        (num_sets: number, exercise) => {
          return num_sets + exercise.sets.length;
        },
        [, 0]
      ),
      estimated_cals: "N/A",
    };
  } catch (error) {
    // console.log(error);
  }

  const leftSize = 7.5;
  const workouts = [w1];
  w2 && workouts.push(w2);
  workouts.length > 2 && toggleShowMore(true);

  const RecentWorkoutCard = (workout, index) => {
    return (
      <>
        <Box
          key={index}
          bgcolor="secondary.main"
          borderRadius={2}
          sx={{
            display: "flex",
            // border: "1px dashed white",
            width: "100%",
            pl: ".5rem",
            pr: ".5rem",
            height: "max-content",
          }}
        >
          <Grid container>
            <Grid
              item
              className="workout-summary-leftHand-container"
              xs={leftSize}
              sx={{
                // border: "1px solid pink",
                width: "100%",
                height: "100%",
              }}
            >
              <Stack
                className="time-summary-container"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "start",
                  alignItems: "end",
                  pb: ".3rem",
                  width: "100%",
                  height: "100%",
                  // border: "1px solid yellow",
                }}
              >
                <Box className="start-time-container" sx={timeContainerProps}>
                  <Stack sx={timeStackInnerContainerProps}>
                    <Typography sx={timeHeaderProps}> Start </Typography>
                    <Typography sx={timeValueTextProps}>
                      {" "}
                      {workout.start}{" "}
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    mt: "1rem",
                    mx: ".6rem",
                    // border: "1px solid blue",
                    width: "min-content",
                    height: "min-content",
                  }}
                >
                  <Typography variant="h6" width={"max-content"}>
                    -
                  </Typography>
                </Box>
                <Box className="stop-time-container" sx={timeContainerProps}>
                  <Stack sx={timeStackInnerContainerProps}>
                    <Typography sx={timeHeaderProps}> Stop </Typography>
                    <Typography sx={timeValueTextProps}>
                      {workout.end ?? (
                        <CircularProgress size="1rem" thickness={5} />
                      )}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            <Grid
              item
              component={Box}
              xs={12 - leftSize}
              sx={{
                display: "flex",
                justifyContent: "start",
                // border: "1px solid green",
              }}
            >
              <Stack
                spacing="-0.2rem"
                sx={{
                  paddingTop: ".2rem",
                  //   border: "1px dashed red",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontSize: ".85rem" }}>
                  Exercises: {workout.exercises}
                </Typography>
                <Typography sx={{ fontSize: ".85rem" }}>
                  Sets: {workout.sets}
                </Typography>
                <Typography sx={{ fontSize: ".85rem" }}>
                  Cals Burned: {workout.estimated_cals}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };
  // console.log(useRouter());
  return (
    <>
      <Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography fontWeight={"light"}>Today's Workouts</Typography>
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
        <Stack spacing={"0.5rem"}>
          {workouts.map((workout, index) => {
            return RecentWorkoutCard(workout, index);
          })}
          <Link
            href={`${useRouter().query.user}/workout?id=${
              openWorkoutId ? openWorkoutId : "new"
            }`}
          >
            <ButtonBase
              sx={{
                borderRadius: 2,
                backgroundColor: "secondary.main",
                display: "flex",
                border: "1px solid white",
                width: "100%",
                px: ".5rem",
                py: ".2rem",
                height: "max-content",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography fontWeight={"semi-bold"} fontSize=".9rem">
                {openWorkoutId ? "Continue Workout" : "New Workout"}
              </Typography>
            </ButtonBase>
          </Link>
        </Stack>
      </Stack>
    </>
  );
};
const timeHeaderProps: SxProps = {
  fontSize: ".8rem",
  fontWeight: "regular",
  color: "text.secondary",
  alignSelf: "center",
  maxWidth: "max-content",
  minHeight: "max-content",
};
const timeContainerProps: SxProps = {
  height: "max-content",
  minWidth: "5.5rem",
  // border: "1px solid red",
};
const timeValueTextProps: SxProps = {
  mt: "-.4rem",
  fontWeight: "light",
  fontSize: "1.25rem",
  width: "max-content",
  height: "fill-available",
  alignSelf: "center",
  "& .MuiCircularProgress-svg": {
    color: "text.primary",
  },
};
const timeStackInnerContainerProps: SxProps = {
  // border: "1px dashed orange",
};
export default RecentWorkouts;
