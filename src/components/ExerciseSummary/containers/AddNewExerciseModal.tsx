import { ExpandMoreRounded } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { Checkbox } from "@mui/material";
import Link from "next/link";
import React, { SyntheticEvent } from "react";
import { Exercise } from "@prisma/client";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";
import trpc from "@client/trpc";

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
  exercises,
  close_modal,
  router,
}: AddExerciseProps & WithRouterProps) => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const onClose = close_modal;
  const workout_id = router.query.workout_id! as string;
  const [amountSelected, setAmountSelected] = React.useState(0);
  const [selectedExerciseMap, setExerciseSelected] = React.useState(new Map<string, boolean>());
  const [searchResults, setFilteredExercises] = React.useState(exercises);
  const [isScrolledTop, setIsScrolledTop] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>(
    undefined
  );
  const [checkedTags, setCheckedTags] = React.useState(new Map<string, boolean>());
  const match_by_word = (search_term: string, exercise: Exercise): boolean => {
    // split search term into words if there are spaces
    const search_terms = search_term.split(" ");
    // loop through each word in the search term
    let is_match = false;
    search_terms.forEach((search_term) => {
      let search_term_lower = search_term.toLowerCase().trim();
      switch (true) {
        case exercise.name?.toLowerCase().includes(search_term_lower):
          is_match = true;
          break;
        // case exercise.muscle_name
        //   ?.toLowerCase()
        //   .includes(search_term_lower):
        //   is_match = true;
        //   break;
        case exercise.equipment_name?.toLowerCase().includes(search_term_lower):
          is_match = true;
          break;
        // case exercise.force?.toLowerCase().includes(search_term_lower):
        //   is_match = true;
        //   break;
      }
    });

    return is_match;
  };
  const query_context = trpc.useContext();
  React.useEffect(() => {
    // console.log(checkedTags);
    if (!searchTerm && checkedTags.size === 0) { setFilteredExercises(exercises); return };
    setFilteredExercises(
      exercises!.filter((exercise) => {
        let term_exists = !!searchTerm;
        let filters_exist = checkedTags.size > 0;
        let tag_match = false;
        // set to flase if there are no true filters
        let no_checked_tags = [...checkedTags.values()].every(tag => tag === false);
        console.log(checkedTags);

        if (filters_exist && !no_checked_tags) {
          checkedTags.forEach((is_checked, tag) => {
            exercise.force?.includes(tag) && is_checked && (tag_match = true);
            exercise.equipment_name?.includes(tag) && is_checked && (tag_match = true);
          })
        }
        else tag_match = true; // if map is empty then tag_match is true
        let term_match = term_exists ? exercise.name?.toLowerCase().includes(searchTerm!.toLowerCase()) : true;

        return tag_match && term_match;
        // return match_by_word(searchTerm, exercise) ;
      })
    );
  }, [searchTerm, exercises, checkedTags]);

  const add_exercises = trpc.useMutation("exercise.add_to_current_workout", {
    onSuccess(updated_workout) {
      query_context.invalidateQueries("workout.get_by_id");
      if (workout_id) {
        query_context.setQueryData(
          ["workout.get_by_id", { workout_id }],
          updated_workout
        );
      }
    },
  });
  const inputRef = React.useRef<HTMLInputElement>(null);
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

  const RESULT_RENDER_LIMIT = 25;

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

  const handleScroll = (event: SyntheticEvent) => {
    const scrollPosition = (event.target as HTMLDivElement).scrollTop;
    setIsScrolledTop(scrollPosition < 10);
  };
  const [showFilters, setShowFilters] = React.useState(false);
  const ExerciseOverviewCard = (props: { exercise: Exercise }) => {
    const { exercise } = props;
    const isChecked = !!selectedExerciseMap.get(exercise.id);
    return (
      <li id="exercise-container"
        className="flex min-h-max rounded-md bg-secondary py-1 px-2"
      >
        <Checkbox
          id={`exercise-checkbox-${exercise.id}`}
          checked={isChecked}
          onChange={(e) => handleCheckBox((e.target as HTMLInputElement).checked, exercise.id)}
          sx={{ "&.Mui-checked": { color: "blue.main" }, borderRadius: "0px" }}
        />
        <label id="exercise-info"
          className="ml-1 justify-between border-purple-500"
          htmlFor={`exercise-checkbox-${exercise.id}`}
        >
          <span id="exercise-name"
            className="w-max self-start text-[1.2rem] font-medium capitalize leading-tight"
          >
            {exercise.name}
          </span>
          <div id="exercise-details" className="flex space-x-2">
            <div
              id="target-muscle"
              className="flex flex-col justify-between border-green-500"
            >
              <h1 className="text-[.6rem] font-bold leading-snug tracking-widest text-text.secondary">
                Target Muscle:
              </h1>
              <span
                className='w-[14ch] truncate text-[.9rem] font-light capitalize leading-snug'
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
                className='w-[8ch] truncate text-[.9rem] font-light capitalize leading-snug'
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
                className='w-[10ch] truncate text-[.9rem] font-light capitalize leading-snug'
              >
                {exercise.equipment_name ?? "N/A"}
              </span>
            </div>
          </div>
        </label>
        <button id="more-info-button"
          disabled={!exercise.href}
          onClick={() => moreInfoHandler(exercise.href!)}
          className="ml-auto rounded-full disabled:text-gray-600"
        >
          <InfoOutlinedIcon />
        </button>
      </li>
    );
  }
  const getFilterName = (filter_key: string) => {
    switch (filter_key) {
      case "exercise_equipment":
        return "Equipment"
      case "exercise_mechanics":
        return "Mechanics"
    }
  };
  const areFiltersEmpty = () => [...checkedTags.values()].filter(tag => true).length === 0;

  return (
    <section id="new-exercise-modal"
      className="flex grow flex-col overflow-y-clip //border-4 border-blue">
      <div id="search-bar" className="relative h-max //border-2 border-violet-500">
        <input
          name="search"
          type="text"
          ref={inputRef}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          placeholder="Search..."
          className="mb-3 w-full rounded-md border bg-black px-2 py-1 text-base focus:outline-none "
        />
        <button
          onClick={() => {
            setSearchTerm('')
            setCheckedTags(new Map())
            if (inputRef?.current) {
              inputRef.current!.value = '';
            }
          }}
          className={`absolute top-1 right-2 ${!searchTerm && areFiltersEmpty() && "hidden"}`}>
          <CancelIcon />
        </button>
        <div id="show-filter-toggle"
          onClick={() => setShowFilters(prev => !prev)} className="-mt-2 flex w-max pr-2 text-[.9rem] underlineww">
          <span id="expand-icon-container"
            className={`flex -rotate-90 items-center rounded-full border-violet-700 ${showFilters && "rotate-0"} transition-all duration-200`}>
            <ExpandMoreRounded fontSize="inherit" />
          </span>
          <span>{!showFilters ? "show" : "hide"} filters</span>
        </div>
        <div id='filters'
          className={`flex h-max flex-col space-y-0 //border border-rose-600 ${!showFilters && 'hidden'}`}>
          {Object.entries(filters).map((filter) => {
            const [filter_key, filter_value] = filter;
            return (
              <form className="flex //border items-start">
                <span id='filter-category' className="text-sm text-text.secondary mr-4 mt-[.2rem]">
                  {getFilterName(filter_key)}:
                </span>
                <ul id="tag-list" className="flex flex-wrap gap-x-1">
                  {filter_value.map((filter_name) => {
                    let isChecked = !!checkedTags.get(filter_name);
                    return (
                      <label htmlFor={filter_name.replace(' ', '-')}>
                        <input id={filter_name.replace(' ', '-')}
                          className="peer appearance-none"
                          type="checkbox"
                          checked={!!checkedTags.get(filter_name)}
                          onChange={() => {
                            // console.log(filter_name + " selected")
                            // console.log(checkedTags)
                            setCheckedTags(prev => new Map([...prev, [filter_name, !checkedTags.get(filter_name)]]))
                          }} />
                        <span className="whitespace-nowrap rounded-md bg-white/90 px-2 text-xs font-bold capitalize text-black peer-checked:bg-blue peer-checked:text-white">{filter_name}</span>
                      </label>)
                  }

                  )}
                </ul>
              </form>
            );
          })}
        </div>
          <div className={`border-b w-full transition-all duration-300 my-1 mx-auto rad ${showFilters ? "w-full": "w-[10%]"}`}/>
      </div>
      <div id="title-bar" className="flex min-h-max w-full justify-between  border-green-600">
        <span className="text-[1rem]">
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
      <div id="exercise-result-list"
        className="flex flex-col space-y-[.7rem] overflow-y-auto //border-2 border-red-600 pb-[4rem] pt-2"
        onScroll={handleScroll}
        style={{
          maxHeight: "100dvh"
        }}>
        {searchResults &&
          searchResults.map((exercise, key) => {
            if (key < RESULT_RENDER_LIMIT) {
              return <ExerciseOverviewCard key={exercise.id} exercise={exercise} />;
            }
          })}
        <div id="bottom-fade"
          className="h-[5rem] absolute -bottom-[.1rem] w-full from-black/90 bg-gradient-to-t to-transparent" />
      </div>
      <div id="add-button-container"
        className="w-[100%] flex justify-center absolute bottom-5 z-[100]">
        <button style={{ display: amountSelected ? '' : "none" }} onClick={() => onAddSelected()} className="ripple-bg-blue rounded-md w-[70%] px-2 py-[.2rem] items-center bg-[#2196f3]">
          <span className={`h-max text-base font-bold`}>
            Add {amountSelected ? `(${amountSelected})` : ""}
          </span>
        </button>
      </div>
    </section >

  );
};

export default withRouter<AddExerciseProps & WithRouterProps>(
  AddNewExerciseModal
);
