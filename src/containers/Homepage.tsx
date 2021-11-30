import Link from "next/link";
import { useState, useEffect } from "react";

export function HomePage({muscleGroupData}) {
  const [muscleGroups, setMuscleGroups] = useState(muscleGroupData);
  return (
    <div>
      <h1>Hello Kav</h1>
      <Link href={"/List"}>View List</Link>
      <br />
      <Link href={"/Exercises"}>View Exercises</Link>
      <div>
        {muscleGroups.map(
          (muscleGroup: { name: string; href: string; muscles: {} }, index) => {
            return (
              <>
                <h1 key={index}>{muscleGroup.name} </h1>
              </>
            );
          }
        )}
      </div>
    </div>
  );
}
HomePage.getInitialProps = async() => {
  const res = await fetch("http://localhost:4001/ExercisesByMuscleGroups?");
  const data = await res.json();
  return {muscleGroupData: data};
};
