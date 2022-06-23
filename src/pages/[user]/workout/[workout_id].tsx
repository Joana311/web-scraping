import { Stack, Box, Grid, Typography, Input } from "@mui/material";
import React from "react";
import { Set as Prisma_Set, Exercise, PrismaClient } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import trpc from "@client/trpc";
import ExerciseSummary from "src/components/ExerciseSummary/ExerciseSummary";
import { useSession } from "next-auth/react";

type Set = Omit<Prisma_Set, "id" | "updatedAt">;

const Workout: NextPage = () => {
  const router = useRouter();
  let { query: { workout_id } } = router;
  const session = useSession();

  const mutationRef = React.useRef(false);
  const createWorkout = trpc.useMutation("workout.create_new", {
    ssr: false,
    onSuccess(new_workout) {
      router.replace({
        query: {
          ...router.query,
          workout_id: new_workout.id
        }
      });
    },
    onError(error, variables, context) {
      // console.log(context)
      // console.error(error);
      if (error.message.includes("already exists")) {
        router.push(`/${session?.data?.user.name}`);
      }
    },
  });
  // createWorkout client side
  React.useEffect(() => {
    if (mutationRef.current) { return }

    console.log("rendering")
    if (workout_id === 'new' && typeof window !== "undefined") {
      createWorkout.mutate();
      mutationRef.current = true;
    }
  }), [workout_id as string];

  const { data: workout } = trpc.useQuery(["workout.get_by_id",
    { workout_id: workout_id as string }],
    { enabled: workout_id !== "new" });

  return (
    <>
      <Box
        className=""
        sx={{
          backgroundColor: "#000",
          height: "100vh",
          maxHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden",
          border: "1px solid orange",
        }}
      >
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
          {workout?.exercises != undefined ? (
            <ExerciseSummary
              workout_id={workout.id! as string}
            />
          ) : (
            <>There was an error</>
          )}
        </Box>
      </Box>
    </>
  );
};
export default Workout;