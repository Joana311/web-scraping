import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { ButtonBase, Grid, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
export function LandingPage() {
  const [userName, setUserName] = useState(undefined);
  const router = useRouter();
  useEffect(() => {
  }, [userName]);
  const { data: session, status } = useSession();
  // console.log("session from client : ", session?.user)
  // if (status !== "loading" && session?.user && typeof window !== "undefined") {
  //   router.push(`/${session?.user?.name}`);
  // }

  return (
    <div className='h-fill self my-auto flex flex-col items-center'>
      <h1 className="text-4xl">Hello {session?.user.name || "Stranger"}!</h1>
      <LandingPageMenu session={session} />
    </div>
  );
}

const LandingPageMenu = (props: { session: any }) => {
  const { session } = props;
  return (
    <>
      <div
        className="mt-20 flex w-[80%] flex-col justify-evenly space-y-[3rem]"
      >
        {!!session &&
          <Link href={`/${session?.user?.name}`}>
            <ButtonBase
              sx={{
                borderRadius: 2,
                backgroundColor: "secondary.main",
                display: "flex",
                border: "1px solid white",
                px: ".5rem",
                py: ".2rem",
                height: "45px",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1rem"
              }}
            >
              Continue
            </ButtonBase>
          </Link>
        }
        <ButtonBase
          // eslint-disable-next-line
          onClick={() => { !!session ? signOut() : signIn("discord") }}
          sx={{
            borderRadius: 2,
            backgroundColor: "secondary.main",
            display: "flex",
            border: "1px solid white",
            px: ".5rem",
            py: ".2rem",
            height: "45px",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1rem"
          }}
        >
          {!!session ? "Sign Out" : "Sign In w/ Discord"}
        </ButtonBase>
      </div>
    </>
  );
};
