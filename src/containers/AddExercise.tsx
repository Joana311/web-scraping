import { ExpandMoreRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
  colors,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { borders } from "@mui/system";
import Link from "next/link";
import React from "react";
import { SummaryCard } from "../components/ExerciseSummary/SummaryCard";
import exercises from "../pages/api/exercises";

const AddExercise = (props) => {
  console.log(props.props);
  const toggleShowExercise = props.props;
  const addSelected = () => {
    console.log("placeholder for add selected");
    return false;
  };
  const exercises = [
    {
      name: "Lateral Raise",
      muscle: "Deltoid",
      variant: "Dumbbell",
      movement: "Pull",
    },
    {
      name: "Bent Over Row",
      muscle: "Latimus Dorsi",
      variant: "Barbell",
      movement: "Pull",
    },
  ];
  const summaryCard = (exercise) => {
    return (
      <>
        {" "}
        <Grid
          container
          component={Box}
          className="exercise-summary"
          sx={{
            py: "0.25rem",
            justifyContent: "space-between",
            height: "min-content",
          }}
        >
          <Grid
            item
            className="exercise-name"
            sx={{ border:"1px solid red" }}
          >
            <Stack sx={{ height: "100%", justifyContent: "space-between" }}>
              <Typography sx={{ ...infoHeaders }}>Exercise</Typography>
              <Typography variant="h6" sx={{ ...exerciseSummaryInfo }}>
                {exercise.name}
              </Typography>
            </Stack>
          </Grid>
          <Grid
            item
            className="exercise-variant"
            sx={{ border: borders && "1px solid yellow" }}
          >
            <Stack sx={{ height: "100%", justifyContent: "space-between" }}>
              <Typography sx={{ ...infoHeaders }}>Variant</Typography>
              <Typography
                variant="h6"
                sx={{
                  ...exerciseSummaryInfo,
                  fontSize: "1rem",
                }}
              >
                {exercise.variant}
              </Typography>
            </Stack>
          </Grid>
          <Grid
            item
            className="target-muscle"
            sx={{ border: borders && "1px solid green" }}
          >
            <Stack sx={{ height: "100%", justifyContent: "space-between" }}>
              <Typography sx={{ ...infoHeaders }}>Muscle</Typography>
              <Typography
                variant="h6"
                sx={{
                  ...exerciseSummaryInfo,
                  fontSize: "1rem",
                }}
              >
                {exercise.muscle}
              </Typography>
            </Stack>
          </Grid>
          <Grid
            item
            className="set-count"
            sx={{ border: borders && "1px solid blue" }}
          >
            <Stack sx={{ height: "100%", justifyContent: "space-between" }}>
              <Typography sx={{ ...infoHeaders }}>Sets</Typography>
              <Typography
                variant="h6"
                sx={{ ...exerciseSummaryInfo, fontSize: "1.1rem" }}
              >
                {exercise.sets.length}
              </Typography>
            </Stack>
          </Grid>
          <Grid
            item
            className="expand-icon-container"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: borders ? "1px solid violet" : "none",
            }}
          >
            <ButtonBase
              onClick={handler}
              sx={{ borderRadius: "100%", ...expandIcon }}
            >
              <ExpandMoreRounded />
            </ButtonBase>
          </Grid>
        </Grid>
      </>
    );
  };
  return (
    <>
      <Box
        sx={{
          height: "75vh",
          border: "1px solid green",
        }}
      >
        <Box
          className="exercises-title-bar"
          sx={{
            display: "flex",
            // border: "1px dashed white",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography fontWeight={"light"}>Exercises</Typography>
          <Link href="#">
            <Typography
              fontWeight={"semibold"}
              sx={{
                pr: ".8em",
                fontSize: ".9rem",
                textDecoration: "underline",
                color: colors.blue[500],
              }}
            >
              view all
            </Typography>
          </Link>
        </Box>
        <Stack spacing={"0.7rem"} direction="column">
          {exercises.map((exercise, index) => {
            return summaryCard(exercise);
          })}
        </Stack>
      </Box>
      <ButtonBase
        onClick={addSelected}
        sx={{
          borderRadius: 2,
          backgroundColor: "#ffffff",
          display: "flex",
          //   border: "1px solid white",
          width: "70%",
          px: ".5rem",
          py: ".2rem",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "end",
          mx: "auto",
          position: "relative",
          zIndex: "1",
        }}
      >
        <Typography
          fontWeight={"bold"}
          fontSize="1rem"
          color="primary"
          sx={{ height: "max-content" }}
        >
          Add
        </Typography>
      </ButtonBase>
    </>
  );
};

export default AddExercise;
