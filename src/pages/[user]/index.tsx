import DailyActivitySummary from "../../components/DailyActivitySummary";
import RecentWorkouts from "../../components/RecentWorkouts";
import React from "react";
import trpc from "@client/trpc";
import type { NextPage } from "next";

// React Functional Component
const UserPage: NextPage = () => {
  // const { data: session, isLoading } = trpc.useQuery(["next-auth.get_session"], {
  //   onSuccess(data) {
  //   },
  // });

  // const { data: workouts } = trpc.useQuery(
  //   ["workout.all_by_owner_id", { owner_id: session?.user.id! as string }],
  //   {
  //     enabled: !!user?.get_id,
  //   }
  // );
  // const { data: workouts } = trpc.useQuery(["workout.get_recent", { amount: 5 }], {
  //   enabled: typeof window !== "undefined",
  // })
  // console.log(user);
  return (
    <>
      <div id="page-container"
        className="flex flex-col grow bg-black"
      >
        <section id="activity-summary"
          className={`mt-[2em] min-h-max`}
        >
          <DailyActivitySummary />
        </section>
        <section id="recent-workouts"
          className={`mt-[2em] min-h-max`}
        >
          <RecentWorkouts />
        </section>
      </div>
    </>
  );
};
export default UserPage;



