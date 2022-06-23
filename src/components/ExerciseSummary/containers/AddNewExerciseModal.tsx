import { ExpandMoreRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
  colors,
  Grid,
  Input,
  Stack,
  SxProps,
  Typography,
  Checkbox,
  Container,
} from "@mui/material";
import Link from "next/link";
import React, { SyntheticEvent } from "react";
import { SummaryCard } from "../components/UserExerciseCard";
import { PrismaClient, Exercise } from "@prisma/client";
import { GetStaticProps, GetServerSideProps } from "next";
import { Context } from "../../../../misc/__dep__graphql/context";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { NextRouter, useRouter, withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";
import { UrlWithParsedQuery } from "url";
import trpc from "@client/trpc";
import { useAppUser } from "@client/providers/app_user.test";
interface AddExerciseProps {
  exercises?: Exercise[];
  workout_id: string;
  toggle?: () => void;
}
const infoIconCssProps: SxProps = {
  display: "flex",
  color: "text",
};
const infoLabelsCss: SxProps = {
  fontSize: ".6rem",
  fontWeight: "semi-bold",
  color: "text.secondary",
  mt: "-.25rem",
  letterSpacing: ".05rem",
};
const infoValueCss: SxProps = {
  textTransform: "capitalize",
  mt: "-.25rem",
  fontWeight: "light",
  maxWidth: "10ch",
  fontSize: ".9rem",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
const exerciseNameCss: SxProps = {
  fontWeight: "medium",
  width: "max-content",
  alignSelf: "start",
  textTransform: "capitalize",
  fontSize: "1.3rem",
};

const AddNewExerciseModal = ({
  exercises,
  toggle,
  router,
}: AddExerciseProps & WithRouterProps) => {
  const toggleShowExercise = toggle;
  const { get_id } = useAppUser();
  const [amountSelected, setAmountSelected] = React.useState(0);
  const [selectedExerciseMap, setExerciseSelected] = React.useState(
    new Map<string, boolean>()
  );
  const [filteredExercises, setFilteredExercises] = React.useState(exercises);
  const [isScrolledTop, setIsScrolledTop] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState<String | undefined>(
    undefined
  );
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
    if (!searchTerm) return;
    setFilteredExercises(
      exercises!.filter((exercise) => {
        return exercise.name?.toLowerCase().includes(searchTerm.toLowerCase());
        // return match_by_word(searchTerm, exercise);
      })
    );
  }, [searchTerm]);
  const borders = false;


  const useAddExercise = trpc.useMutation("exercise.add_to_current_workout", {
    onSuccess(updated_workout) {
      query_context.invalidateQueries("workout.current_by_owner_id");
      if (get_id) {
        query_context.setQueryData(
          ["workout.current_by_owner_id", { owner_id: get_id! }],
          updated_workout
        );
      }
    },
  });

  const addSelected = React.useCallback(() => {
    console.group("Adding Selected Exercises");
    const selected = [...selectedExerciseMap.entries()].filter(
      ([_, included]) => included == true
    );
    if (selected.length > 0) {
      const selected_ids = [...selected.values()].map(([exercise_id, _]) => {
        return exercise_id;
      });

      const _ = useAddExercise.mutateAsync({
        owner_id: get_id!,
        exercise_id: selected_ids,
      });
      console.groupEnd();
      // router.
      toggleShowExercise!();
    } else {
      console.log("No exercises selected");
      toggleShowExercise!();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExerciseMap]);
  const moreInfoHandler = (href: string) => {
    window.open(href, "_blank");
  };

  const RESULT_RENDER_LIMIT = 25;

  const handleCheckBox = (
    e: React.ChangeEvent<HTMLInputElement>,
    exercise_id: string
  ) => {
    setExerciseSelected((exerciseMap) => {
      // add element key to map with a value of true
      exerciseMap.set(exercise_id, e.target.checked);
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
  const ExerciseDescriptionComponent = (exercise: Exercise, key: number): JSX.Element => {
    return (
      <>
        <Stack
          key={key}
          direction="row"
          display="flex"
          className="exercise-container"
          sx={{
            pl: "0.25rem",
            pr: "0.5rem",
            justifyContent: "space-between",
            height: "min-content",
            backgroundColor: "secondary.main",
            borderRadius: 2,
            py: ".2rem",
            overflowX: "hidden",
          }}
        >
          <Box
            className="selected-check-box"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: borders ? "1px solid violet" : "none",
            }}
          >
            <Checkbox
              checked={selectedExerciseMap.get(exercise.id) ?? false}
              onChange={(e) => handleCheckBox(e, exercise.id)}
              sx={{ "&.Mui-checked": { color: "blue.main" } }}
            />
          </Box>
          <Box
            className="exercise-info"
            sx={{
              // border: borders && "1px solid red",
              width: "100%",
              pl: "0.25rem",
            }}
          >
            <Stack sx={{ height: "100%", justifyContent: "space-between" }}>
              <Typography
                sx={{
                  ...exerciseNameCss,
                }}
              >
                {exercise.name}
              </Typography>
              <Stack direction="row" gap="1rem">
                <Box
                  className="target-muscle"
                  sx={{ border: borders ? "px solid green" : "none" }}
                >
                  <Stack
                    sx={{ height: "100%", justifyContent: "space-between" }}
                  >
                    <Typography sx={{ ...infoLabelsCss }}>
                      Target Muscle:
                    </Typography>
                    <Typography
                      sx={{
                        ...infoValueCss,
                        minWidth: "14ch",
                        textTransform: "lowercase",
                      }}
                    >
                      {exercise.muscle_name ?? "N/A"}
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  className="movement-force"
                  sx={{ border: borders ? "1px solid orange" : "none" }}
                >
                  <Stack
                    sx={{ height: "100%", justifyContent: "space-between" }}
                  >
                    <Typography sx={{ ...infoLabelsCss }}>
                      Mechanics:
                    </Typography>
                    <Typography
                      sx={{
                        ...infoValueCss,
                      }}
                    >
                      {exercise.force ?? "N/A"}
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  className="exercise-equipment"
                  sx={{ border: borders ? "1px solid yellow" : "none" }}
                >
                  <Stack
                    sx={{ height: "100%", justifyContent: "space-between" }}
                  >
                    <Typography sx={{ ...infoLabelsCss, mb: "-.25rem" }}>
                      Equipment:
                    </Typography>
                    <Typography
                      sx={{
                        ...infoValueCss,
                      }}
                    >
                      {exercise.equipment_name ?? "N/A"}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Box
            className="more-info-container"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: borders ? "1px solid violet" : "none",
            }}
          >
            <ButtonBase
              disabled={!exercise.href}
              onClick={() => moreInfoHandler(exercise.href!)}
              sx={{
                borderRadius: "100%",
                ...infoIconCssProps,
                "&.Mui-disabled": {
                  ".MuiSvgIcon-root": {
                    color: colors.grey[600],
                  },
                },
              }}
            >
              <InfoOutlinedIcon />
            </ButtonBase>
          </Box>
        </Stack>
      </>
    );
  };
  return (
    <Box
      sx={{
        // border: "3px solid white",
        position: "relative",
        width: "100%",
        height: "100%",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
        // overflowY: "auto",
      }}
    >
      <Box
        className="search-bar"
        sx={{
          border: "1px solid white",
          width: "fill-available",
          // mt: "-1rem",
          borderRadius: 2,
          px: ".5rem",
          mb: ".8rem",
          maxHeight: "min-content",
        }}
      >
        <Input
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          placeholder="Search..."
        ></Input>
      </Box>
      <Box
        className="exercises-title-bar"
        sx={{
          display: "flex",
          // border: "1px dashed white",
          justifyContent: "space-between",
          width: "100%",
          maxHeight: "min-content",
        }}
      >
        <Typography fontSize={`1rem`} fontWeight={"regular"}>
          Exercises:
        </Typography>
        <Typography
          fontSize={`0.7rem`}
          fontWeight={"bold"}
          color="secondary"
          alignSelf="end"
        >
          {`Only first ${RESULT_RENDER_LIMIT} results shown.`}
        </Typography>
        <Link href="#">
          <Typography
            fontWeight={"semibold"}
            sx={{
              pr: ".8em",
              fontSize: ".9rem",
              textDecoration: "underline",
              color: "blue.main",
            }}
          >
            view all
          </Typography>
        </Link>
      </Box>
      <Box
        className="scroll-add-container"
        sx={{
          // border: "1px solid red",
          // overflowY: "visible",
          width: "100%",
          flex: "1",
          position: "relative",
        }}
      >
        <Box
          className="fade-top"
          sx={{
            opacity: "" || "0.5",
            transition: "opacity .3s",
            height: "2rem",
            position: "absolute",
            top: "-0.1rem",
            width: "100%",
            color: "white",
            zIndex: 1,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,1) , rgba(0,0,0,0))",
          }}
        />
        <Box
          id="scrollable-exercises"
          sx={{
            // border: "2px dashed green",
            overflowY: "scroll",
            // height: "400px",
            width: "100%",
            height: "100%",
            position: "absolute",
            pb: "3rem",
          }}
          onScroll={handleScroll}
        >
          <Stack
            spacing={"0.7rem"}
            direction="column"
            sx={{ minHeight: "fill", pt: ".5rem", px: ".25rem" }}
          >
            {filteredExercises &&
              filteredExercises?.map((exercise, key) => {
                if (key < RESULT_RENDER_LIMIT) {
                  return ExerciseDescriptionComponent(exercise, key);
                }
              })}
          </Stack>
        </Box>
        <Box
          className="fade-bottom"
          sx={{
            height: "5rem",
            position: "absolute",
            bottom: "-0.1rem",

            width: "100%",
            color: "black",
            zIndex: 1,
            background:
              "linear-gradient(to top, rgba(0,0,0,.9) 30% , rgba(0,0,0,0))",
          }}
        />
        <Box
          className="add-button-container"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            bottom: ".5rem",
            zIndex: 2,
          }}
        >
          <ButtonBase
            onClick={addSelected}
            sx={{
              display: amountSelected ? "" : "none",
              backgroundColor: amountSelected ? "blue.main" : "#fff",
              borderRadius: 2,
              //   border: "1px solid white",
              width: "70%",
              px: ".5rem",
              py: ".2rem",
              alignItems: "center",
              zIndex: "100",
            }}
          >
            <Typography
              fontWeight={"bold"}
              fontSize="1rem"
              color={amountSelected ? "#fff" : "primary"}
              sx={{ height: "max-content" }}
            >
              Add {amountSelected ? `(${amountSelected})` : ""}
            </Typography>
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
};
export default withRouter<AddExerciseProps & WithRouterProps>(
  AddNewExerciseModal
);
