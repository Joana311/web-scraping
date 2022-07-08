import { Stack, Box, Grid, Typography, Input } from "@mui/material";
import React from "react";
import { Set as Prisma_Set, Exercise, PrismaClient } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import trpc from "@client/trpc";
import ExerciseSummary from "src/components/ExerciseSummary/ExerciseSummary";
import { useSession } from "next-auth/react";

const Workout = () => {
  const router = useRouter();
  let { query: { workout_id } } = router;
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
      if (error.message.includes("already exists")) {
        router.push(`/${router.query.user}`);
      }
    },
  });

  // createWorkout client side
  React.useEffect(() => {
    if (mutationRef.current) { return }
    if (workout_id === 'new' && typeof window !== "undefined") {
      console.log("creating workout")
      createWorkout.mutate();
      mutationRef.current = true;
    }
  }), [workout_id as string];

  const { data: workout } = trpc.useQuery(["workout.get_by_id",
    { workout_id: workout_id as string }],
    { enabled: workout_id !== "new" });

  return (
    <>
      <section
        id="workout-exercises"
        className="mb-[2rem] mt-[2em]"
      >
        {!!workout? (
          <ExerciseSummary
            workout_id={workout.id! as string}
          />
        ) : (
          <>There was an error</>
        )}
      </section>
      <span>bottom</span>

    </>
  );
};
export default Workout;