import { debounce } from 'lodash';
import { ChevronRight, CancelIcon, InfoIcon } from "../../SvgIcons"
import Link from "next/link";
import React, { SyntheticEvent, useMemo } from "react";
import { Exercise } from "@prisma/client";
import { useRouter, withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";
import trpc from "@client/trpc";
import SearchBar from 'src/components/SearchBar';

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
  const formRef = React.useRef<HTMLFormElement>(null);
  const query_context = trpc.useContext()
  const router = useRouter()
  const exercise_directory = query_context.getQueryData(["exercise.public.directory"]);
  trpc.useQuery(["exercise.public.directory"], { enabled: !exercise_directory })
  const onClose = close_modal;
  const workout_id = router.query.workout_id! as string;
  const [amountSelected, setAmountSelected] = React.useState(0);
  const [selectedExerciseMap, setExerciseSelected] = React.useState(new Map<string, boolean>());
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>(
    router.query.term as string
  );
  console.log(searchTerm)
  const serverSearchResults = query_context.getQueryData(["exercise.public.search_exercises", { query: searchTerm }]);
  const [checkedTags, setCheckedTags] = React.useState(new Map<string, boolean>());
  const [resultsTab, setResultsTab] = React.useState<"all" | "recent">("all");
  const recent_exercises = trpc.useQuery(["exercise.me.recent_unique", {}], { enabled: resultsTab == "recent" });
  const exercises = React.useMemo(() => {
    if (resultsTab == "recent") {
      return recent_exercises.data
    }
    return exercise_directory
  }, [resultsTab, exercise_directory, recent_exercises.data])
  const [searchResults, setFilteredExercises] = React.useState(exercises);
  // const match_by_word = (search_term: string, exercise: Exercise): boolean => {
  //   // split search term into words if there are spaces
  //   const search_terms = search_term.split(" ");
  //   // loop through each word in the search term
  //   let is_match = false;
  //   search_terms.forEach((search_term) => {
  //     let search_term_lower = search_term.toLowerCase().trim();
  //     switch (true) {
  //       case exercise.name?.toLowerCase().includes(search_term_lower):
  //         is_match = true;
  //         break;
  //       // case exercise.muscle_name
  //       //   ?.toLowerCase()
  //       //   .includes(search_term_lower):
  //       //   is_match = true;
  //       //   break;
  //       case exercise.equipment_name?.toLowerCase().includes(search_term_lower):
  //         is_match = true;
  //         break;
  //       // case exercise.force?.toLowerCase().includes(search_term_lower):
  //       //   is_match = true;
  //       //   break;
  //     }
  //   });

  //   return is_match;
  // };
  const RESULT_RENDER_LIMIT = 25;
  // React.useEffect(() => {
  //   // console.log(checkedTags);
  //   // if (!searchTerm && checkedTags.size === 0) { setFilteredExercises(exercises); return };
  //   let n = 0
  //   // setFilteredExercises(
  //   //   exercises!.filter((exercise) => {
  //   //     if (n === RESULT_RENDER_LIMIT) return false;
  //   //     // console.log(n)
  //   //     // console.log(exercise.equipment_name, exercise.force, exercise.name)
  //   //     let term_exists = !!searchTerm;
  //   //     let filters_exist = checkedTags.size > 0;
  //   //     // console.log(term_exists, filters_exist);
  //   //     let tag_match = false;
  //   //     // set to flase if there are no true filters
  //   //     let checked_tags = ![...checkedTags.values()].every(tag => tag === false);
  //   //     // console.log(checkedTags, checked_tags);

  //   //     if (filters_exist && checked_tags) {
  //   //       let i = 0
  //   //       checkedTags.forEach((is_checked, tag) => {
  //   //         // pull and barbell

  //   //         if (i > 0 && tag_match === false) {
  //   //           // console.log(i, tag_match);
  //   //           return;
  //   //         }

  //   //         else {
  //   //           if (exercise.force?.includes(tag) && is_checked) {
  //   //             // console.log("force: ", tag, " = ", is_checked);
  //   //             tag_match = true
  //   //           }
  //   //           else if (exercise.equipment_name?.includes(tag) && is_checked) {
  //   //             // console.log("equipment: ", tag, " = ", is_checked);
  //   //             tag_match = true
  //   //           }

  //   //           else {
  //   //             // console.log("no match index ", i, " : ", tag);
  //   //             // tag_match = false
  //   //           };
  //   //         };
  //   //         //  i++;
  //   //       })
  //   //     }
  //   //     else tag_match = true; // if map is empty then tag_match is true
  //   //     // console.log("term exist", term_exists)
  //   //     let term_match = term_exists ? exercise.name?.toLowerCase().includes(searchTerm!.toLowerCase()) : true;
  //   //     // console.log("term, tag =>", term_match, tag_match);

  //   //     return tag_match && term_match && n++;
  //   //     // return match_by_word(searchTerm, exercise) ;
  //   //   })
  //   // );
  //   console.log(searchTerm)
  //   console.log(router.query.term)
  //   let filtered = query_context.getQueryData(["exercise.public.search_exercises", { query: (router.query.term as string)?.trim() }])
  //   filtered && filtered.length > 0 && setFilteredExercises(filtered)
  // }, [serverSearchResults, exercises, checkedTags, router]);


  // console.log(router.query.term)
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
  // const inputRef = React.useRef<HTMLInputElement>(null);
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

  // const [showFilters, setShowFilters] = React.useState(false);
  const ExerciseOverviewCard = (props: { exercise: Exercise }) => {
    const { exercise } = props;
    const isChecked = !!selectedExerciseMap.get(exercise.id);
    return (
      <>
        <li id="exercise-container"
          className="flex min-h-max rounded-md bg-card py-1 px-2 will-change-scroll snap-start"
        >


          <div className="flex items-center">
            <input type="checkbox"
              id={`exercise-checkbox-${exercise.id}`}
              checked={isChecked}
              onChange={(e) => handleCheckBox((e.target as HTMLInputElement).checked, exercise.id)}
              className="rounded-sm  min-w-5 min-h-5 cursor-pointer mx-2"
            />
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
  // const getFilterName = (filter_key: string) => {
  //   switch (filter_key) {
  //     case "exercise_equipment":
  //       return "Equipment"
  //     case "exercise_mechanics":
  //       return "Mechanics"
  //   }
  // };
  // const areFiltersEmpty = () => [...checkedTags.values()].filter(tag => true).length === 0;

  return (
    <>
      {/* <SearchBar className="relative h-max //border-2 border-violet-500" /> */}
      {/* <div id="search-bar" className="relative h-max //border-2 border-violet-500">
        <input
          id="exercise-search-input"
          type="text"
          inputMode="search"
          onFocus={(e) => {

            searchTerm && e.target.select();
          }}
          onKeyUp={(e) => {
            if (e.key == "Enter") {
              (document.activeElement as HTMLElement).blur();
              // e.target?.blur();
            };
          }}
          ref={inputRef}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          placeholder="Search..."
          className="mb-3 w-full rounded-2xl border transition-all duration-400 bg-transparent px-2 py-1 text-base focus:rounded-md focus:outline-none "
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
          onClick={() => setShowFilters(prev => !prev)} className="-mt-1 flex w-max pr-2 text-[.9rem] items-center">

          <ChevronRight className={`rotate 0 ${showFilters && "rotate-90"} transition-all ease-in duration-[450] h-4 font-bold rounded-lg`} />

          <span>{!showFilters ? "show" : "hide"} filters</span>
        </div>
        <div id='filters'
          className={`flex flex-col space-y-0 /border border-rose-600 transition-all duration-[500] ease-out overflow-hidden ${!showFilters ? 'max-h-0' : 'max-h-24'}`}>
          {Object.entries(filters).map((filter, index) => {
            const [filter_key, filter_value] = filter;
            return (
              <form className="flex //border items-start" key={index}>
                <span id='filter-category' className="text-sm text-text.secondary mr-4 mt-[.2rem]">
                  {getFilterName(filter_key)}:
                </span>
                <ul id="tag-list" className="flex flex-wrap gap-x-1">
                  {filter_value.map((filter_name, index) => {
                    let isChecked = !!checkedTags.get(filter_name);
                    return (
                      <label htmlFor={filter_name.replace(' ', '-')} key={index}>
                        <input id={filter_name.replace(' ', '-')}
                          className="peer appearance-none"
                          type="checkbox"
                          checked={!!checkedTags.get(filter_name)}
                          onChange={() => {
                            // console.log(filter_name + " selected")
                            // console.log(checkedTags)
                            setCheckedTags(prev => new Map([...prev, [filter_name, !checkedTags.get(filter_name)]]))
                          }} />
                        <span className="whitespace-nowrap rounded-md bg-white/90 px-2 text-xs font-bold capitalize text-black peer-checked:bg-theme peer-checked:text-white">{filter_name}</span>
                      </label>)
                  }

                  )}
                </ul>
              </form>
            );
          })}
        </div>
        <div className={`border-b w-full transition-all duration-300 my-1 mx-auto ease-out ${showFilters ? "w-full" : "w-[10%]"}`} />
      </div> */}

      <fieldset id="tab-selection" className="max-h-min w-full">
        <legend className="hidden" />
        <div className="inline-block ">
          <input type="radio" id="all-option"
            className="hidden appearance-none h-0  group peer w-0"
            value="all"
            checked={resultsTab === 'all'}
            onClick={() => setResultsTab("all")} />
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
            checked={resultsTab === 'recent'}
            onClick={() => setResultsTab("recent")} />
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
          {searchResults &&
            searchResults!.map((exercise, key) => {
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
