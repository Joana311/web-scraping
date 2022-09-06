import DailyActivitySummary from "../../components/DailyActivitySummary";
import RecentWorkouts from "../../components/RecentWorkouts";
import React from "react";;
import type { NextPage } from "next";

// React Functional Component
const UserPage: NextPage = () => {
  return (
    <div id="daily-summary" className="space-y-[2em] overflow-x-visible border-blue">
      <section id="activity-summary-and-heatmap"
        className={`min-h-max`}
      >
        <DailyActivitySummary />
      </section>
      <section id="recent-workouts"
        className={`min-h-max`}
      >
        <RecentWorkouts />
      </section>
    </div>
  );
};
export default UserPage;



