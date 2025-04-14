import { API_BASE_URL } from './src/config';
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Configure client-side bundle
      config.output = {
        ...config.output,
        filename: 'widget.js',
        library: {
          name: 'LAWMAai',
          type: 'umd',
        },
        globalObject: 'this',
      };

      // Disable code splitting for single bundle
      config.optimization = {
        minimize: true,
        splitChunks: false,
      };

      // Include all dependencies in the bundle
      config.externals = {
        'react': 'React',
        'react-dom': 'ReactDOM',
      };
    }
    return config;
  },
  // Disable image optimization since we're building for CDN
  images: {
    unoptimized: true,
  },
  // Disable unnecessary features
  reactStrictMode: true,

  // Proxy API requests to avoid CORS
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:8002/:path*`,
      },
    ];
  },
}

module.exports = nextConfig;
