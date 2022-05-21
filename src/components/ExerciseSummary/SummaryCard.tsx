import { ExpandMoreRounded } from "@mui/icons-material";
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
} from "@mui/material";
import React, { Fragment } from "react";
//create a props interface for exercises that will be passed in from ExerciseSummary.tsx
interface ExerciseSummaryProps {
  exercise: {
    name: string;
    variant: string;
    muscle: string;
    sets: {
      reps: number;
      weight: number;
      rpe: number;
    }[];
  };
}
export const SummaryCard = ({ exercise }: ExerciseSummaryProps) => {
  const [expanded, setExpanded] = React.useState(false);
  const handler = () => {
    setExpanded((prev) => !prev);
  };
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
  return (
    <>
      <Stack
        bgcolor="secondary.main"
        borderRadius={2}
        sx={{
          display: "flex",
          border: "1px dashed white",
          width: "100%",
          px: ".5rem",
          minHeight: "max-content",
        }}
      >
        <Grid
          container
          component={Box}
          className="exercise-summary"
          sx={{ justifyContent: "space-between", height: "min-content" }}
        >
          <Grid
            item
            className="exercise-name"
            sx={{ border: borders && "1px solid red" }}
          >
            <Stack sx={{ height: "100%" }}>
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
            <Stack sx={{ height: "100%" }}>
              <Typography sx={{ ...infoHeaders }}>Variant</Typography>
              <Typography variant="h6" sx={{ ...exerciseSummaryInfo }}>
                {exercise.variant}
              </Typography>
            </Stack>
          </Grid>
          <Grid
            item
            className="target-muscle"
            sx={{ border: borders && "1px solid green" }}
          >
            <Stack sx={{ height: "100%" }}>
              <Typography sx={{ ...infoHeaders }}>Muscle</Typography>
              <Typography variant="h6" sx={{ ...exerciseSummaryInfo }}>
                {exercise.muscle}
              </Typography>
            </Stack>
          </Grid>
          <Grid
            item
            className="set-count"
            sx={{ border: borders && "1px solid blue" }}
          >
            <Stack sx={{ height: "100%" }}>
              <Typography sx={{ ...infoHeaders }}>Sets</Typography>
              <Typography variant="h6" sx={{ ...exerciseSummaryInfo }}>
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
        <Collapse in={expanded}>
          <Divider sx={{ backgroundColor: "text.secondary" }} />
          <TableContainer
            sx={{
              py: ".25rem",
              px: ".5rem",
              "& .MuiTableCell-root": {
                border: "0",
                py: "0.1rem",
                pl: "0.5rem",
              },
              "& .MuiTableBody-root": {
                "& .MuiTableCell-root": {
                  border: "0",
                  fontWeight: "light",
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
                  <TableRow key={index} sx={{}}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{set.weight}</TableCell>
                    <TableCell align="center">{set.reps}</TableCell>
                    <TableCell align="center">{set.rpe}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Stack>
    </>
  );
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
