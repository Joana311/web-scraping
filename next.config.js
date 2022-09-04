// @ts-nocheck
/* eslint-disable @typescript-eslint/no-var-requires */
const { env } = require("./src/server/config/env");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: env.NODE_ENV === "development"
});
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function getConfig(config) {
  return config;
}

/**
 * @link https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
module.exports = withPWA(
  withBundleAnalyzer({
    /**
     * Dynamic configuration available for the browser and server.
     * Note: requires `ssr: true` or a `getInitialProps` in `_app.tsx`
     * @link https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
     */
    images: {
      domains: ["cdn.discordapp.com"]
    },
    publicRuntimeConfig: {
      NODE_ENV: env.NODE_ENV
    },
    use: ["@svgr/webpack"],
    reactStrictMode: true
  })
);
