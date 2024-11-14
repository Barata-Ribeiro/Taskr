/** @type {import("next").NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    trailingSlash: false,
    skipTrailingSlashRedirect: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
                port: "",
            },
        ],
    },
    experimental: {
        optimizePackageImports: [
            "tailwindcss",
            "@headlessui/react",
            "react-icons/fa",
            "react-icons/fa6",
            "react-icons/hi2",
            "react-icons/md",
        ],
    },
}

export default nextConfig
