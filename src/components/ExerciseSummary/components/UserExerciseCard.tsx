import trpcNextHooks from "@client/trpc";
import trpcReactQueryClient from "@client/trpc";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { TrashIcon, BackSpaceIcon, ChevronRight } from "src/components/SvgIcons";

//create a props interface for exercises that will be passed in from ExerciseSummary.tsx
export interface SummaryCardProps {
  exercise: {
    user_exercise_id: number;
    exercise_id: string;
    name: string;
    variant: string | null;
    muscle: string | null;
    sets: {
      id: number;
      weight?: number | null;
      reps: number;
      rpe: number;
    }[];
  };
  isFocused: boolean;
  index: number;
  workout_id: string;
  is_current: boolean;
  setCurrentFocus: React.Dispatch<React.SetStateAction<number>>;
}

export const UserExerciseCard: React.FC<SummaryCardProps> = ({ exercise, isFocused, setCurrentFocus, index, workout_id, is_current: is_open }) => {
  const [expanded, setExpanded] = React.useState(false);
  const onExpand = () => {
    if (expanded) {
      setCurrentFocus(-1)
      setExpanded(false);
    } else {
      setExpanded(true);
      setCurrentFocus(index)
    }
  };

  React.useMemo(() => {
    setExpanded(isFocused);
  }, [isFocused]);
  const userName = trpcReactQueryClient.useContext().next_auth.get_session.getData()?.user.name;
  const router = useRouter();
  // debugger;
  const selfRef = React.useRef<HTMLLIElement>(null);
  const query_context = trpcNextHooks.useContext();
  const useAddSet = trpcNextHooks.exercise.add_set.useMutation({
    onSuccess: (current_workout, _) => {
      console.log("current workout: ", current_workout);
      console.log("selfRef: ", selfRef.current)
      // console.log(selfRef.current)
      console.log("unknown ", _);
      // selfRef.current?.remove();
        query_context.workout.get_by_id.setData({ workout_id: workout_id }, current_workout);
      },
  });
  const useDeleteSet = trpcReactQueryClient.exercise.remove_set.useMutation({
    onSuccess: (current_workout, _) => {
      query_context.workout.get_by_id.setData({ workout_id: workout_id }, current_workout);
    },
  });
  const useRemoveEx = trpcReactQueryClient.exercise.remove_from_current_workout.useMutation({
    onSuccess(updated_workout) {
      query_context.workout.get_by_id.invalidate();
      if (workout_id) {
        query_context.workout.get_by_id.setData({ workout_id }, updated_workout);
      }
    },
  })
  const set = React.useRef({
    weight: 0,
    reps: 0,
    rpe: 0
  });
  const onAddSet = React.useCallback(() => {
    console.log("add set");
    useAddSet.mutate({
      set: set.current,
      user_exercise_id: exercise.user_exercise_id,
      workout_id: workout_id,
    });
  }, [useAddSet, exercise.user_exercise_id, workout_id]);
  const onDeleteSet = React.useCallback((set_id: number) => {
    useDeleteSet.mutate({
      set_id: set_id,
      user_exercise_id: exercise.user_exercise_id,
      workout_id: workout_id,
    });
  }, [exercise.user_exercise_id, useDeleteSet, workout_id]);

  const dbRemove = React.useCallback(() => {
    useRemoveEx.mutate({ user_exercise_id: exercise.user_exercise_id })
  }, [exercise.user_exercise_id, useRemoveEx]);
  const onDeleteExercise = React.useCallback(() => {
    if (!selfRef.current) return;
    // selfRef.current.scrollLeft = 0;
    selfRef.current.classList.add("-translate-x-[100vw]");
    selfRef.current.ontransitionend = () => {
      useRemoveEx.mutate({ user_exercise_id: exercise.user_exercise_id });
      // dbRemove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbRemove]);
  const dividerRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <li id={`card-container-${exercise.user_exercise_id}`}
        ref={selfRef}
        // eslint-disable-next-line
        className="
        flex-shrink-0
        no-scrollbar
        flex
        snap-start
        snap-x
        overflow-y-hidden
        overflow-x-scroll
        scroll-smooth
        space-x-2
        rounded-lg border-yellow-500 
        shadow-md transition-all duration-[450] ease-out
        will-change-scroll"
      >
        <div id="exercise-card"
          className="flex min-w-full
          snap-start 
          flex-col
          rounded-lg
        bg-card">

          <section id="overview-container"
            onClick={onExpand}
            className="mx-3 flex justify-between space-x-[1rem] py-1 capitalize">
            <div id="overview-info" className="w-min">
              <div
                id="exercise-name"
                className="flex flex-col border-red-500 ">
                <label className="text-[.8rem] leading-none text-text.secondary">Exercise</label>
                {/* <Link href={`../..//pages/${userName}/exercise/${exercise.exercise_id}`} > */}
                <Link href={expanded ? `../../${userName}/exercise/${exercise.exercise_id}` : '#'} >
                  <span className={`text-xl leading-none text-theme max-w-[21ch] underline ${!expanded && "no-underline truncate"}`}
                    onClick={(e) => {
                      if (expanded) {
                        e.stopPropagation();
                      }
                    }} >
                    {exercise.name}
                  </span>
                </Link>
              </div>
              <div id="additional-info" className="flex justify-between pt-[.2rem]">
                <div
                  id="exercise-variant"
                  className="flex flex-col border-yellow-500 leading-snug">
                  <label className="text-[.6rem] text-text.secondary">Variant</label>
                  <span className={`w-[12ch] overflow-hidden text-ellipsis text-[1rem] font-light leading-none ${!expanded && "whitespace-nowrap"}`}>
                    {exercise.variant}
                  </span>
                </div>
                <div id="target-muscle"
                  className="flex flex-col flex-nowrap border-green-500 leading-snug">
                  <label className="text-[.6rem] text-text.secondary">Muscle</label>
                  <span className={`w-[15ch] overflow-hidden text-ellipsis text-[1rem] font-light leading-none ${!expanded && "whitespace-nowrap"}`}>
                    {exercise.muscle}
                  </span>
                </div>
              </div>
            </div>
            <div id="set-count"
              className="flex flex-col items-center border-blue">
              <label className="text-[1rem] text-text.secondary">Sets</label>
              <span className='text-[1.5rem]'>
                {exercise.sets.length}
              </span>
            </div>
            <div id="expand-icon-container"
              className="flex items-center border-violet-700">
              <div className={`flex`}
              >
                <ChevronRight className={`rotate 0 ${expanded && "rotate-90"} transition-all ease-in duration-[450]  h-6`} />
              </div>
            </div>
          </section>
          <div ref={dividerRef} id="exercise-set-details"
            className={` text-white  ${expanded ? `max-h-[25rem]` : "max-h-0"} transition-all  duration-900`}>
            <div className="h-[1px] bg-text.secondary" />
            <div className="mx-2 max-h-min">
              <table className='w-full /border-4 border-lime-500 overflow-y-scroll'>
                <thead>
                  <tr>
                    <th className="/border text-center">Set</th>
                    <th className="/border text-center">Weight</th>
                    <th className="/border text-center">Reps</th>
                    <th className="/border text-center">RPE</th>
                    <th className="" />
                  </tr>
                </thead>
                <tbody className="relative /border-2 border-dashed border-blue mx-4">
                  {exercise.sets.map((set, index) => (
                    <tr className={`z-0 /border border-y-[8px] border-transparent font-semibold text-[1rem] ${"odd:bg-secondary-dark"}`} key={index}>
                      <td className="text-center ">{index + 1}</td>
                      <td className="text-center ">{set.weight}</td>
                      <td className="text-center ">{set.reps}</td>
                      <td className="text-center ">{set.rpe}</td>
                      {is_open &&
                        <button disabled={useDeleteSet.isLoading && useDeleteSet.variables?.set_id === set.id} onClick={() => { onDeleteSet(set.id) }} className="absolute h-min right-3 md:right-10 px-1 py-[.1rem] align-middle  md:px-4 items-center /border border-blue group">
                          <BackSpaceIcon
                            className="relative h-5 w-5 text-red-700/70 group-disabled:text-gray-600/60" />
                        </button>
                      }
                    </tr>
                  ))}
                  <tr className="h-[6px]">
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                </tbody>
                <tfoot className="border-t-text.secondary border border-x-0 border-b-0">
                  {is_open &&
                    <>
                      <tr className="h-[6px]">
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                      <tr className="">
                        <td className="text-center font-extrabold">
                          {exercise.sets.length + 1}
                        </td>
                        <td className="items-center">
                          <fieldset id='input-field' className="relative mx-auto mb-1 flex w-max">
                            <input id='weight-input'
                              className='peer
                                  font-semibold
                                  pb-1
                                  outline-none
                                  focus:border-white
                                  border-2 border-text.secondary
                                  bg-secondary
                                  pt-1.5
                                  pl-2
                                  rounded-md
                                  mt-1.5 w-[8.5ch]'
                              maxLength={5}
                              type="number"
                              inputMode="decimal"
                              onChange={(e) =>
                                (set.current.weight = parseInt(e.target.value))
                              } />
                            <label htmlFor="weight-input"
                              className="absolute 
                                    text-[.75rem] 
                                    tracking-[.01rem] leading-none
                                    text-text.secondary
                                    pl-1
                                    left-[9px]
                                    pr-1
                                    font-[300]
                                    focus:text-text.primary
                                    active:text-text.primary
                                  bg-secondary peer-focus:text-text.primary">
                              Weight(s)
                            </label>
                          </fieldset>
                        </td>
                        <td className="items-center">
                          <fieldset id='input-field' className="relative mx-auto mb-1 flex w-max">
                            <input id='rep-input'
                              className='peer font-semibold outline-none pb-1 focus:border-white border-2 border-text.secondary bg-secondary pt-1.5 pl-2 rounded-md mt-1.5 w-[8.5ch]'
                              maxLength={5}
                              type="number"
                              inputMode="numeric"
                              onChange={(e) =>
                                (set.current.reps = parseInt(e.target.value))
                              } />
                            <label
                              htmlFor="rep-input"
                              className="absolute 
                                    text-[.75rem] 
                                    tracking-[.01rem] leading-none
                                    text-text.secondary
                                    pl-1
                                    left-[9px]
                                    pr-1
                                    font-[300]
                                    focus:text-text.primary
                                    active:text-text.primary
                                  bg-secondary peer-focus:text-text.primary">
                              Reps
                            </label>
                          </fieldset>

                        </td>
                        <td className="items-center">
                          <fieldset id='input-field' className="relative mx-auto mb-1 flex w-max">
                            <input id='rpe-input'
                              className={`peer
                                  font-semibold
                                  pb-1
                                  outline-none
                                  focus:border-white
                                  border-2 border-text.secondary
                                  bg-secondary
                                  pt-1.5
                                  pl-2
                                  rounded-md
                                  mt-1.5 w-[8.5ch]
`}
                              type="number"
                              inputMode="numeric"
                              maxLength={5}
                              max={11}
                              onChange={(e) => {
                                const rpe_value = parseInt(e.target.value)
                                if (rpe_value > 11) {
                                  e.target.classList.add("text-red-500", "focus:border-red-500")
                                } else {
                                  e.target.classList.remove("text-red-500", "focus:border-red-500")
                                }
                                set.current.rpe = rpe_value
                              }

                              } />
                            <label htmlFor="rpe-input"
                              className="absolute 
                                    text-[.75rem] 
                                    tracking-[.01rem] leading-none
                                    text-text.secondary
                                    pl-1
                                    left-[9px]
                                    pr-1
                                    font-[300]
                                    focus:text-text.primary
                                    active:text-text.primary
                                  bg-secondary peer-focus:text-text.primary">
                              RPE
                            </label>
                          </fieldset>
                        </td>
                        <td />
                      </tr>
                    </>}
                </tfoot>
              </table>

            </div>
            {is_open &&
              <button id="add-set-button" disabled={exercise.sets.length == 8 || useAddSet.isLoading} className='rounded-b-lg w-full border-2 border-white py-1 text-[1rem] font-bold h-min disabled:button-disabled'
                onClick={() => {
                  onAddSet()
                }}>
                Add Set
              </button>}
          </div>
        </div>
        {is_open &&
          <div id="button-container"
            className={`my-2 flex snap-end items-stretch rounded-lg bg-red-700/70 transition-all /border border-white ${(expanded) && "hidden"}`}>
            <button id="remove-exercise-button"
              className="text-[2.5rem] px-2 items-center justify-center flex"
              onClick={onDeleteExercise}>
              <TrashIcon className="w-[2.5rem] h-[2.5rem] text-red-600" />
            </button>
          </div>}
      </li>
    </>
  );
};

