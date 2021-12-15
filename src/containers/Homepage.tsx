import Link from "next/link";
import { useState, useEffect } from "react";

export function HomePage({muscleGroupData}) {
  const [muscleGroups, setMuscleGroups] = useState(muscleGroupData);
  return (
    <div>
      <h1>Hello Sexy</h1>
      <Link href={"/List"}>View List</Link>
      <br />
      <Link href={"/api/graphql"}>graphql</Link>
      <br/>
      <Link href={"/ExercisesDirectory"}>View Exercises</Link>
    </div>
  );
}
HomePage.getInitialProps = async() => {
  const data = 'hellomoto'
  return {muscleGroupData: data};
};
