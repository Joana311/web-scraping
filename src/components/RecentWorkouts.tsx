
import trpc from "@client/trpc";
import {
  ButtonBase,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const RecentWorkouts = () => {
  const query_client = trpc.useContext();
  const [isWorkoutOpen, setIsWorkoutOpen] = React.useState(false);
  const [todaysSessions, setTodaysSessions] = React.useState<
    {
      start: string;
      end: string | null;
      closed: boolean;
      exercises: number;
      sets: number;
      estimated_cals: string | number;
      id: string;
    }[]
  >([]);
  const [showMore, toggleShowMore] = React.useState(false);
  const close_workout = trpc.useMutation("workout.close_by_id", {
    onSuccess: () => {
      // setOpenWorkoutId(undefined);
      query_client.invalidateQueries("workout.get_current");
      query_client.invalidateQueries("workout.get_recent");
    }
  })
  const delete_workout = trpc.useMutation("workout.delete_by_id", {
    onSuccess: () => {
      query_client.invalidateQueries("workout.get_recent");
    }
  })
  const router = useRouter();
  const create_workout = trpc.useMutation("workout.create_new", {
    onSuccess: (new_workout) => {
      router.push(router.asPath + `/workout/${new_workout.id}`)
      query_client.setQueryData(["workout.get_current"], {
        ...new_workout
      })
      query_client.invalidateQueries("workout.get_current");
      query_client.invalidateQueries("workout.get_recent");
    }
  })
  const { data: open_workout } = trpc.useQuery(["workout.get_current"], {
    // enabled: typeof window !== "undefined",
    refetchOnMount: true,
    onSuccess(open_workout) {
      if (!!open_workout) {
        setIsWorkoutOpen(true);
      } else {
        setIsWorkoutOpen(false);
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
          setIsWorkoutOpen(false);
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
      estimated_cals: "N/A",
      id: workout.id,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recent_workouts]
  );

  const onCreateNewWorkout = async () => {
    const data = await create_workout.mutateAsync();
    // router.push(router.asPath + `/workout/${data.id}`)
  }
  const onEndWorkout = (workout_id: string) => {
    let res = confirm("Are you sure you want to end this workout?");
    if (res) {
      close_workout.mutate({ workout_id });
    }
  }
  const onDeleteWorkout = (workout: ReturnType<typeof workoutToSession>) => {
    if (workout.exercises > 0 && workout.sets > 0) {
      let confirm_delete = confirm("This workout has data. Are you sure you want to delete it?");
      if (confirm_delete == false) {
        return
      }
    }
    delete_workout.mutate({ workout_id: workout.id, is_confirmed: true }, {
      onSuccess: () => {
        if (workout.id == open_workout?.id) {
          setIsWorkoutOpen(false);
        }
      }
    });
  }

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
      <ul id='recent-workout-cards' className='flex flex-col space-y-[.6rem] pb-[.6rem]'>
        {todaysSessions.length ? (
          todaysSessions.map((workout, index) => {
            return <WorkoutSummaryCard is_current={workout.id == open_workout?.id} workout={workout} onEndWorkout={onEndWorkout} onDeleteWorkout={onDeleteWorkout} key={index} />
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
      </ul>

      {!isWorkoutOpen &&
        <ButtonBase
          onClick={onCreateNewWorkout}
          sx={{
            borderRadius: 2,
            backgroundColor: "secondary.main",
            display: "flex",
            border: "1px solid white",
            width: "100%",
            height: "max-content",
            px: ".5rem",
            py: ".2rem",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <span className="text-[.9rem] font-semibold">
            {"New Workout"}
          </span>
        </ButtonBase>
      }
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
    id: string;
  },
  is_current: boolean;
  onEndWorkout: (workout_id: string) => void
  onDeleteWorkout: (workout: any) => void
}) => {
  const { workout, onEndWorkout, onDeleteWorkout, is_current } = props;
  const router = useRouter();
  const selfRef = React.useRef<HTMLLIElement>(null);
  return (
    <>
      <li id="summary-card-container"
        ref={selfRef}
        style={{
          // "-webkit-scrollbar": {
          //   display: "none",
          // },
          WebKitScrollBar: {
            display: "none",
          }
        } as React.CSSProperties}
        className="no-scrollbar relative flex h-[4rem] max-h-[4rem] snap-x snap-mandatory overflow-x-scroll scroll-smooth rounded-lg transition-all duration-[50]" >

        <Link id="summary-card-link"
          href={router.asPath + `/workout/${workout.id}`}>
          <section id="summary-info"
            onClick={() => {
              if (selfRef.current) {
                selfRef.current!.classList.add("pulse-size")
              }
            }}
            className={`flex min-w-full snap-start space-x-[1.25rem] rounded-lg bg-secondary px-2 ${is_current && "pulse-weak"}`}>
            <section id="workout-duration"
              className="flex items-center justify-center  border-pink-700">

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
                  {workout.end ?
                    <span className="text-xl font-light leading-tight">
                      {" "}
                      {workout.end}{" "}
                    </span> :
                    <CircularProgress color="inherit" size="1rem" thickness={5} />
                  }
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
                Cals: {workout.estimated_cals}
              </span>
            </section>
            <span id="double-chevron" className="absolute bottom-2 right-2 font-mono text-base font-light leading-none text-text.secondary opacity-80">
              {">>"}
            </span>

          </section>
        </Link>
        {is_current && <section id="additional-actions"
          className="ml-2 flex min-w-full snap-start snap-always justify-between rounded-lg bg-secondary px-4 py-1">
          <button id="delete-workout"
            onClick={() => onDeleteWorkout(workout)}
            className="flex items-center rounded-lg bg-red-700 px-2 text-[2.5rem]" >
            <DeleteIcon fontSize="inherit" /></button>
          <button id="end-workout"
            onClick={() => {
              selfRef.current && (selfRef.current.scrollLeft = 0)
              onEndWorkout(workout.id)
            }}
            type="button"
            className="
            rounded-full 
            bg-yellow-400/20 
            px-8
            font-extrabold
            text-yellow-400
            disabled:bg-gray-500 disabled:text-gray-300 disabled:opacity-20"
            disabled={!!workout.end}>

            Finish

          </button>
          {/* <button id="end-exercise"
            className="bg-green-900/20 rounded-full flex items-center px-2" >
            <span className="text-[2rem] flex items-center text-green-600"><ArrowForwardIcon fontSize="inherit" /></span>
          </button> */}
        </section>}
      </li>
    </>
  );
}


export default RecentWorkouts;
