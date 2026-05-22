/** @type {import('next').NextConfig} */
const nextConfig = {
  // googleapis is a heavy Node-only package — keep it out of the bundle.
  experimental: {
    serverComponentsExternalPackages: ["googleapis"],
  },
};

export default nextConfig;
