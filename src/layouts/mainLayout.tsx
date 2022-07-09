
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
        <div id="app-container"
            className="flex
                grow
                flex-col
                overflow-y-clip
                bg-primary px-[1rem]"
            style={{
                height: "100vh",
                // maxHeight: "fill-available",
            }}>
            <header id="nav-header"
                className="
                    flex
                    max-h-[5.5rem]
                    min-h-[5.5rem]
                    flex-row
                    items-center
                    justify-between
                    pt-2 font-light
                    text-white
                    ">
                <div id="date-and-app-location" className="h-min">
                    <span id="current date" className="text-[.9rem]">
                        {todaysDate}
                    </span>
                    <h1 id="app-location"
                        className="text-[2rem] leading-tight">
                        {appLocation}
                    </h1>
                </div>
                <div id="avatar-container"
                    onClick={onHomeClick}
                    className="my-1 mr-4 
                    flex 
                    h-[4rem] w-[4rem] 
                    items-center justify-center 
                    text-[4rem]">
                    {!session?.user.image ?
                        <AccountCircleIcon fontSize='inherit' /> :
                        <Image
                            src={session.user.image}
                            width="90%" height="90%"
                            className="rounded-full" />
                    }
                </div>
            </header>
            <div
                id="page-container"
                className="flex grow flex-col  
                border-4 border-orange-500 
                pt-[2rem]">
                {children}
            </div>

        </div >)
}