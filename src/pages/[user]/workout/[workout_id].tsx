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
  let { query: { workout_id, add_new } } = router;
  console.log(router)

  trpc.useQuery(["workout.get_current"], { enabled: !query_context.getQueryData(["workout.get_current"])?.id })
  const { data: workout, isLoading: workout_isLoading } = trpc.useQuery(["workout.get_by_id",
    { workout_id: workout_id as string }],
    {
      onError() {
        query_context.invalidateQueries("workout.get_current");
        query_context.invalidateQueries("workout.get_recent");
        router.push(`/${router.query.user}`);
      },
    });
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    if (add_new) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [add_new])

  const { data: exercise_directory } = trpc.useQuery(["exercise.public.directory"], { ssr: false, suspense: true, refetchOnMount: false, refetchOnWindowFocus: false });

  const onNewExercise = () => {
    router.push(`/${router.query.user}/workout/${workout_id}?add_new=1`);
    // setShowModal(true);
  }
  const onCloseModal = () => {
    if (add_new) {
      router.back();
    }
  }

  const close_workout = trpc.useMutation("workout.close_by_id", {
    onSuccess: () => {
      query_context.invalidateQueries("workout.get_current");
      query_context.invalidateQueries("workout.get_recent");
      query_context.invalidateQueries("workout.get_by_id");
      router.push(`/${router.query.user}`);
    }
  })
  const onEndWorkout = () => {
    let res = confirm("Are you sure you want to end this workout?");
    if (res) {
      close_workout.mutate({ workout_id: (workout?.id) || "" });
    }
  }
  const isCurrentWorkout = React.useCallback(() => {
    let current_workout_id = query_context.getQueryData(["workout.get_current"])?.id
    // console.log(`get_current-id: ${current_workout_id}, page-query-id: ${workout_id}, test: ${current_workout_id === workout_id}`);
    return workout_id === current_workout_id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout_id, query_context.getQueryData(["workout.get_current"])?.id]);

  if (showModal && isCurrentWorkout()) {
    return (
      <section id="modal container" className="flex grow flex-col overflow-y-hidden">
        <button id="close-modal"
          onClick={onCloseModal}
          className="absolute top-1 right-0 rounded-lg bg-red-600 px-2 text-[.9rem]">
          {"close"}
          <CancelIcon className="pl-1" fontSize="inherit" />
        </button>
        <AddNewExerciseModal
          exercises={exercise_directory}
          workout_id={workout_id as string}
          close_modal={onCloseModal}
        />
      </section>
    );
  }
  return (
    <>
      {/* {!workout?.closed &&
        <div className="absolute top-[.3rem] flex w-full justify-start">
          <button id="end-workout"
            onClick={() => onEndWorkout()}
            className="relative rounded-lg  bg-yellow-500/20  border border-yellow-500 text-yellow-400  px-2 text-[.9rem]">
            {"Finish Workout"}
          </button>
        </div >} */}
      <section id="workout-exercises"
        className="flex grow flex-col space-y-[.6rem] overflow-y-hidden text-clip border-blue"
      >
        <div id="title-bar-and-end-button"
          className="mb-1 flex min-h-max flex-row items-center justify-between border-green-300" >
          <h1 className='font-light'>Exercises</h1>
          {!workout?.closed &&
            <button id="end-workout-button"
              disabled={workout?.exercises.length === 0}
              onClick={() => onEndWorkout()}
              className="flex h-min rounded-lg border-2 bg-secondary px-2 text-[.825rem] font-[1000] text-white disabled:border-none disabled:bg-gray-400 disabled:text-gray-500 disabled:opacity-50">
              {"End Workout"}
            </button>}
        </div>
        {workout?.exercises.length === 0 && !workout_isLoading &&
          <div id="no-exercises-tip" className="text-[1rem] font-light text-text.secondary ">
            <p>No exercises added. <br />Click <span className="text-white">"New Exercise"</span> to get started.</p>
            <p> When finished click the <span className="text-white">"End Workout"</span> button.</p>
          </div>
        }
        {
          !!workout &&
          <CurrentExercises
            onNewExerciseClick={onNewExercise}
            workout_id={workout?.id! as string}
            is_current={isCurrentWorkout()}
          />
        }
      </section>
    </>
  );
};
export default Workout;