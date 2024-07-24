
import dayjs from "dayjs";
import { type Session } from "next-auth";
import React from "react";
import { UserCircle } from "src/components/SvgIcons";
import Image from "next/image";
import { useRouter } from "next/router";
import trpcNextHooks from "@client/trpc";

type LayoutProps = {
    children: React.ReactNode;
    session?: Session | undefined;
    appLocation: string;
}

export const MainLayout = ({ session, children, appLocation }: LayoutProps) => {
    // const { session } = useSession();
    // const session = 
    React.useEffect(() => {
        console.log("session from main: ", session);
    }, [session]);
    const todaysDate = React.useMemo(
        () => dayjs().format("dddd, MMM D"),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dayjs().toDate()]
    );
    const img_src = React.useMemo(() => session?.user?.image, [session?.user?.image]);
    const avatar = React.useMemo(() => {
        if (img_src) {
            return (
                <Image src={img_src as string}
                    width="100%" height="100%"
                    className="rounded-full" />
            )
        } else {
            return (
                <UserCircle className="max-w-fit max-h-fit" />
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [img_src])
    const router = useRouter();

    const onHomeClick = () => {
        let currentPath = router.pathname;
        if (currentPath === "/") {
            router.reload();
        } else {
            router.push(`/${session?.user.name || ""}`);
        }
        // router.push('/');
    }

    trpcNextHooks.exercise.public_directory.useQuery(undefined, {
        trpc: { context: { skipBatch: true } },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        retry: false,
    });
    return (
        <div id="app-container"
            onScroll={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            className="flex
                    h-screen
                    flex-col
                    overflow-hidden
                    /border-4
                    border-emerald-500
                    overscroll-none
                    md:pb-5
                   bg-primary px-[1rem]">
            <header id="nav-header"
                className="flex h-[5.5rem] flex-row items-center justify-between pt-2 font-light">
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
                    className={`my-1 mr-4 
                        rounded-full
                        p-0
                        flex 
                        h-[4rem] w-[4rem]
                        items-center justify-center 
                        text-[4rem]
                        active:translate-y-[-2px]  ${!!img_src && "border border-theme"}`}>
                    {avatar}

                </div>
            </header>
            {/* using overflow-y-hidden makes it work on desktop but,
                it messes up one of the scale animations by clipping on the x-axis */}
            <div
                id="page-container"
                className="relative
                        flex
                        flex-1
                        flex-col
                        /border
                        overflow-y-hidden
                        z-0
                        border-orange-500
                        pt-[2rem]">
                {children}
            </div>

        </div >
    )
}