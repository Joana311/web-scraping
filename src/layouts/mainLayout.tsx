
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
            case "/[user]/workout/history":
                return "Workout History";
            default:
                return "Home";
        }
        return router.pathname
    }, [router.pathname]);
    const onHomeClick = () => {
        // router.push(`/${session?.user.name || ""}`);
        router.push('/');
    }


    return (
        <div
            id="app-container"
            className="m-0 flex
                flex-col 
                overflow-y-visible
                border-[3px]
                border-t-0 border-green-500 bg-primary px-[1rem]">
            <header id="nav-header"
                className="m-0
                    flex
                    h-[5rem]
                    flex-row
                    items-center justify-between
                    pt-2 font-light
                    text-white
                    ">
                <div id="date-and-app-location" className="">
                    <span id="current date" className="text-[.9rem]">
                        {todaysDate}
                    </span>
                    <h1 id="app-location"
                        className="text-[2rem]">
                        {appLocation}
                    </h1>
                </div>
                <div id="avatar-container"
                    onClick={onHomeClick}
                    className="my-1 mr-4 flex max-w-[64px] items-center justify-center">
                    {!session?.user.image ?
                        <AccountCircleIcon
                            fontSize="large" /> :
                        <Image
                            src={session.user.image}
                            width="90%" height="90%"
                            className="rounded-full" />
                    }
                </div>
            </header>
            <div
                id="page-container"
                className="flex grow flex-col border-4 border-orange-500">
                {children}
            </div>

        </div >)
}