import trpc from "../trpc";
import Prisma, { Exercise } from "@prisma/client";
import { UserWorkoutWithExercises } from "__dep__lib/mutations/createWorkout";
import { useRouter } from "next/router";
import React from "react";
import { TRPCUseQueryBaseOptions, UseTRPCQueryOptions } from "@trpc/react";
import { QueryObserverOptions } from "react-query";

export const useGetByUserName = (
  userName: string,
  onSuccess: (data: Prisma.User & {}) => any,
  enabled: boolean
) =>
  trpc.useQuery(["user.get_by_name", { name: userName }], {
    refetchOnMount: false,
    onSuccess: onSuccess,
    enabled: enabled,
  });
export const useGetCurrentWorkout = (userID: string) =>
  trpc.useQuery(["workout.current_by_owner_id", { owner_id: userID }]);

export const useGetUserWorkouts = (userID: string) =>
  trpc.useQuery(["workout.all_by_owner_id", { owner_id: userID }], {
    refetchOnMount: false,
  });

export const useCreateNewWorkout = () =>
  trpc.useMutation(["workout.create"], {
    onSuccess: () => {
      trpc.useContext().invalidateQueries(["workout.current_by_owner_id"]);
    },
  });
export const useLogin = () => trpc.useMutation(["user.login"]);
export const AppUserContext = React.createContext({
  set_id: (() => {}) as React.Dispatch<
    React.SetStateAction<string | undefined>
  >,
  set_username: (() => {}) as React.Dispatch<
    React.SetStateAction<string | undefined>
  >,
  get_id: undefined as string | undefined,
  get_username: undefined as string | undefined,
  exercise_directory: [] as Prisma.Exercise[],
});

export function useAppUser() {
  return React.useContext(AppUserContext);
}
const AppUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userID, setUserID] = React.useState<string>();
  const [userName, setUserName] = React.useState<string>();

  const { data: exrx_data } = trpc.useQuery(["exercise.directory"], {
    refetchOnMount: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const ex_data = React.useRef(exrx_data || []);
  if (exrx_data) {
    ex_data.current = exrx_data;
  }

  const appContext = {
    set_id: setUserID,
    set_username: setUserName,
    get_id: userID,
    get_username: userName,
    exercise_directory: ex_data.current,
  };
  type AppUserContextType = typeof appContext;

  return (
    <AppUserContext.Provider value={appContext as AppUserContextType}>
      {children}
    </AppUserContext.Provider>
  );
};
export default AppUserProvider;
