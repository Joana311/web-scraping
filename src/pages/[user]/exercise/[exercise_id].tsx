import trpc from "@client/trpc";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
// reture as a page component
import React from "react";
// make an enum version of following Array
const RecentDataTableHeaders = [
    "weight",
    "reps",
    "rpe",
    "date",
]
type HeadersEnum = "weight" | "reps" | "rpe" | "date"


const UserExercisePage: NextPage = () => {
    const router = useRouter();
    const exercise_id = router.query.exercise_id as string;


    const { data: userExercise, isLoading: exercise_isLoading } = trpc.useQuery(["user.me.get_exercise_data_by_id", { exercise_id }], { enabled: !!exercise_id, staleTime: 1000 * 60 * 30, });
    console.log(router, exercise_id)
    return (
        <div id="users-exercise-history" className="flex flex-col space-y-[.6rem] overflow-hidden bg-card-dark px-2 rounded-md pb-10 pt-2">
            {userExercise?.exercise &&
                <div id="exercise-name-and-exrx-link"
                    className="flex flex-col">
                    <h1 className="text-2xl capitalize">{userExercise?.exercise.name}</h1>
                    <a href={userExercise?.exercise.href || ''} className={`${!userExercise?.exercise.href && "disabled"}
                disabled:no-underline disabled:text-gray-600 text-blue disabled:pointer-events-none underline`} target="_blank" rel="noreferrer">view in exrx.net</a>
                </div>
            }
            <div id="exercise-info" className="flex flex-col">
                <span className="capitalize">
                    <span className="text-xs rounded-sm px-1 mr-2 bg-gray-500/90 font-bold text-black">Force Action:</span> {userExercise?.exercise.force}
                </span>
                <span className="capitalize">
                    <span className="text-xs rounded-sm px-1 mr-2 bg-gray-500/90 font-bold text-black">Target Muscles:</span> {userExercise?.exercise.muscle_name}
                </span>
                <span className="capitalize">
                    <span className="text-xs rounded-sm px-1 mr-2 bg-gray-500/90 font-bold text-black">Equipment Variant:</span> {userExercise?.exercise.equipment_name}
                </span>
            </div>
            <div id="user-historic-data">
                <h2 className="text-xl">Recent Data</h2>
                <div id="user-historic-data-list" className="no-scrollbar flex flex-col space-y-4 bg-card rounded md shadow-md shadow-black/50 min-h-[5rem] max-h-[16rem] overflow-y-scroll px-2 pb-2 relative">
                    {userExercise && userExercise.sets.length > 0
                        ?
                        <div className="table w-full overflow-y-scroll" >
                            <div className="table-header-group sticky top-0">
                                <div className="table-row">
                                    {RecentDataTableHeaders.map((header, i) => <div className="table-cell border-b border-text.secondary  bg-card    ">
                                        <span className="text-xs px-1 font-bold text-text.secondary capitalize">{header}</span>
                                    </div>)}
                                </div>
                            </div>

                            <div className="table-row-group h-[5rem] overflow-y-scroll">
                                {userExercise.sets.map((set) => {
                                    // create a new set with the
                                    let formatted_set = {} as { [key in HeadersEnum]: string }
                                    formatted_set["reps"] = set.reps.toString()
                                    formatted_set["rpe"] = set.rpe.toString()
                                    formatted_set["weight"] = set.weight?.toString() || "None"
                                    formatted_set["date"] = dayjs(set.updated_at).format("MM/DD/YY HH:mm")
                                    return (
                                        <div key={set.id} className="table-row">
                                            {RecentDataTableHeaders.map((header) => {
                                                {/* 1 row each for weight, reps, rpe and date in MM/DD/YY HH:MM */ }
                                                let key = header as HeadersEnum
                                                let value = formatted_set[key]

                                                return (
                                                    <div className="table-cell">
                                                        <span className="text-xs px-1  capitalize">{formatted_set[key]}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })
                                }
                            </div>

                        </div>
                        :
                        <span className="text-text.secondary text-sm capitalize text-center my-auto"> No Data For This Exercise. </span>}
                </div>
            </div >
        </div >
    )
}

export default UserExercisePage;