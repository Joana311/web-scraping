import { InfoIcon } from "../../SvgIcons"
import Link from "next/link";
import React from "react";
import { Exercise } from "@prisma/client";
import { useRouter, withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";
import trpcNextHooks from "@client/trpc";
import SearchBar from 'src/components/SearchBar';
import { useExerciseDirectory, useSearchFilters, useSearchQuery } from '@client/providers/SearchContext';


interface AddExerciseProps {
  exercises?: Exercise[];
  workout_id: string;
  close_modal?: () => void;
}

const filters = {
  exercise_mechanics: [
    "push",
    "pull"
  ],
  exercise_equipment: [
    'assisted',
    'lever',
    'barbell',
    'body weight',
    'cable',
    'dumbbell',
    'sled',
    'smith',
  ]
}

const AddNewExerciseModal = ({

  close_modal,
}: AddExerciseProps & WithRouterProps) => {
  const queryContext = trpcNextHooks.useContext()
  const router = useRouter()
  const workout_id = router.query.workout_id! as string;

  const onClose = close_modal;
  const [amountSelected, setAmountSelected] = React.useState(0);
  const [selectedExerciseMap, setExerciseSelected] = React.useState(new Map<string, boolean>());
  const [selectedTab, setSelectedTab] = React.useState<"all" | "recent">("all");

  const recent_exercises = trpcNextHooks.exercise.my_unique_recent
    .useQuery({}, { enabled: selectedTab == "recent" });

  const selectedFilters = useSearchFilters();

  const directory = useExerciseDirectory()
  const currentSearchQuery = useSearchQuery()

  const exerciseResults = React.useMemo(() => {
    let current = directory;
    // console.log("updating Exercise Results")
    // console.log("last query results = ", current)
    if (selectedTab == "recent") {
      current = recent_exercises.data?.filter(exercise => {
        if (!currentSearchQuery) return true;
        return exercise.name.toLowerCase().includes(currentSearchQuery.toLowerCase())
      })
    }
    // console.log("selected: ", selectedFilters.length)
    if (selectedFilters.length > 0) {
      // console.log("filtering")
      // debugger
      current = current?.filter(exercise => {
        let bool = selectedFilters.every(filter => {
          // console.log("filtering by ", filter)
          // console.log("exercise: ", exercise.equipment_name, exercise.force)
          // console.log("accpeted: ", exercise.equipment_name?.includes(filter) || exercise.force?.includes(filter))
          return (exercise.equipment_name?.includes(filter) || exercise.force?.includes(filter))
        })
        // console.log("bool: ", bool)
        return bool
      })
      // console.log("filtered: ", current)
    }
    // console.log("filtered results: ", current)
    return current;
  }, [directory, recent_exercises.data, selectedTab, currentSearchQuery, selectedFilters])

  React.useEffect(() => {

  }, [selectedFilters])
  const RESULT_RENDER_LIMIT = 25;

  const add_exercises = trpcNextHooks.exercise.add_to_current_workout.useMutation({
    onSuccess(updated_workout) {
      queryContext.workout.get_by_id.invalidate({workout_id})
      if (workout_id) {
        queryContext.workout.get_by_id.setData({ workout_id }, updated_workout);
      }
    },
  });
  const onAddSelected = React.useCallback(async () => {
    console.group("Adding Selected Exercises");
    const selected = [...selectedExerciseMap.entries()].filter(
      ([_, included]) => included == true
    );
    if (selected.length > 0) {
      const selected_ids = [...selected.values()].map(([exercise_id, _]) => {
        return exercise_id;
      });
      console.log(selected_ids);
      await add_exercises.mutateAsync({
        exercise_id: selected_ids,
      }, {
        onSuccess(data, variables, context) {
          // setExerciseSelected(new Map());
          onClose!();
        },
      });
    } else {
      console.log("No exercises selected");
    }
    console.groupEnd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExerciseMap]);
  const moreInfoHandler = (href: string) => {
    window.open(href, "_blank");
  };
  const handleCheckBox = (
    checked: boolean,
    exercise_id: string
  ) => {
    setExerciseSelected((exerciseMap) => {
      // add element key to map with a value of true
      exerciseMap.set(exercise_id, checked);
      // count amount of selected exercises (value is true)
      const amount = [...exerciseMap.values()].filter(
        (value) => value == true
      ).length;
      setAmountSelected(amount);
      return exerciseMap;
    });
  };
  const ExerciseOverviewCard = (props: { exercise: Exercise }) => {
    const { exercise } = props;
    const isChecked = !!selectedExerciseMap.get(exercise.id);
    return (
      <>
        <li id="exercise-container"
          className="flex min-h-max rounded-md bg-card py-1 px-2 will-change-scroll snap-start">
          <div className="flex items-center">
            <input type="checkbox"
              id={`exercise-checkbox-${exercise.id}`}
              checked={isChecked}
              onChange={(e) => handleCheckBox((e.target as HTMLInputElement).checked, exercise.id)}
              className="rounded-sm  min-w-5 min-h-5 cursor-pointer mx-2" />
          </div>

          {/* <div className="flex h-full peer-checked:ring-2"></div> */}

          <label id="exercise-info"
            className="ml-1 justify-between border-purple-500 /border flex flex-col grow mr-2"
            htmlFor={`exercise-checkbox-${exercise.id}`}
          >
            <span id="exercise-name"
              className="w-max self-start text-[1.2rem] font-medium capitalize leading-tight max-w-[18ch] overflow-ellipsis overflow-hidden whitespace-nowrap"
            >
              {exercise.name}
            </span>
            <div id="exercise-details" className="flex space-x-2">
              <div
                id="target-muscle"
                className="flex flex-col justify-between border-green-500"
              >
                <h1 className="text-[.6rem] font-bold leading-snug tracking-wider text-text.secondary">
                  Target Muscle:
                </h1>
                <span
                  className='w-[13ch] truncate text-[.9rem] font-light capitalize leading-snug'
                >
                  {exercise.muscle_name ?? "N/A"}
                </span>
              </div>

              <div
                id="force"
                className="flex flex-col justify-between border-orange-500"
              >

                <h1 className="text-[.6rem] font-bold leading-snug tracking-wider text-text.secondary">
                  Mechanics:
                </h1>
                <span
                  className='max-w-[8ch] truncate text-[.9rem] font-light capitalize leading-snug'
                >
                  {exercise.force ?? "N/A"}
                </span>
              </div>
              <div
                id="equipment"
                className="flex flex-col justify-between border-yellow-500"
              >

                <h1 className="text-[.6rem] font-bold leading-snug tracking-wider text-text.secondary">
                  Equipment:
                </h1>
                <span
                  className='max-w-[10ch] truncate text-[.9rem] font-light capitalize leading-snug'
                >
                  {exercise.equipment_name ?? "N/A"}
                </span>
              </div>
            </div>
          </label>
          <button id="more-info-button"
            disabled={!exercise.href}
            onClick={() => moreInfoHandler(exercise.href!)}
            className="mr-1 ml-auto  rounded-lg disabled:text-gray-600"
          >
            <InfoIcon />
          </button>
        </li>
      </>
    );
  }
  return (
    <>
      <SearchBar className="relative h-max //border-2 border-violet-500" selectedTab={selectedTab} />
      <fieldset id="tab-selection" className="max-h-min w-full">
        <legend className="hidden" />
        <div className="inline-block ">
          <input type="radio" id="all-option"
            className="hidden appearance-none h-0  group peer w-0"
            value="all"
            checked={selectedTab === 'all'}
            onClick={() => setSelectedTab("all")} />
          <label
            htmlFor="all-option"
            className="rounded-br-md  rounded full flex peer-checked:rounded-b-none /underline text-theme/70 bg-primary peer-checked:no-underline peer-checked:text-theme peer-checked:bg-primary">
            <span className="text-[.85rem] pt-1 px-2 whitespace-nowrap">All Exercises</span>
          </label>
        </div>
        <div className="inline-block ">
          <input type="radio"
            id="recent-option"
            className="hidden peer w-0"
            value="recent"
            checked={selectedTab === 'recent'}
            onClick={() => setSelectedTab("recent")} />
          <label htmlFor="recent-option"
            className="rounded-bl-md rounded full flex peer-checked:rounded-b-none bg-primary /underline peer-checked:no-underline text-theme/70 peer-checked:text-theme peer-checked:bg-primary">
            <span className="text-[.85rem] pt-1  rounded-full px-2">Recent</span>
          </label>
        </div>
        {/* <div className="w-full bg-black rounded-bl-md" /> */}
      </fieldset>
      <>
        <div id="title-bar" className="px-2 flex min-h-max w-full justify-between  border-green-600 bg-primary rounded-tr-md pt-1">
          <span className="text-[1rem] opacity-0">
            Exercises:
          </span>
          <span
            className="self-center text-[.7rem] font-bold text-text.secondary"
          >
            {`Only first ${RESULT_RENDER_LIMIT} results shown.`}
          </span>
          <Link href="#" className="peer">
            <a className="text-text.secondary underline font-semibold pr-3 text-[.9rem] pointer-events-none appearance-none">
              view all
            </a>
          </Link>
        </div>
        <section id="exercise-result-list"
          className="px-2 space-y-[.7rem] /pb-[6rem] /border-2  rounded-b-md border-dashed border-pink-600 pt-2 no-scrollbar relative flex grow snap-y snap-mandatory flex-col overflow-y-scroll overflow-x-hidden from:bg-primary to:bg-black bg-gradient-to-b"
        // onScroll={handleScroll}
        // style={{
        //   maxHeight: "100dvh"
        // }}
        >
          {exerciseResults &&
            exerciseResults.map((exercise, key) => {
              if (key < RESULT_RENDER_LIMIT) {
                return <ExerciseOverviewCard key={exercise.id} exercise={exercise} />;
              }
            })}
          {/* <div className={`sticky border pointer-events-none bottom-0 min-h-[5rem] bg-gradient-to-t from-black to-transparent`}></div> */}

          <div id="bottom-fade"
            className="min-h-[5rem] sticky bottom-0 self-center z-30  min-w-[105%] from-bg.primary bg-gradient-to-t to-transparent flex justify-center items-start pt-2 ">

            <button style={{ display: amountSelected ? '' : "none" }}
              onClick={() => onAddSelected()}
              disabled={add_exercises.isLoading}
              className="rounded-md w-[70%] px-2 py-[.2rem] items-center bg-theme disabled:button-disabled">
              <span className={`h-max text-base font-bold`}>
                Add {amountSelected ? `(${amountSelected})` : ""}
              </span>
            </button>
          </div>
        </section>
      </>

    </ >

  );
};

export default withRouter<AddExerciseProps & WithRouterProps>(
  AddNewExerciseModal
);
