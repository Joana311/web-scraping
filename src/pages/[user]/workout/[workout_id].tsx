import React from "react";
import { useRouter } from "next/router";
import trpcNextHooks from "@client/trpc";
import CurrentExercises from "src/components/ExerciseSummary/CurrentExercises";
import AddNewExerciseModal from "src/components/ExerciseSummary/containers/AddNewExerciseModal";
import { CancelIcon } from "src/components/SvgIcons";
import { ExerciseProvider } from "@client/providers/SearchContext";

const Workout = () => {
  const router = useRouter();
  const queryContext = trpcNextHooks.useContext()
  let { query: { workout_id, add_new } } = router;

  trpcNextHooks.workout.get_current.useQuery(undefined, { enabled: !queryContext.workout.get_current.getData()?.id})
  const { data: workout, isLoading: workout_isLoading } = 
    trpcNextHooks.workout.get_by_id.useQuery(
      { workout_id: workout_id as string },
      { onError(e) {
          queryContext.workout.get_current.invalidate();
          queryContext.workout.get_recent.invalidate();
      }}
    );
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    if (add_new) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
    return () => {
      setShowModal(false);
    }
  }, [add_new])

  const onNewExercise = () => {
    router.push(`/${router.query.user}/workout/${workout_id}?add_new=1`);
    // setShowModal(true);
  }
  const onCloseModal = () => {
    if (add_new) {
      router.back();
    }
  }

  const close_workout = trpcNextHooks.workout.close_by_id.useMutation({
    onSuccess: () => {
      queryContext.workout.get_current.invalidate();
      queryContext.workout.get_daily_recent.invalidate();
      queryContext.workout.get_by_id.invalidate();
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
    let current_workout_id = queryContext.workout.get_current.getData()?.id
    return workout_id === current_workout_id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout_id, queryContext.workout.get_current.getData()?.id]);

  if (showModal && isCurrentWorkout()) {
    return (
      <section id="modal container" className="flex grow flex-col overflow-y-hidden /border-4 border-blue">
        <button id="close-modal"
          onClick={onCloseModal}
          className="absolute top-1 right-0 rounded-md border border-red-800 bg-red-800/50 px-2 py-0.5 max-h-min flex items-center text-[.9rem] text-red-600">
          <span className="flex leading-none  ">
            close
          </span>
          <CancelIcon className="pl-1 pt-0.5 h-[.9rem] w-[.9rem]" type="solid" />
        </button>
        <ExerciseProvider>
          <AddNewExerciseModal
            // exercises={exercise_directory}
            workout_id={workout_id as string}
            close_modal={onCloseModal} />
        </ExerciseProvider>
      </section>
    );
  }
  return (
    <>
      <section id="workout-exercises"
        className="flex grow flex-col space-y-[.6rem] overflow-y-hidden text-clip /border-4 border-blue"
      >
        <div id="title-bar-and-end-button"
          className="mb-1 flex min-h-max flex-row items-center justify-between border-green-300" >
          <h1 className='font-light'>Exercises</h1>
          {workout && !workout.closed &&
            <button id="end-workout-button"
              disabled={workout?.exercises.length === 0}
              onClick={() => onEndWorkout()}
              className="flex h-min rounded-lg border-2 bg-card px-2 text-[.825rem] font-[1000] text-white disabled:border-none disabled:bg-gray-400 disabled:text-gray-500 disabled:opacity-50">
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