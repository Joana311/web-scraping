import { useAppUser } from "@client/providers/app_user.test";
import trpc from "@client/trpc";
import { ExpandMoreRounded, IndeterminateCheckBoxRounded } from "@mui/icons-material";
import {
  Box,
  Grid,
  Stack,
  Typography,
  ButtonBase,
  SxProps,
  Divider,
  Collapse,
  TableCell,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Input,
  colors,
  TextField,
  InputLabel,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import Trpc from "src/pages/api/trpc/[trpc]";
//create a props interface for exercises that will be passed in from ExerciseSummary.tsx
export interface SummaryCardProps {
  exercise: {
    user_exercise_id: string;
    name: string;
    variant: string | null;
    muscle: string | null;
    sets: {
      weight?: number | null;
      reps: number;
      rpe: number;
    }[];
  };
  isFocused: boolean;
  index: number;
  workout_id: string;
  setCurrentFocus: React.Dispatch<React.SetStateAction<number>>;
}
export const CurrentExerciseForm: React.FC<SummaryCardProps> = ({ exercise, isFocused, setCurrentFocus, index, workout_id }) => {
  const [expanded, setExpanded] = React.useState(false);
  const onExpand = () => {
    if (expanded) {
      setCurrentFocus(-1)
      setExpanded(false);
    } else {
      setCurrentFocus(index)
      setExpanded(true);
    }
  };

  React.useMemo(() => {
    setExpanded(isFocused);
  }, [isFocused]);

  const router = useRouter();

  const query_context = trpc.useContext();
  const useAddSet = trpc.useMutation("exercise.add_set", {
    onSuccess: (current_workout, _) => {
      query_context.setQueryData(
        ["workout.get_by_id", { workout_id: workout_id }],
        current_workout
      );
    },
  });

  const borders = false;
  const expandIcon: SxProps = {
    display: "flex",
    transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
    transition: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    transitionProperty: "transform",
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDelay: "0ms",
  };
  const set = React.useRef({
    weight: 0,
    reps: 0,
    rpe: 0,
  });
  const onAddSet = React.useCallback(() => {
    console.log("add set");
    useAddSet.mutate({
      set: set.current,
      user_exercise_id: exercise.user_exercise_id,
      workout_id: workout_id,
    });
  }, [useAddSet, exercise.user_exercise_id, workout_id]);

  return (
    <>
      <Stack
        key={index}
        bgcolor="secondary.main"
        borderRadius={2}
        sx={{
          display: "flex",
          width: "100%",
          px: ".5rem",
          minHeight: "max-content",
        }}
      >
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
            sx={{ border: borders ? "1px solid red" : "" }}
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
            sx={{ border: borders ? "1px solid yellow" : "" }}
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
            sx={{ border: borders ? "1px solid green" : "" }}
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
            sx={{ border: borders ? "1px solid blue" : "" }}
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
              onClick={onExpand}
              sx={{ borderRadius: "100%", ...expandIcon }}
            >
              <ExpandMoreRounded />
            </ButtonBase>
          </Grid>
        </Grid>
        <Collapse className="exercise-details" in={expanded}>
          <Divider sx={{ backgroundColor: "text.secondary" }} />
          <TableContainer
            sx={{
              py: ".25rem",
              px: ".5rem",
              "& .MuiTableCell-root": {
                border: "0",
                py: "0.1rem",
              },
              "& .MuiTableBody-root": {
                "& .MuiTableCell-root": {
                  // border: { borders } && "1px solid pink",
                  fontWeight: 100,
                  fontSize: "1rem",
                },
              },
            }}
          >
            <Table padding="none">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Set</TableCell>
                  <TableCell align="center">Weight</TableCell>
                  <TableCell align="center">Reps</TableCell>
                  <TableCell align="center">RPE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exercise.sets.map((set, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "& .MuiTableCell-root": {
                        maxWidth: "min-content",
                      },
                    }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{set.weight}</TableCell>
                    <TableCell align="center">{set.reps}</TableCell>
                    <TableCell align="center">{set.rpe}</TableCell>
                  </TableRow>
                ))}
                <TableRow
                  sx={{
                    height: ".2rem",
                  }}
                ></TableRow>
                {(
                  <>
                    <TableRow
                      sx={{
                        "& .MuiTableCell-root": {
                          pt: "0.6rem",
                          borderTop: "1px solid",
                          borderColor: "text.secondary",
                        },
                      }}
                    >
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                        }}
                      >
                        {exercise.sets.length + 1}
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          variant="outlined"
                          label="Weight"
                          type="number"
                          color="info"
                          onChange={(e) =>
                            (set.current.weight = parseInt(e.target.value))
                          }
                          InputLabelProps={{
                            shrink: true,
                            disableAnimation: true,
                          }}
                          sx={{ ...inputBox }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          variant="outlined"
                          label="Reps"
                          type="number"
                          color="info"
                          onChange={(e) =>
                            (set.current.reps = parseInt(e.target.value))
                          }
                          InputLabelProps={{
                            shrink: true,
                            disableAnimation: true,
                          }}
                          sx={{ ...inputBox }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          variant="outlined"
                          label="RPE"
                          type="number"
                          color="info"
                          onChange={(e) =>
                            (set.current.rpe = parseInt(e.target.value))
                          }
                          InputLabelProps={{
                            shrink: true,
                            disableAnimation: true,
                          }}
                          sx={{ ...inputBox }}
                        />
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              mx: "-.5rem",
              borderTop: "1px solid white",
              borderBottom: "1px solid white",
              borderRadius: "0 0 .5rem .5rem",
            }}
          >
            <ButtonBase sx={{ width: "100%", py: ".2rem" }} onClick={() => {
              onAddSet()
            }}>
              <Typography fontWeight={"bold"} fontSize="1rem">
                Add Set
              </Typography>
            </ButtonBase>
          </Box>
        </Collapse>
      </Stack>
    </>
  );
};
const inputBox: SxProps = {
  borderRadius: 1,
  // border: "1px solid white",
  fontSize: "1.2rem",
  width: "7ch",
  fontWeight: "semi-bold",
  fontFamily: "monospace",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "text.secondary",
  },

  "& .Mui-focused": {
    borderColor: "#fff",
  },

  "& .MuiTextField-root": {},
  "& .MuiInputBase-input": {
    pl: "0.8rem",
    py: "0.2rem",
    "& .MuiInputLabel-root": {
      margin: 0,
    },
  },
};
const infoHeaders: SxProps = {
  fontSize: ".8rem",
  fontWeight: "regular",
  color: "text.secondary",
};
const exerciseSummaryInfo: SxProps = {
  mt: "-.4rem",
  fontWeight: "light",
  width: "max-content",
  alignSelf: "center",
  mb: "-.25rem",
};
