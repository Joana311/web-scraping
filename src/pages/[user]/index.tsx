import DailyActivitySummary from "../../components/DailyActivitySummary";
import RecentWorkouts from "../../components/RecentWorkouts";
import React from "react";
import trpc from "@client/trpc";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

// React Functional Component
const UserPage: NextPage = () => {
  return (
    <>
      <section id="activity-summary-and-heatmap"
        className={`mt-[2em] min-h-max`}
      >
        <DailyActivitySummary />
      </section>
      <section id="recent-workouts"
        className={`mt-[2em] min-h-max`}
      >
        <RecentWorkouts />
      </section>
      {/* {!!data && <Link id='prepass' href={{
          pathname: "/[user]/workout/[workout_id]", query: {
            workout_id: data?.id,
            user: router.query.user as string,
          }
        }} >
          <a className="hidden" />
        </Link>} */}
    </>
  );
};
export default UserPage;



