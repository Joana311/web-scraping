import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../../styles/theme";
import createEmotionCache from "../emotion/createEmotionCache";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import { NextPage } from "next";
import { AppType } from "next/dist/shared/lib/utils";
import { ReactElement, ReactNode } from "react";
import superjson from "superjson";
// import { DefaultLayout } from '~/components/defaultLayout';
import { AppRouter } from "@server/routers/_app";
import trpc, { SSRContext } from "src/client/trpc";
import AppUserProvider from "@client/context/app_user.test";
import { ReactQueryDevtools } from "react-query/devtools";
import { getSession, SessionProvider } from "next-auth/react"
import { splitLink } from "@trpc/client/links/splitLink";
import { httpLink } from "@trpc/client/links/httpLink";
import { getCookieParser, } from "next/dist/server/api-utils";
import { defaultCookies, } from "next-auth/core/lib/cookie";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// interface MyAppProps extends AppProps {
//   emotionCache?: EmotionCache;
//   pageProps: any;
// }
const App: AppType = ({ pageProps, Component }): JSX.Element => {
  let emotionCache = clientSideEmotionCache
  const { data: session } = trpc.useQuery(["next-auth.get_session"], {
    context: {
      customHeaders: true,
      skipBatch:
        true
    }
  });
  // console.log("fetching session: ", session?.user);


  return (
    <SessionProvider session={session}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>My page</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <AppUserProvider>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {/* es-lint-disable-next-line */}
            <Component {...pageProps} />
          </AppUserProvider>
        </ThemeProvider>
        <ReactQueryDevtools />
      </CacheProvider>
    </SessionProvider>
  );
}
// App.getInitialProps = async ({ ctx }) => {
//   return {
//     emotionCache: clientSideEmotionCache,
//     pageProps: {
//       session: await getSession(ctx)
//     }

//   }
// }
function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // // reference for render.com
  // if (process.env.RENDER_INTERNAL_HOSTNAME) {
  //   return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),

        // adds opt-out support for batching
        splitLink({
          condition(operation) {
            return operation.context.skipBatch === true
          },
          false: httpBatchLink({

            url: `${getBaseUrl()}/api/trpc`,
          }),
          true: httpLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
        })
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */

      headers: () => {
        //on ssr forward cookies to the server to check for auth sessions
        const client_headers = ctx?.req?.headers

        console.log("auth: ", client_headers?.authorization)

        if (client_headers) {
          return {
            cookie: client_headers.cookie,
            "x-ssr": "1",
          }
        } else return {}
      },
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
  /**
   * Set headers or status code when doing SSR
   */
  responseMeta(opts) {
    const ctx = opts.ctx as SSRContext;
    if (ctx.status) {
      // If HTTP status set, propagate that
      return {
        status: ctx.status,
      };
    }

    const error = opts.clientErrors[0];
    if (error) {
      // Propagate http first error from API calls
      return {
        status: error.data?.httpStatus ?? 500,
      };
    }
    // For app caching with SSR see https://trpc.io/docs/caching
    // console.log("shouldnt be here",);
    return {};
  },
})(App);
