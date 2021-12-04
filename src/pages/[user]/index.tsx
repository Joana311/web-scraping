import { gql } from "@apollo/client";
import apolloClient from "../../../lib/apollo";
import { GetServerSideProps, NextPageContext } from "next";
import { UserWorkouts } from "../../containers/UserWorkouts";
const grabUserQuery = gql`
  query GrabSingleUser($name: String, $email: String) {
    grabSingleUser(name: $name, email: $email) {
      email
      exerciseHistory {
        date
        sets {
          exerciseID
          reps
          rpe
        }
      }
      id
      name
    }
  }
`;

export interface User {
  name: string;
  email: string;
  id: string;
  exerciseHistory: {} | undefined;
}

export interface UserPageProps {
  user: User;
}
export default function user({ user }: UserPageProps) {
  return (
    <div>
      <h1>{user.name}'s Profile</h1>
      <div>
          <h3>Workouts</h3>
          <UserWorkouts user={user}/>
      </div>
      <div>
          <h3>{user.name}'s Exercises</h3>
      </div>
    </div>
  );
}
//cannot use apollo's useQuery hook inside of another react hook must use the client
export const getServerSideProps: GetServerSideProps = async (
  NextPageContext
) => {
  const { data } = await apolloClient.query({
    query: grabUserQuery,
    variables:{name: NextPageContext.query.user}
  });
  //console.log(data.grabSingleUser)
  return {props: {user: data.grabSingleUser}}
};
