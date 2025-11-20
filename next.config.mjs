/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: '**',
        },
      ],
    },
     serverActions: {
      bodySizeLimit: '50mb',
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
};

export default nextConfig;