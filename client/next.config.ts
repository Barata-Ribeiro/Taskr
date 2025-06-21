import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    reactStrictMode: true,
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
        reactCompiler: true,
        optimizePackageImports: ["tailwindcss", "@headlessui/react", "lucide-react"],
    },
}

export default nextConfig
