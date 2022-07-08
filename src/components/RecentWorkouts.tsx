
import trpc from "@client/trpc";
import {
  ButtonBase,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const RecentWorkouts = () => {
  const isWorkoutOpen = React.useRef(false);
  const [todaysSessions, setTodaysSessions] = React.useState<
    {
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
  const router = useRouter();
  const { data: open_workout } = trpc.useQuery(["workout.get_current"], {
    // enabled: typeof window !== "undefined",
    refetchOnMount: false,
    onSuccess(open_workout) {
      if (!!open_workout) {
        isWorkoutOpen.current = true;
        setOpenWorkoutId(open_workout.id);
      }
    },
    ssr: false
  });
  const { data: recent_workouts, isError } = trpc.useQuery(
    ["workout.get_recent", { amount: 3 }],
    {
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
        } else {
          isWorkoutOpen.current = false;
        }
      }
    }
  );

  type UserWorkoutWithExercises = NonNullable<typeof open_workout>;
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
      estimated_cals: "N/A"
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recent_workouts]
  );

  const continue_or_create = () => {
    if (isWorkoutOpen.current) {
      router.push(
        router.asPath + `/workout/current`,
        router.asPath + `/workout/${openWorkoutId}`
      );
    } else {
      router.push(router.asPath + "/workout/new");
    }
  };

  return (
    <>
      <h1 id='recent-workouts-header' className="flex justify-between">
        <span className="font-light">Today's Workouts</span>
        {showMore && (
          <Link
            href={{
              pathname: "./[user]/workout/history",
              query: { user: router.query.user }
            }}
          >
            <a className="text-[.8rem] font-semibold text-blue underline">
              view all
            </a>
          </Link>
        )}
      </h1>
      <div id='recent-workout-cards' className='flex flex-col space-y-[.6rem] pb-[.6rem]'>
        {todaysSessions.length ? (
          todaysSessions.map((workout, index) => {
            return <WorkoutSummaryCard workout={workout} key={index} />
          })
        ) : (
          <div id='no-workout-notifier'
            className="text-[1rem] font-light text-text.secondary"
          >
            <span>{"No Workouts Found"}</span>
            <br />
            <span>{"Start a new one!"}</span>
          </div>
        )}
      </div>

      <ButtonBase
        onClick={continue_or_create}
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
          alignItems: "center"
        }}
      >
        <span className="text-[.9rem] font-semibold">
          {isWorkoutOpen.current ? "Continue Workout" : "New Workout"}
        </span>
      </ButtonBase>
    </>
  );
};

const WorkoutSummaryCard = (props: {
  workout: {
    start: any;
    end: any;
    exercises: any;
    sets: any;
    estimated_cals: any;
  },
}) => {
  const { workout } = props;
  return (
    <>
      <li
        id="summary-card"
        className="flex h-[4rem] space-x-[1.25rem] rounded-lg bg-secondary px-2">
        <section id="workout-duration"
          className="flex items-center justify-center  border-pink-700 ">

          <div id='start-time' className="flex w-[5.5rem] flex-col items-center ">
            <span className="text-[.8rem] text-text.secondary"> Start</span>
            <span className="text-xl font-light leading-tight">
              {" "}
              {workout.start}{" "}
            </span>
          </div>
          <span className="mx-[.7rem] mt-3 text-2xl">
            -
          </span>
          <div id='end-time' className="flex w-[5.5rem] flex-col items-center ">
            <span className="text-[.8rem] text-text.secondary"> Stop</span>
            <span className="text-xl font-light leading-tight text-text.primary">
              {workout.end ?? (
                <CircularProgress color="inherit" size="1rem" thickness={5} />
              )}
            </span>
          </div>

        </section>
        <section id='workout-info'
          className="flex flex-col items-start justify-center text-[.85rem] leading-4">
          <span>
            Exercises: {workout.exercises}
          </span>
          <span>
            Sets: {workout.sets}
          </span>
          <span>
            Cals Burned: {workout.estimated_cals}
          </span>
        </section>
      </li>
    </>
  );
}


export default RecentWorkouts;
