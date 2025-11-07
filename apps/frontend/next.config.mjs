import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const base = {
  reactStrictMode: true,
  swcMinify: true,
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
  register: true,
  skipWaiting: true,
})(base);
