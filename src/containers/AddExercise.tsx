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
import React from "react";
import { SummaryCard } from "../components/ExerciseSummary/UserExerciseSummaryCard";
import exercises from "../pages/api/exercises";
import { PrismaClient, Exercise } from "@prisma/client";
import { GetStaticProps, GetServerSideProps } from "next";
import { Context } from "../../graphql/context";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
interface AddExerciseProps {
  toggle?: () => void;
  exercises?: Exercise[];
}

const AddExercise = ({ exercises, toggle }: AddExerciseProps) => {
  const toggleShowExercise = toggle;
  const [amountSelected, setAmountSelected] = React.useState(0);
  const [selectedExerciseMap, setExerciseSelected] = React.useState(
    new Map<any, boolean>()
  );
  const borders = false;
  const addSelected = () => {
    console.log("placeholder for add selected");
    return false;
  };
  const moreInfoHandler = (href: string) => {
    //open exercise.href in a new tab
    console.log(href);
    window.open(href, "_blank");
  };

  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>, key) => {
    console.log(e.target.checked);

    setExerciseSelected((exerciseMap) => {
      exerciseMap.set(key, e.target.checked);
      const amount = [...exerciseMap.values()].filter(
        (value) => value == true
      ).length;
      setAmountSelected(amount);
      return exerciseMap;
    });
  };
  const summaryCard = (exercise: Exercise, summaryCardKey) => {
    return (
      <>
        <Stack
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
              checked={selectedExerciseMap[summaryCardKey]}
              onChange={(e) => handleCheckBox(e, summaryCardKey)}
              sx={{ "&.Mui-checked": { color: colors.blue[600] } }}
            />
          </Box>
          <Box
            className="exercise-info"
            sx={{
              border: borders && "1px solid red",
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
                  sx={{ border: borders && "px solid green" }}
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
                  sx={{ border: borders && "1px solid orange" }}
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
                  sx={{ border: borders && "1px solid yellow" }}
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
              onClick={() => moreInfoHandler(exercise.href)}
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
    <Box sx={{ border: "3px solid pink", position: "relative", width: "100%", height: "100%" }}>
      <Box
        className="search-bar"
        sx={{
          border: "1px solid white",
          width: "100%",
          // mt: "-1rem",
          borderRadius: 2,
          px: ".5rem",
          mb: ".8rem",
        }}
      >
        <Input placeholder="Search..."></Input>
      </Box>
      <Box
        className="exercises-title-bar"
        sx={{
          display: "flex",
          // border: "1px dashed white",
          justifyContent: "space-between",
          width: "100%",
          height: "min-content",
        }}
      >
        <Typography fontSize={`1rem`} fontWeight={"regular"}>
          Exercises:
        </Typography>
        <Link href="#">
          <Typography
            fontWeight={"semibold"}
            sx={{
              pr: ".8em",
              fontSize: ".9rem",
              textDecoration: "underline",
              color: colors.blue[600],
            }}
          >
            view all
          </Typography>
        </Link>
      </Box>
      <Box
        className="available-exercises-container"
        sx={{
          border: "1px solid white",
          overflowY: "visible",
          height: "fill-available",
          width: "100%",
        }}
      >
        <Box
          className="scrollable-exercises"
          sx={{
            border: "2px dashed green",
            overflowY: "scroll",
            maxHeight: "100%",
            // pb: "3rem",
          }}
        >
          <Stack spacing={"0.7rem"} direction="column">
            {exercises.map((exercise, key) => {
              if (key < 8) {
                return summaryCard(exercise, key);
              }
            })}
          </Stack>
        </Box>
        <Box
          className="add-button-container"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            bottom: ".5rem",
          }}
        >
          <ButtonBase
            onClick={addSelected}
            sx={{
              display: amountSelected ? "" : "none",
              backgroundColor: amountSelected ? colors.blue[600] : "#fff",
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
export default AddExercise;
