import {
  Box,
  colors,
  Grid,
  Stack,
  Typography,
  Button,
  ButtonBase,
} from "@mui/material";
import { Exercise } from "@prisma/client";
import Link from "next/link";
import React from "react";

const RecentWorkouts = () => {
  const [showMore, toggleShowMore] = React.useState(false);
  const w1 = {
    start: "8:00AM",
    end: "10:00AM",
    exercises: 8,
    sets: 36,
    estimated_cals: 1000,
  };
  const w2 = {
    start: "10:00AM",
    end: "1:00PM",
    exercises: 10,
    sets: 47,
    estimated_cals: 8000,
  };
  const leftSize = 7.5;
  const workouts = [w1, w2];
  workouts.length > 2 && toggleShowMore(true);

  const RecentWorkoutCard = (workout) => {
    return (
      <>
        <Box
          bgcolor="secondary.main"
          borderRadius={2}
          sx={{
            display: "flex",
            // border: "1px dashed white",
            width: "100%",
            pl: ".5rem",
            pr: ".5rem",
            height: "max-content",
          }}
        >
          <Grid container>
            <Grid
              item
              className="time-range"
              xs={leftSize}
              sx={{
                // border: "1px solid pink",
                width: "100%",
              }}
            >
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "start",
                  alignItems: "end",
                  pb: ".3rem",
                  width: "100%",
                  height: "100%",
                  // border: "1px solid yellow",
                }}
              >
                <Box
                  className="start-time"
                  sx={{
                    height: "max-content",
                    // border: "1px solid blue",
                    // display: "flex",
                    minWidth: "5.5rem",
                  }}
                >
                  <Stack sx={{}}>
                    <Typography
                      fontSize={".8rem"}
                      fontWeight="regular"
                      color="text.secondary"
                      sx={{
                        alignSelf: "center",
                        maxWidth: "max-content",
                      }}
                    >
                      {" "}
                      Start{" "}
                    </Typography>
                    <Typography
                      mt="-.4rem"
                      fontWeight="light"
                      variant="h6"
                      width={"max-content"}
                      alignSelf="center"
                    >
                      {" "}
                      {workout.start}{" "}
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    mt: "1rem",
                    mx: ".6rem",
                    // border: "1px solid blue",
                    width: "min-content",
                    height: "min-content",
                  }}
                >
                  <Typography variant="h6" width={"max-content"}>
                    -
                  </Typography>
                </Box>
                <Box
                  className="stop-time"
                  sx={{
                    // border: "1px solid blue",
                    height: "max-content",
                    minWidth: "5.5rem",
                  }}
                >
                  <Stack>
                    <Typography
                      fontSize={".8rem"}
                      fontWeight="regular"
                      color="text.secondary"
                      sx={{
                        alignSelf: "center",
                        maxWidth: "max-content",
                      }}
                    >
                      {" "}
                      Stop{" "}
                    </Typography>
                    <Typography
                      mt="-.4rem"
                      fontWeight="light"
                      variant="h6"
                      width={"max-content"}
                      alignSelf="start"
                    >
                      {" "}
                      {workout.end}{" "}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            <Grid
              item
              component={Box}
              xs={12 - leftSize}
              sx={{
                display: "flex",
                justifyContent: "start",
                // border: "1px solid green",
              }}
            >
              <Stack
                spacing="-0.2rem"
                sx={{
                  paddingTop: ".2rem",
                  //   border: "1px dashed red",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontSize: ".85rem" }}>
                  Exercises: {workout.exercises}
                </Typography>
                <Typography sx={{ fontSize: ".85rem" }}>
                  Sets: {workout.sets}
                </Typography>
                <Typography sx={{ fontSize: ".85rem" }}>
                  Cals Burned: {workout.estimated_cals}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };

  return (
    <>
      <Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography fontWeight={"light"}>Today's Workouts</Typography>
          {showMore ? (
            <Link href="">
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
          ) : (
            <></>
          )}
        </Box>
        <Stack spacing={"0.5rem"}>
          {workouts.map((workout, index) => {
            return RecentWorkoutCard(workout);
          })}
          <Link as={`/guest/workout`} href="/[user]/workout">
            <ButtonBase
              sx={{
                borderRadius: 2,
                backgroundColor: "secondary.main",
                display: "flex",
                border: "1px solid white",
                width: "100%",
                px: ".5rem",
                py: ".2rem",
                height: "max-content",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography fontWeight={"bold"} fontSize=".9rem">
                Add Workout
              </Typography>
            </ButtonBase>
          </Link>
        </Stack>
      </Stack>
    </>
  );
};

export default RecentWorkouts;
