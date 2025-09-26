import withPWA from "next-pwa";

const nextConfig = {
  // Next.js configuration options here
};

export default withPWA({
  dest: "public",
  scope: "/",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
