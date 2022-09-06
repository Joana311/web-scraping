import React from "react";
import Head from "next/head";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { MainLayout } from "../layouts/mainLayout";
import { appRouter, AppRouter } from "@server/routers/_app";
import trpc, { SSRContext } from "src/client/trpc";
import { ReactQueryDevtools } from "react-query/devtools";
import { SessionProvider } from "next-auth/react";
import { splitLink } from "@trpc/client/links/splitLink";
import { httpLink } from "@trpc/client/links/httpLink";
import "../../styles/globals.css";
import { useRouter } from "next/router";
import { IncomingHttpHeaders } from "http2";
import { Session } from "next-auth/core/types";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { createSSGHelpers } from "@trpc/react/ssg";

// interface MyAppProps extends AppProps {
//   emotionCache?: EmotionCache;
//   pageProps: any;
// }
type AuthCtx = {
  session?: Session | null;
}
const AuthContext = React.createContext<AuthCtx>({
  session: undefined,
});
export function useSession() {
  return React.useContext(AuthContext);
}
const App: AppType = ({ pageProps, Component }): JSX.Element => {
  const {
    data: auth_data,
    error,
    isError,
    isLoading
  } = trpc.useQuery(["next-auth.get_session"], {
    context: { skipBatch: true },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: typeof window !== "undefined",
    // 5 minutes in milliseconds
    staleTime: 5 * 60 * 1000,
    retryOnMount: false,
  });
  trpc.useQuery(["exercise.public.directory"], {
    context: { skipBatch: true },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });
  const utils = trpc.useContext();
  const isInit = React.useRef(false)
  React.useEffect(() => {
    if (utils && typeof window !== "undefined" && !isInit.current) {
      console.log("setting react-query defaults");
      utils.queryClient.setDefaultOptions({
        queries: {
          retry(failureCount, error: any) {
            if (
              (error.data?.code === "UNAUTHORIZED" &&
                error.message.includes("NO_SESSION")) &&
              failureCount == 1
            ) {
              console.log("Session not found invalidating client session")
              console.log("failureCount: ", 2);
              // i think whats happening here is that 2 queries are fired. then on failure query is invalidated.
              // which causes itself to be refetched. which causes the error to be thrown again.
              // i dont think we actually need to invalidate. the purpose of it is
              // for when the session expires and any other query that is not "next-auth.get_session"
              // picks up on it and propogates the error down.
              console.log("error with auth session. should re-route to home.")
              router.push("/");
              // }
              utils.queryClient.setQueryData(["next-auth.get_session"], null);
              return false;
            }
            return true;
          },
        }
      });
      isInit.current = true;
    }
  }, []);
  const router = useRouter();
  const _session = React.useRef(auth_data);
  const session = React.useMemo(() => {
    // console.log("new session or error found")
    // console.log("session: ", auth_data);
    // console.log("error: ", error?.message?.includes("NO_SESSION"));
    if (!_session.current && auth_data) {
      _session.current = auth_data;
      return _session.current;
    }
    if (auth_data == _session.current) return _session.current;
    return undefined;
  }, [auth_data, error]);
  return (

    <AuthContext.Provider value={{ session: session }} >
      <Head >
        <title>ExBuddy</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head >
      <MainLayout session={session}>
        <Component {...pageProps} />
      </MainLayout>
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </AuthContext.Provider>

  )
};
const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
  // create a dummy request and response to pass to the server;

  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: { session: undefined, },
    transformer: superjson,
  })

  await ssg.fetchQuery("exercise.public.directory");
  return {
    props: {
      trpcState: ssg.dehydrate(),
      // exerciseDirectory: ssg.queryClient.getQueryData("exercise.public.directory"),
    },
    // 1 hour in seconds
    revalidate: 60 * 60,
  }

}
// App.getInitialProps = async ({ ctx }) => {
//   const { data: exercise_directory } = trpc.useQuery(["exercise.public.directory"], {
//     context: { skipBatch: false },
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: false,
//     retry: false,
//   });
//   return {
//     pageProps: {
//       exercise_directory,
//     }

//   }
// }
function getBaseUrl() {
  if (typeof window !== "undefined") {
    // return `http://localhost:${process.env.PORT ?? 3000}`;
    return "";
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
export default withTRPC<AppRouter>({
  config({ ctx }) {
    const host_url = ctx?.req?.headers?.host || '';
    if (typeof window !== "undefined") {
      return {
        transformer: superjson,
        url: "/api/trpc",
        links: [
          loggerLink({
            enabled: (opts) => true
          }),
          // adds opt-out support for batching
          splitLink({
            condition(operation) {
              return operation.context.skipBatch === true;
            },
            false: httpBatchLink({
              url: `${getBaseUrl()}/api/trpc`
            }),
            true: httpLink({
              url: `${getBaseUrl()}/api/trpc`
            })
          })
        ]
      }
    }
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      url: getBaseUrl() + "/api/trpc",
      // url: host_url + "/api/trpc",
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" || true
          // || (opts.direction === "down" && opts.result! instanceof Error)
        }),

        // adds opt-out support for batching
        splitLink({
          condition(operation) {
            return operation.context.skipBatch === true;
          },
          false: httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`
          }),
          true: httpLink({
            url: `${getBaseUrl()}/api/trpc`
          })
        })
      ],
      transformer: superjson,
      queryClientConfig: {},
      headers: () => {
        //on ssr forward cookies to the server to check for auth sessions
        const client_headers: IncomingHttpHeaders | undefined = ctx?.req?.headers;
        console.log("forwarding headers", client_headers);
        return {
          ...client_headers,
          "x-ssr": "1"
        };

      }
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
  // responseMeta(opts) {

  //   const error = opts.clientErrors[0];
  //   if (error) {
  //     // const host_url = ctx.req?.headers?.host ?? getBaseUrl();
  //     // if (error.message.includes("NO_SESSION") && opts.ctx.asPath !== "/") {
  //     //   console.log("No sessions found should reroute to: ", host_url);
  //     //   return {
  //     //     status: 303, //"SEE_OTHER"
  //     //     headers: {
  //     //       location: '/api/auth/signin'
  //     //     }
  //     //   };
  //     // }
  //     // Propagate http first error from API calls
  //     return {
  //       status: error.data?.httpStatus ?? 500
  //     };
  //   }
  //   // For app caching with SSR see https://trpc.io/docs/caching
  //   // if (opts.)
  //   return {};
  // }
})(App);
