
import dayjs from "dayjs";
import { type Session } from "next-auth";
import React from "react";
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
    const appLocation = React.useMemo(() => {
        switch (router.pathname) {
            case "/":
                return "Welcome!";
            case "/[user]":
                return "Daily Summary";
            case "/[user]/workout/[workout_id]":
                return "Workout Report";
        }
        return router.pathname
    }, [router.pathname]);
    const onHomeClick = () => {
        router.push(`/${session?.user.name || ""}`);
    }


    return (
        <div
            id="app-container"
            className="m-0
            flex
            h-[100vh]
            max-h-[100vh]
            flex-col
            border-2 border-t-0
            border-solid border-blue-700 bg-black px-[1rem]">
            <header id="nav-header"
                className={
                    `m-0
                flex
                max-h-max
                flex-row
                justify-between bg-black
                pt-2 text-white`
                }>
                <div id="date-location" className="">
                    <span id="current date" className="text-[.9rem]">
                        {todaysDate}
                    </span>
                    <h1 id="app-location"
                        className="mt-[-.5rem] text-[2rem]">
                        {appLocation}
                    </h1>
                </div>
                <div id="icon-container"
                    onClick={onHomeClick}
                    className="my-1 mr-4 flex max-w-[64px] items-center justify-center">
                    {!session?.user.image ? <AccountCircleIcon fontSize="large"></AccountCircleIcon>
                        : <Image src={session.user.image} width="90%" height="90%" className="rounded-full" />}
                </div>
            </header>
            {children}
        </div >)
}