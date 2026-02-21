/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'portfolio-sigma-silk-qnev14chxk.vercel.app' }],
        destination: 'https://ashishsinghal.dev/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig