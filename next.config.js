// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async redirects() {
        return [
            { source: '/accueil', destination: '/home', permanent: true },
            { source: '/actualite', destination: '/news', permanent: true },
            { source: '/Opcvm/:path*', destination: '/funds/:path*', permanent: true },
            { source: '/Fundmanager/:path*', destination: '/fund-managers/:path*', permanent: true },
            { source: '/Outils/:path*', destination: '/tools/:path*', permanent: true },
            { source: '/pays/:path*', destination: '/countries/:path*', permanent: true },
            { source: '/payspanel/:path*', destination: '/country-panel/:path*', permanent: true },
            { source: '/panel/portefeuille/:path*', destination: '/panel/portfolio/:path*', permanent: true },
            { source: '/panel/societegestionpanel/:path*', destination: '/panel/management/:path*', permanent: true },
        ];
    },
};
module.exports = nextConfig;