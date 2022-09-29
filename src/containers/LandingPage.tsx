import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "../pages/_app"
import { useRouter } from "next/router";
import trpc from "@client/trpc";
import { router } from "@trpc/server";
import Button from "src/components/ui/Button";
export function LandingPage() {
  const router = useRouter();
  const { session } = useSession();

  return (
    <div className='my-auto flex flex-col items-center'>
      <h1 className="text-4xl">Hello {session?.user.name || "Stranger"}!</h1>
      <LandingPageMenu session={session} />
    </div>
  );
}

const LandingPageMenu = (props: { session: any }) => {
  const router = useRouter();
  const { session } = props;
  return (
    <>
      <div
        className="mt-20 flex w-[80%] flex-col justify-evenly space-y-[3rem]"
      >
        {!!session &&
          <Link href={`/${session?.user?.name}`}>
            <button className="rounded-md bg-theme font-medium  px-2 py-1 h-12 text-[1rem]"
            >
              Continue
            </button>
          </Link>
        }
        <button id='discord-sign-in' type="button" className="text-white  bg-[#5865F2] hover:bg-[#5865F2]/90   
        h-12 
        text-[1rem]
        focus:ring-4 focus:outline-none focus:ring-[#5865F2]/50 
        font-medium 
        rounded-lg 
        px-2 py-1
        justify-center
        text-center 
        inline-flex items-center 
        dark:focus:ring-[#5865F2]/55
        disabled:bg-gray-400 
        "

          onClick={(e) => {
            if (!!session) {
              e.currentTarget.disabled = true;
              signOut().then(() => {
                e && (e.currentTarget.disabled = false);
              });
            }
            else {
              // wait 100ms to prevent double click
              e && e.currentTarget.classList.add("opacity-50");
              setTimeout(() => {
                e.currentTarget && e.currentTarget.classList.add("opacity-100");
                signIn("discord")
              }, 10);
            }
          }}>
          <img
            className="h-6 w-6 mr-2 pointer-events-none"
            src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/62595384f934b806f37f4956_145dc557845548a36a82337912ca3ac5.svg"
            placeholder="provider" />
          {!!session ? "Sign Out" : "Sign in with Discord"}
        </button>
        {/* <Button className="bg-theme">
          Hello World
        </Button> */}
      </div>
    </>
  );
};
