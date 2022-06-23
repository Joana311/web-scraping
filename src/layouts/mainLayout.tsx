import Box from "@mui/material/Box";
import { } from "@mui/base";
import dayjs from "dayjs";
import { type Session } from "next-auth";
import React from "react";
import Next from "next";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Image from "next/image";
import { useRouter } from "next/router";

type LayoutProps = {
    children: React.ReactNode;
    session: Session | undefined;
}

export const MainLayout = ({ session, children }: LayoutProps) => {
    const todaysDate = React.useMemo(
        () => dayjs().format("dddd, MMM D"),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dayjs().toDate()]
    );
    const router = useRouter();
    const onHomeClick = () => {
        router.push(`/${session?.user.name}`);// should be /[user]
    }


    return (
        <div
            className="flex 
            flex-col
            m-0
            h-[100vh] max-h-[100vh]
            border-[2rem] border-t-0 border-blue-700 border-solid">
            <header id="nav-header"
                className={
                    `m-0
                text-black
                max-h-max
                flex flex-row justify-between
                border-2 border-black border-solid`
                }>
                <div id="date-location" className="border-[2px] border-pink-600 border-solid">
                    <span id="current date" className="text-[.9rem]">
                        {todaysDate}
                    </span>
                    <h1 id="app-location"
                        className="mt-[-.5rem] text-[2rem]">
                        Application Location
                    </h1>
                </div>
                <div id="icon-container"
                    onClick={onHomeClick}
                    className="flex justify-center items-center mr-4 max-w-[64px] border border-green-700">
                    {!session?.user.image ? <AccountCircleIcon fontSize="large"></AccountCircleIcon>
                        : <Image src={session.user.image} width="100%" height="100%" className="rounded-full" />}
                </div>
            </header>
            {children}
        </div >)
}