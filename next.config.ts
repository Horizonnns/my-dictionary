const isProd = process.env.NODE_ENV === "production";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: !isProd,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

module.exports = withPWA(nextConfig);
