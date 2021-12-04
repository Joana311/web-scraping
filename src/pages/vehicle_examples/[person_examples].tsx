import fetch from 'isomorphic-unfetch';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { VehiclePerson } from '../../../api/VehiclePerson';

export interface personProps{
    userList?: VehiclePerson[];
}
interface myNexyPageContext extends NextPageContext{
    query:{
        person: string;
        vehicle: string;
    }
}
export default function person({userList}: personProps){
    const router = useRouter();

    const [user,setUsers] = useState(userList);
    useEffect(() => {
        async function loadData(){
            const response = await fetch('http://localhost:4001/vehicles?userName=' +
                router.query.person +
                '&vehicle=' +
                router.query.vehicle);
                const userList: VehiclePerson[] | undefined = await response.json();
                setUsers(userList);
            }
            if (userList?.length == 0) {
                loadData();
            }
        }, []);
    if (!user?.[0]) {
        return <div>loading...</div>;
    }

    //return <pre>{JSON.stringify(userList, null, 4)}</pre>
     return ( 
        <div>
            <h1>{router.query.person}'s {router.query.vehicle}</h1>
                <h2>Details</h2>
                    <a>{user?.[0]?.details}</a>
        </div> 
     );
}                           

person.getInitialProps = async(ctx: myNexyPageContext) => {
    if(!ctx.req){
        return { userList: [] };
    }
    const query = ctx.query
    //const { query } = ctx;
    const response = await fetch('http://localhost:4001/vehicles?userName=' +
        query.person +
        '&vehicle='+
        query.vehicle);
    const userList: VehiclePerson[] | undefined = await response.json();
    return { userList: userList }

}