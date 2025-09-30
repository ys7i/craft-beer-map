import withPWA from "next-pwa";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        pathname: "/maps/api/place/photo/**",
      },
    ],
  },
};

export default withPWA({
  dest: "public",
  scope: "/",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
