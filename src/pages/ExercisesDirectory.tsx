import Link from "next/link";
import { useState, useEffect } from "react";
import { resolvers } from "../../graphql/resolvers";
import { createContext } from "../../graphql/context";
import { gql } from "@apollo/client";
import apolloClient from "../../lib/apollo";
import internal from "stream";
import { Exercise } from "@prisma/client";
import { GetServerSideProps } from "next";
const allExercisesQuery = gql`
  query getExercises {
    allExercises {
      id
      name
      url
    }
  }
`;
export interface ExecercisePageProps {
  exercises: Exercise[];
}
export default function ExercisesDirectory({ exercises }: ExecercisePageProps) {
  return (
    <div>
      <h1>Exercise Directory</h1>
      <div>
        {console.log({ exercises})}
        {exercises.map(
          (
            exercise: { id: number; name: string; url: string }, index: number
          ) => {
            return (
              <>
              {/* {console.log(exercise.id)} */}
                <div key={index.toString()}>
                <h2 >{exercise.name} </h2>
                <a href={exercise.url}>{exercise.url}</a>
                </div>
              </>
            );
          }
        )}
      </div>
    </div>
  );
}
//cannot use apollo's useQuery hook inside of another react hook must use the client
export const getServerSideProps: GetServerSideProps = async () => {
  //const {data,error,loading} = useQuery(allExercisesQuery);
  // if(loading) return <p>Loading...</p>;
  // if(error) return <p>Oops sometihng went wrrong {error.message}</p>;
  const { data } = await apolloClient.query({
    query: allExercisesQuery,
  });

  const res: Exercise[] = data.allExercises;
  //console.log({props: { exercises: res}})
  //console.log({res})
  return { props: {exercises: res} };
};
