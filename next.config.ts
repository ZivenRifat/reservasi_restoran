import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*', // Semua permintaan API akan diarahkan ke backend Laravel
  //       destination: 'http://127.0.0.1:8000/api/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;
