import React from "react";
import { UserExerciseCard } from "./components/UserExerciseCard";
import trpcNextHooks from "@client/trpc";
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
  
  const { data: workout, isLoading: workout_isLoading } = trpcNextHooks.workout.get_by_id.useQuery(
    { workout_id: workout_id },
    { enabled: !!workout_id }
  );
  const [currentFocus, setCurrentFocus] = React.useState(-1)
  const formatted_exercises = React.useMemo(() =>
    workout?.exercises
      .sort((a, b) => b.id - a.id)
      .map((exercise) => {
        return {
          user_exercise_id: exercise.id,
          exercise_id: exercise.exercise_id,
          name: exercise.exercise.name,
          muscle: exercise.exercise.muscle_name,
          variant: exercise.exercise.equipment_name,
          sets: exercise.sets
            .map((set) => {
              return {
                id: set.id,
                weight: set.weight,
                reps: set.reps,
                rpe: set.rpe,
              };
            }),
        };
      }) || [], [workout?.exercises])

  const scrollListRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      {is_current &&
        <button className=" rounded-lg bg-theme min-h-max text-white text-[1rem] font-extrabold w-[90%] mx-auto"
          onClick={onNewExerciseClick}>
          {"+ New Exercise"}
        </button>}

      <section id="user-exercise-list"
        ref={scrollListRef}
        className="no-scrollbar relative flex grow snap-y snap-mandatory flex-col space-y-4 overflow-y-scroll /border-2 border-dashed border-pink-600 pt-4"
        onScroll={(e: any) => {
          if (e.target.scrollTop > 0) {
            document.getElementById("scroll-notifier")?.classList.add("text-gray-300/0")
          } else {
            if (e.target.scrollTop === 0) {
              // e.stopPropagation();
            }
            document.getElementById("scroll-notifier")?.classList.remove("text-gray-300/0")
          }
        }}
      >
        {formatted_exercises.map((exercise, index) => {
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
        <div className={`sticky ${formatted_exercises.length == 0 && "hidden"} pointer-events-none bottom-0 min-h-[5rem] bg-gradient-to-t from-black to-transparent flex items-center justify-center`}>
          {/* <div id='scroll-notifier'
            hidden={!!scrollListRef.current && scrollListRef.current?.scrollHeight <= scrollListRef.current?.clientHeight}
            className="transition-all duration-250 ease-in -rotate-90 h-min w-min text-[2.5rem] text-gray-300/50 animate-pulse"><ChevronLeftRounded fontSize="inherit" />
          </div>
          {scrollListRef.current?.scrollHeight} +
          {scrollListRef.current?.offsetHeight} +
          {scrollListRef.current?.scrollTop} */}
        </div>
      </section>
    </>
  );
};

export default CurrentExercises;
