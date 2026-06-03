/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Required for Clerk's server-side SDK
  serverExternalPackages: ["@neondatabase/serverless"],
};

export default nextConfig;
