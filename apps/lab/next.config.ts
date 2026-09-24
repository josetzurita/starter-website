import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cds/ui", "@cds/motion", "@cds/core", "@cds/project"],
};

export default nextConfig;
