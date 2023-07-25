/** @type {import('next').NextConfig} */

const path = require("path");
const sass = require("sass");
const nextConfig = {
    sassOptions: {
        implementation: sass,
        includePaths: [path.resolve(__dirname, "node_modules")],
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost:8080",
                port: "",
                pathname: "/assets/**",
            },
        ],
    },
};

module.exports = nextConfig;
