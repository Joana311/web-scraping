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
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/router";
import React from "react";
import CancelIcon from '@mui/icons-material/Cancel';

//create a props interface for exercises that will be passed in from ExerciseSummary.tsx
export interface SummaryCardProps {
  exercise: {
    user_exercise_id: string;
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

  const router = useRouter();
  const selfRef = React.useRef<HTMLLIElement>(null);
  const query_context = trpc.useContext();
  const useAddSet = trpc.useMutation("exercise.add_set", {
    onSuccess: (current_workout, _) => {
      console.log(selfRef.current)
      // selfRef.current?.remove();
      query_context.setQueryData(
        ["workout.get_by_id", { workout_id: workout_id }],
        current_workout
      );
    },
  });
  const useDeleteSet = trpc.useMutation("exercise.remove_set", {
    onSuccess: (current_workout, _) => {
      query_context.setQueryData(
        ["workout.get_by_id", { workout_id: workout_id }],
        current_workout
      );
    },
  });
  const useRemoveEx = trpc.useMutation("exercise.remove_from_current_workout", {
    onSuccess(updated_workout) {
      query_context.invalidateQueries("workout.get_by_id");
      if (workout_id) {
        query_context.setQueryData(
          ["workout.get_by_id", { workout_id }],
          updated_workout
        );
      }
    },
  })
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
    useRemoveEx.mutate({ exercise_id: exercise.user_exercise_id })
  }, [exercise.user_exercise_id, useRemoveEx]);
  const onDeleteExercise = React.useCallback(() => {
    if (!selfRef.current) return;
    // selfRef.current.scrollLeft = 0;
    selfRef.current.classList.add("-translate-x-[100vw]");
    selfRef.current.ontransitionend = () => {
      useRemoveEx.mutate({ exercise_id: exercise.user_exercise_id });
      // dbRemove();
    }
  }, [dbRemove]);
  return (
    <>
      <li id={`card-container-${exercise.user_exercise_id}`}
        ref={selfRef}
        // eslint-disable-next-line
        className="
        no-scrollbar
        flex
        grow
        min-h-min
        max-h-min
        scale-100
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
          className="flex min-h-min min-w-full
          grow
          snap-start 
          flex-col
          rounded-lg
        bg-secondary">

          <section id="overview-container"
            onClick={onExpand}
            className="flex justify-between space-x-[1rem] py-1 capitalize mx-3">
            <div id="overview-info" className="w-full">
              <div
                id="exercise-name"
                className="flex flex-col border-red-500">
                <label className="text-[.8rem] leading-none text-text.secondary">Exercise</label>
                <span className='text-xl leading-none'>
                  {exercise.name}
                </span>
              </div>
              <div id="additional-info" className="flex space-x-6 pt-[.2rem]">
                <div
                  id="exercise-variant"
                  className="flex flex-col border-yellow-500 leading-snug">
                  <label className="text-[.6rem] text-text.secondary">Variant</label>
                  <span className='text-[1rem] font-light leading-none'>
                    {exercise.variant}
                  </span>
                </div>
                <div id="target-muscle"
                  className="flex flex-col flex-nowrap border-green-500 leading-snug">
                  <label className="text-[.6rem] text-text.secondary">Muscle</label>
                  <span className='text-ellipsis whitespace-nowrap text-[1rem] font-light leading-none'>
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
              <Box
                sx={{ borderRadius: "100%", ...expandIcon }}
              >
                <ExpandMoreRounded />
              </Box>
            </div>
          </section>
          <Collapse id="exercise-set-details" in={expanded}>
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
                      sx={{
                        "& .MuiTableCell-root": {
                          maxWidth: "min-content",
                        }
                      }}
                      key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{set.weight}</TableCell>
                      <TableCell align="center">{set.reps}</TableCell>
                      <TableCell align="center">{set.rpe}</TableCell>
                      {is_open &&
                        <td className="absolute right-[1rem] overflow-visible ">
                          <button className="relative   m-0 flex items-center  justify-center border-blue p-0">
                            <CancelIcon
                              onClick={() => onDeleteSet(set.id)}
                              className="relative"
                              fontSize="inherit" />
                          </button>
                        </td>}
                    </TableRow>
                  ))}
                  <TableRow
                    sx={{
                      height: ".2rem",
                    }}
                  ></TableRow>
                  {(
                    <>
                      {is_open && <TableRow
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
                      </TableRow>}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {is_open &&
              <ButtonBase className='rounded-b-lg' sx={{
                border: "1px solid white", width: "100%", py: ".2rem",
                borderRadius: "0 0 .5rem .5rem",
              }} onClick={() => {
                onAddSet()
              }}>
                <span className="text-[1rem] font-bold">
                  Add Set
                </span>
              </ButtonBase>}
          </Collapse>
        </div>
        {is_open &&
          <div id="remove-exercise-button"
            className={`my-2 flex snap-end items-stretch rounded-lg bg-red-700 transition-all ${(expanded) && "hidden"}`}>
            <ButtonBase className="text-[2.5rem]"

              onClick={onDeleteExercise}
              sx={{
                minHeight: "fill",
                px: ".5rem",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <DeleteIcon fontSize="inherit" />
            </ButtonBase>
          </div>}
      </li>
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
    pl: "0.6rem",
    py: "0.2rem",
    "& .MuiInputLabel-root": {
      margin: 0,
    },
  },
};


