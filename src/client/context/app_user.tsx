import trpc from "../trpc";
import Prisma, { Exercise } from "@prisma/client";
import { UserWorkoutWithExercises } from "__dep__lib/mutations/createWorkout";
import { useRouter } from "next/router";
import React from "react";

type AppUser = {
  id?: string;
  username?: string;
  workouts?: UserWorkoutWithExercises[];
  current_workout?: UserWorkoutWithExercises;
  create_new_workout?: any;
};
type AppData = {
  exercise_directory?: Prisma.Exercise[];
};
export const AppUserContext = React.createContext<AppUser & AppData>({});

// export function getExerciseDirectory() {
//   return React.useContext(AppUserContext).exercise_directory || [];
// }
export function getAppUser() {
  return React.useContext(AppUserContext);
}
// const trpc_utils = trpc.useContext();
const AppUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<
    Omit<AppUser, "resolve_by_name" | "create_new_workout">
  >({});
  const { data: exrx_data } = trpc.useQuery(["exercise.directory"], {
    refetchOnMount: false,
  });
  const [currentWorkout, setCurrentWorkout] = React.useState({});
  const createNewWorkout = trpc.useMutation(["workout.create"], {
    onSuccess: () => {
      trpc.useContext().invalidateQueries(["workout.current_by_owner_id"]);
    },
  });
  const exercise_directory = React.useRef<Exercise[]>([]);

  // Get the User

  if (user?.username) {
    const {
      data: user_data,
      isLoading: user_isLoading,
      error: user_error,
    } = trpc.useQuery(["user.get_by_name", { name: user.username }], {
      refetchOnMount: false,
      // enabled: !!user?.username,
    });
    if (user_data) {
      setUser((prev) => ({
        ...prev,
        id: user_data?.id,
        username: user_data?.name,
      }));
    }
    if (user_error) {
      console.error(user_error);
      // TODO: handle error
      // redirect to login page
      useRouter().push("/");
    }
  }

  // Get the user's Workouts
  React.useEffect(() => {
    if (user.id) {
      let {
        data: workouts_data,
        isLoading: is_loading_workouts,
        error: workouts_error,
      } = trpc.useQuery(
        [
          "workout.all_by_owner_id",
          {
            owner_id: user.id ?? "",
          },
        ],
        {
          refetchOnMount: false,
        }
      );
      if (workouts_data) {
        setUser((prev) => ({
          ...prev,
          workouts: workouts_data,
        }));
      }
      if (workouts_error) {
        // TODO: handle error
        // redirect to user page
        console.error(workouts_error);
        useRouter().push(`/${user.username}`);
      }
    }
  }, [user.id != undefined]);
  React.useEffect(() => {
    if (user.id && user.current_workout) {
      let { data: current_workout_data, error: current_workout_error } =
        trpc.useQuery(["workout.current_by_owner_id", { owner_id: user.id }]);
      if (current_workout_data) {
        setCurrentWorkout(current_workout_data);
      }
      if (current_workout_error) {
        // TODO: handle error
        console.error(current_workout_error);
      }
    }
  }, [user.workouts?.at(0) != undefined]);
  const appContext = {
    id: user.id,
    username: user.username,
    workouts: user.workouts,
    exercise_directory: [] as Prisma.Exercise[],
    create_new_workout: createNewWorkout,
  };

  return (
    <AppUserContext.Provider value={appContext}>
      {children}
    </AppUserContext.Provider>
  );
};

export default AppUserProvider;
