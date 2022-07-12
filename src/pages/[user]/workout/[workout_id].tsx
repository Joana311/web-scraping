import { Stack, Box, Grid, Typography, Input } from "@mui/material";
import React from "react";
import { Set as Prisma_Set, Exercise, PrismaClient } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import trpc from "@client/trpc";
import CurrentExercises from "src/components/ExerciseSummary/CurrentExercises";
import { useSession } from "next-auth/react";
import AddNewExerciseModal from "src/components/ExerciseSummary/containers/AddNewExerciseModal";
import CancelIcon from '@mui/icons-material/Cancel';
const Workout = () => {
  const router = useRouter();
  const query_context = trpc.useContext()
  let { query: { workout_id } } = router;
  const mutationRef = React.useRef(false);
  const createWorkout = trpc.useMutation("workout.create_new", {
    ssr: false,
    onSuccess(new_workout) {
      router.replace({
        query: {
          ...router.query,
          workout_id: new_workout.id
        }
      });
    },
    onError(error, variables, context) {
      if (error.message.includes("already exists")) {
        query_context.invalidateQueries("workout.get_current");
        query_context.invalidateQueries("workout.get_recent");
        router.push(`/${router.query.user}`);

      }
    },
  });

  // createWorkout client side
  React.useEffect(() => {
    if (mutationRef.current) { return }
    if (workout_id === 'new' && typeof window !== "undefined") {
      console.log("creating workout")
      createWorkout.mutate();
      mutationRef.current = true;
    }
  }), [workout_id as string];

  const { data: workout, isFetching } = trpc.useQuery(["workout.get_by_id",
    { workout_id: workout_id as string }],
    {
      onError() {
        query_context.invalidateQueries("workout.get_current");
        query_context.invalidateQueries("workout.get_recent");
        router.push(`/${router.query.user}`);
      },
      enabled: workout_id !== "new",

    });

  const { data: exrx_data } = trpc.useQuery(["exercise.public.directory"],
    { ssr: false, suspense: true, refetchOnMount: false, refetchOnWindowFocus: false });
  const [showModal, setShowModal] = React.useState(false);
  const onNewExercise = React.useCallback(() => {
    setShowModal(true);
  }, [])
  if (showModal) {
    return (
      <>
        <button id="close-modal"
          onClick={() => setShowModal(false)}
          className="absolute top-1 right-0 rounded-lg bg-red-600 px-2 text-[.9rem]">
          {"close"}
          <CancelIcon className="pl-1" fontSize="inherit" />
        </button>
        <section id="new-exercise-modal" className="flex grow border-4 border-blue">
          <AddNewExerciseModal
            exercises={exrx_data}
            workout_id={workout_id as string}
            toggle={() => {
              setShowModal(false);
            }}
          />
        </section>
      </>
    );
  }
  return (
    <>
      <section
        id="workout-exercises"
        className="no-scrollbar flex grow flex-col space-y-[.6rem] border-4 border-blue"
      >
        {!!workout &&
          <CurrentExercises
            onNewExerciseClick={onNewExercise}
            workout_id={workout?.id! as string}
          />
        }
      </section>

    </>
  );
};
export default Workout;