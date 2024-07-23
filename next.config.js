// @ts-nocheck
/* eslint-disable @typescript-eslint/no-var-requires */
const { webpack } = require("webpack");
const { env } = require("./src/server/config/env");
const { debug } = require("console");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: env.NODE_ENV === "development"
});

// plugin for graphing out bundle and dependency sizes for the project
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

/**
 * @link https://nextjs.org/docs/api-reference/next.config.js/introduction
 */

/** @type {import('next').NextConfig} */ 
const config = {
  // Using SVGR for turning svg's into react components
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )
    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [ 
          ...(fileLoaderRule.resourceQuery?.not ?? []),
          /url/
        ] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )
    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i
    return config
  },
  // To safely allow optimizing images, define a list of supported URL patterns in next.config.js. 
  images: {
    domains: ["cdn.discordapp.com"]
  },
    /**
   * Dynamic configuration available for the browser and server.
   * Note: requires `ssr: true` or a `getInitialProps` in `_app.tsx`
   * @link https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
   */
  publicRuntimeConfig: { // Set for TRPC
    NODE_ENV: env.NODE_ENV
  },
  reactStrictMode: true // Set for TRPC
}

module.exports = withBundleAnalyzer(withPWA(config));
