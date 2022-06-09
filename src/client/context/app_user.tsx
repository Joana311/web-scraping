import Prisma from "@prisma/client";
import { type } from "os";
import React from "react";

type AppUser = {
  id?: string;
  username?: string;
  workouts?: Prisma.UserWorkout[];
};
type AppData = {
  exercise_directory?: Prisma.Exercise[];
};
export const AppUserContext = React.createContext<AppUser & AppData>({});

export function getExerciseDirectory() {
  return React.useContext(AppUserContext).exercise_directory;
}
export function getAppUser() {
  return React.useContext(AppUserContext);
}

const AppUserProvider = ({ children }: { children: React.ReactNode }) => {
  const appContext = {
    id: "",
    username: "",
    workouts: [],
    exercise_directory: [],
  };

  return (
    <AppUserContext.Provider value={appContext}>
      {children}
    </AppUserContext.Provider>
  );
};

export default AppUserProvider;
