/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import { VehiclePerson } from '../../api/VehiclePerson';

export interface ListProps {
    userList?: VehiclePerson[];
}

export default function List({userList}: ListProps){
    return (
        <div>
            {userList?.map ((u,index) => (
                <div key={index}>
                    <Link as= { `/${u.vehicle}/${u.userName}` } href='/[vehicle]/[person]'>
                    <a>Navigate to {u.userName}'s {u.vehicle}</a>
                </Link>
                </div>
            ))} 
        <Link href={'/Homepage'}>Home</Link>
        </div>
    );
}

List.getInitialProps = async() => {
    const response = await fetch('http://localhost:4001/vehicles');
    const userList: VehiclePerson[] = await response.json();
    return { userList: userList};
}