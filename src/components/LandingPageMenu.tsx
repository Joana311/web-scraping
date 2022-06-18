import { Button, Grid, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import React from "react";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import {
  useAppUser,
  useGetByUserName,
  useLogin,
} from "@client/context/app_user.test";
import { useRouter } from "next/router";
import trpc from "@client/trpc";

import { signIn, signOut } from "next-auth/react";

const LandingPageMenu: React.FC = () => {
  const { set_id, set_username, get_username, get_id } = useAppUser();
  // console.log("current name: ", get_username);
  const router = useRouter();

  // const { data: user_data, isError } = useGetByUserName(
  //   get_username!,
  //   (user_data) => {
  //     set_id(user_data!.id);
  //     set_username(user_data!.name);
  //     router.push(`/${user_data!.name}`);
  //   },
  //   !!get_username
  // );
  // const { data: session, status } = useSession();

  // const { data: user_data, isError } = trpc.useQuery(
  //   ["user.get_by_name", { name: get_username! }],
  //   {
  //     onSuccess: (user_data) => {
  //       set_id(user_data!.id);
  //       set_username(user_data!.name);
  //       router.push(`/${user_data!.name}`);
  //     },
  //     enabled: !!get_username,
  //     refetchOnMount: false,
  //     retry: false,
  //   }
  // );
  // React.useEffect(() => {
  //   console.log(isError);
  //   //listen for click anywhere on page
  //   if (isError) {
  //     document.addEventListener("click", (e) => {
  //       set_username(undefined);
  //     });
  //   }
  //   //clean up event listener
  //   return () => {
  //     document.removeEventListener("click", (e) => {
  //       set_username(undefined);
  //     });
  //   };
  // }, [isError === true]);
  // if (isError) {
  //   // set_username(undefined);
  //   return <Typography color="#000">"There was an error"</Typography>;
  // }
  // const onClickContinue = () => {
  //   router.push(`/api/auth/signin`);
  // }
  // console.log("session info : ", session?.user)
  return (
    <>
      {<Stack
        spacing={3}
        // component={Card}
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          width: "80%",
          //   border: "2px solid red",
          minHeight: "300px",
        }}
      >
        <Button
          variant="contained"
          disabled={true}
          sx={{
            height: "45px",
            fontSize: "1rem",
          }}
        >
          Log in
        </Button>
        <Button
          variant="contained"
          // eslint-disable-next-line
          onClick={() => signIn("discord")}
          sx={{
            height: "45px",
            fontSize: "1rem",
          }}
        >
          Continue w/ Discord
        </Button>
      </Stack>}
    </>
  );
};


export default LandingPageMenu;
