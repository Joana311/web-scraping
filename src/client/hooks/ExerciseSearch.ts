import trpc, { inferQueryOutput } from "@client/trpc";
import { useRouter } from "next/router";
import React from 'react'
import create from "zustand";
type Exercise = inferQueryOutput<"exercise.public.directory">[0];

type ExerciseStore = {
    exercises: Exercise[];
    setExercisesFromServer: (take?: number) => void;
    setFilteredExercises: (filtered: Exercise[]) => void;
    setExercises: (exercises: Exercise[]) => void;

}

const queryClient = trpc.useContext()
const useExerciseStore = create<ExerciseStore>((set) => {

    // const searchTerm = useRouter().query.term as string
    // const filteredExercises = [] as Exercise[]
    return {
        exercises: [] as Exercise[],
        filteredExercises: [] as Exercise[],
        async setExercisesFromServer(take = 100) {
            const res = await queryClient.getQueryData(["exercise.public.directory"])
            // exercises: exercises.push(...res)
            // res && set((state) => { ...state, state.exercises.push(...res) })
        },
        async searchExercises(query: string, tags: string[]) {
            const res = await queryClient.getQueryData(["exercise.public.search_exercises", { query }])
            // if (res) {
            //     exercises.push(...res)
            //     let filtered = exercises.filter(exercise => {
            //         let term = query.toLowerCase()
            //         let in_name = exercise.name.toLowerCase().includes(term)
            //         let in_equipment = exercise.equipment_name?.toLowerCase().includes(term)
            //         let contains_tag = tags.some(tag => exercise.force?.includes(tag))
            //         return (in_name || in_equipment) && contains_tag
            //     })
            //     set({ filteredExercises: filtered })
            // }
        },
        setFilteredExercises(filtered: Exercise[]) {
            // set((state) => { ...state, state.filteredExercises: filtered })
        },
        setExercises(exercises: Exercise[]) {
            // set((state) => { ...state, state.exercises: exercises })
        }
    }
});
