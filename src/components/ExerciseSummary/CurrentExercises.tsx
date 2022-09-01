import React, { useEffect } from "react";
import { UserExerciseCard } from "./components/UserExerciseCard";

import trpc from "@client/trpc";
interface ExerciseSummaryProps {
  onNewExerciseClick: () => void;
  workout_id: string;
  is_current: boolean;
}
const CurrentExercises: React.FC<ExerciseSummaryProps> = ({
  workout_id,
  onNewExerciseClick,
  is_current,
}: ExerciseSummaryProps) => {
  const { data: workout, isLoading: workout_isLoading } = trpc.useQuery(["workout.get_by_id", { workout_id: workout_id }], { enabled: !!workout_id }
  );
  const [showMore, toggleShowMore] = React.useState(false)
  const [currentFocus, setCurrentFocus] = React.useState(-1)
  const formatted_exercises = React.useMemo(() =>
    workout?.exercises.map((exercise) => {
      return {
        user_exercise_id: exercise.id,
        name: exercise.exercise.name,
        muscle: exercise.exercise.muscle_name,
        variant: exercise.exercise.equipment_name,
        sets: exercise.sets.map((set) => {
          return {
            id: set.id,
            weight: set.weight,
            reps: set.reps,
            rpe: set.rpe,
          };
        }),
      };
    }) || []
    , [workout?.exercises])
  useEffect(() => {
    formatted_exercises.length > 2
      ? toggleShowMore(true)
      : toggleShowMore(false);
  }, [formatted_exercises.length]);

  const borders = false;

  return (
    <>
      {is_current &&
        <button className="border rounded-lg ripple-bg-white text-black text-[1rem] font-extrabold w-[90%] mx-auto"
          onClick={onNewExerciseClick}>
          {"+ New Exercise"}
        </button>}

      <section id="user-exercise-list"
        className="no-scrollbar relative flex grow snap-y flex-col space-y-4 overflow-y-scroll border-dashed border-pink-600 pt-4"
      >
        {formatted_exercises.reverse().map((exercise, index) => {
          return (
            <UserExerciseCard
              index={index}
              key={exercise.user_exercise_id}
              workout_id={workout_id}
              exercise={exercise}
              isFocused={index === currentFocus}
              is_current={is_current}
              setCurrentFocus={setCurrentFocus}
            />
          );
        })}
        <div className={`sticky ${formatted_exercises.length == 0 && "hidden"} pointer-events-none bottom-0 min-h-[5rem] bg-gradient-to-t from-black to-transparent`}></div>
      </section>
    </>
  );
};

export default CurrentExercises;
