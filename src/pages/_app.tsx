import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../../styles/theme';
import createEmotionCache from '../../lib/createEmotionCache';
import { ApolloProvider, ApolloClient } from '@apollo/client';
//import {useApollo} from '../../lib/apollo';
import myApolloClient from '../../lib/apollo';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  //apolloClient?: any;
}

const App = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  //const apolloClient = useApollo(pageProps.intialApolloState);
  const apolloClient = myApolloClient
  return (
    <CacheProvider value={emotionCache}>
    <ApolloProvider client={myApolloClient}>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
    </CacheProvider>
  );
};

export default App;