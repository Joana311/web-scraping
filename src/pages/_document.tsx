import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import theme from "../../styles/theme";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content="#ffffff" />
          <link rel='manifest' href='/manifest.json' />
          <link rel='icon' type='image/png' href='/logo.png' />
          {
            process.env.NODE_ENV === "production" ?
              <>
                <link rel='apple-touch-icon' href='/logo.png' />
                <link rel='icon' type='image/png' href='/logo.png' />
              </> :
              <>
                <link rel='apple-touch-icon' href='/logo_dev.png' />
                <link rel='icon' type='image/png' href='/logo_dev.png' />
              </>

          }
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
        </Head>
        <body>
          {process.env.NODE_ENV === "development" && <>
            <script src="//cdn.jsdelivr.net/npm/eruda"></script>
            <script>eruda.init();</script>
          </>}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (document_context) => {
  // Resolution order
  //

  // On the server:
  // 1. app.getInitialProps <---- fetch exercise directory
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = document_context.renderPage;

  const initialProps = await Document.getInitialProps(document_context);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
    ],
  };
};
