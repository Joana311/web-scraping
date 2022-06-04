import { Stack, Box, Grid, Typography, Input } from "@mui/material";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import dayjs from "dayjs";
import ExerciseSummary from "../../../components/ExerciseSummary/ExerciseSummary";
import Link from "next/link";
import { Exercise, PrismaClient } from "@prisma/client";
import { GetStaticProps, GetServerSideProps } from "next";
interface WorkoutPageProps {
  exercise_directory: Exercise[];
}
function workout({ exercise_directory }: WorkoutPageProps) {
  const [todaysDate, setTodaysDate] = React.useState(
    dayjs().format("dddd, MMM D")
  );
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#000",
          height: "100vh",
          maxHeight: "100vh",
          pl: "1em",
          pr: "1em",
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden",
        }}
      >
        <Box
          className="nav-bar"
          sx={{
            marginTop: "1em",
            height: "5vh",
            backgroundColor: "#000",
          }}
        >
          <Grid
            container
            sx={{
              // border: "0.5px blue solid",
              justifyContent: "space-between",
            }}
          >
            <Grid
              item
              sx={{
                width: "max-content",
                // border: ".5px solid pink"
              }}
            >
              <span>
                <Typography
                  className="date"
                  color="text.secondary"
                  fontSize={".85rem"}
                  sx={{ pl: "0.2rem" }}
                >
                  {todaysDate}
                </Typography>
              </span>

              <Typography
                variant={"h4"}
                sx={{
                  mt: "-.55rem",
                  fontWeight: "light",
                  minHeight: "max-content",
                }}
              >
                Workout Report
              </Typography>
            </Grid>
            <Grid
              item
              container
              sx={{
                width: "max-content",
                // border: ".5px solid pink",
                alignItems: "center",
                mr: ".6em",
              }}
            >
              <Link as="/guest" href="/[user]">
                <AccountCircleIcon fontSize="large"></AccountCircleIcon>
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            // border: "1px dashed orange",
            mt: "2em",
            mb: ".25em",
            backgroundColor: "inherit",
            height: "100%",
            maxHeight: "100%",
            width: "100%",
          }}
        >
          <ExerciseSummary exrx_data={exercise_directory} />
        </Box>
      </Box>
    </>
  );
}

export default workout;
export const getServerSideProps: GetServerSideProps<WorkoutPageProps> = async (
  context
) => {
  const prisma = new PrismaClient();
  const exercise_directory = await prisma.exercise.findMany();
  return {
    props: {
      exercise_directory: exercise_directory,
    },
  };
};
