import { useAppUser } from "@client/providers/app_user.test";
import trpc from "@client/trpc";
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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
interface RecentWorkoutsProps { }
const RecentWorkouts = () => {
  const isWorkoutOpen = React.useRef(false);
  const [todaysSessions, setTodaysSessions] = React.useState<{
    start: string;
    end: string | null;
    closed: boolean;
    exercises: number;
    sets: number;
    estimated_cals: string | number;
  }[]
  >([]);
  const [showMore, toggleShowMore] = React.useState(false);
  const [openWorkoutId, setOpenWorkoutId] = React.useState<
    String | undefined
  >();
  const session = useSession()
  const router = useRouter();
  const { data: open_workout } = trpc.useQuery(
    ["workout.get_current"],
    {
      // enabled: typeof window !== "undefined",
      refetchOnMount: false,
      onSuccess(open_workout) {
        if (!!open_workout) {
          isWorkoutOpen.current = true;
          setOpenWorkoutId(open_workout.id);
        }
      },
      ssr: false,
    }
  );
  const { data: recent_workouts, isError } = trpc.useQuery(["workout.get_recent", { amount: 3 }], {
    // enabled: typeof window == "undefined",
    ssr: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess(recent_workouts) {
      if (recent_workouts.length > 0) {
        const todays_workouts = recent_workouts.filter((w) =>
          dayjs(w.created_at).isSame(dayjs(), "day")
        );
        setTodaysSessions(todays_workouts.map(workoutToSession));
        recent_workouts.length > 2 && toggleShowMore(true);
      } else { isWorkoutOpen.current = false }
    },
  });
  type UserWorkoutWithExercises = NonNullable<typeof open_workout>
  const workoutToSession = React.useCallback(
    (workout: UserWorkoutWithExercises) => ({
      start: dayjs(workout.created_at).format("h:mmA"),
      end: workout.ended_at ? dayjs(workout.ended_at)?.format("h:mmA") : null,
      closed: workout.closed,
      exercises: workout.exercises.length,
      sets: workout.exercises
        .map((exercise) => {
          return exercise.sets ? exercise.sets.length : 0;
        })
        .reduce((a, b) => a + b, 0),
      estimated_cals: "N/A",
    }),
    [recent_workouts]
  );

  const leftSize = 7.5;
  const onClickNewOrCreate = () => {
    if (isWorkoutOpen.current) {
      router.push(router.asPath + `/workout/current`, router.asPath + `/workout/${openWorkoutId}`);
    } else {
      router.push(router.asPath + "/workout/new");
    }
  }
  const RecentWorkoutCard = (
    workout: {
      start: any;
      end: any;
      exercises: any;
      sets: any;
      estimated_cals: any;
    },
    index: React.Key | null | undefined
  ) => {
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
            height: "min-content",
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
          {todaysSessions.length ? (
            todaysSessions.map((workout, index) => {
              return RecentWorkoutCard(workout, index);
            })
          ) : (
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: "light",
                color: "text.secondary",
                width: "100%",
                display: "inline-block",
              }}
            >
              <span>{"No Workouts Found"}</span>
              <br />
              <span>{"Start a new one!"}</span>
            </Typography>
          )}

          <ButtonBase
            onClick={onClickNewOrCreate}
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
              {isWorkoutOpen.current ? "Continue Workout" : "New Workout"}
            </Typography>
          </ButtonBase>
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
