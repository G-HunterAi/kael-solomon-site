import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return process.env.NEXT_PUBLIC_SITE_URL !== "https://kaelsolomon.com"
      ? [
          {
            source: "/(.*)",
            headers: [{ key: "X-Robots-Tag", value: "noindex" }],
          },
        ]
      : [];
  },
};

export default nextConfig;
