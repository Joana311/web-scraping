import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "../pages/_app"
import { useRouter } from "next/router";
import trpc from "@client/trpc";
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
  const { session } = props;
  return (
    <>
      <div
        className="mt-20 flex w-[80%] flex-col justify-evenly space-y-[3rem]"
      >
        {!!session &&
          <Link href={`/${session?.user?.name}`}>
            <button className="rounded-md bg-secondary ripple-bg-bg.secondary border border-white px-2 py-1 h-12 text-[1rem]"
            >
              Continue
            </button>
          </Link>
        }
        <button className="rounded-md bg-secondary ripple-bg-bg.secondary border border-white px-2 py-1 h-12 text-[1rem]"
          // eslint-disable-next-line
          onClick={() => { !!session ? signOut() : signIn("discord") }}
        >
          {!!session ? "Sign Out" : "Sign In w/ Discord"}
        </button>
      </div>
    </>
  );
};
