import PropTypes from 'prop-types';
import { NextPage } from "next";
export interface User {
    name: string;
    email: string;
    id: string;
    exerciseHistory: {} | undefined;
}
interface Props{
    user: User
}

export const UserWorkouts: NextPage<Props> = (props) => {
    //have to destructre the interface
    const { user } = props;
    //console.log(props)
    return(
        <>
        {console.log(user.exerciseHistory)}
        {}
        <a>{user.exerciseHistory? ()=>{} : "Nothing Logged Yet"} </a>
        </>
    );
};