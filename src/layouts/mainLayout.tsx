
import dayjs from "dayjs";
import { type Session } from "next-auth";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "src/pages/_app";

type LayoutProps = {
    children: React.ReactNode;
    session?: Session | undefined;
}

export const MainLayout = ({ children }: LayoutProps) => {
    const { session } = useSession();
    const todaysDate = React.useMemo(
        () => dayjs().format("dddd, MMM D"),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dayjs().toDate()]
    );
    const img_src = React.useMemo(() => session?.user?.image, [session?.user?.image]);
    const avatar = React.useCallback(() => {
        if (img_src) {
            return (
                <Image src={img_src as string}
                    width="90%" height="90%"
                    className="rounded-full" />
            )
        } else {
            return (
                <AccountCircleIcon fontSize='inherit' />
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [img_src])
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
                h-screen
                max-h-screen
                grow
                flex-col
                overflow-y-hidden
                //border-4
                border-emerald-500
                bg-primary px-[1rem]"
            style={{
                // height: "100dvh",
                // // maxHeight: "100vh",
                // maxHeight: "100dvh"
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

                    {avatar()}

                </div>
            </header>
            <div
                id="page-container"
                className="relative flex
                fill-height
                grow
                flex-col
                //border
                border-orange-500
                pt-[2rem]">
                {children}
            </div>

        </div >)
}