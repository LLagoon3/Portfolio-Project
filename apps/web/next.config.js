module.exports = {
  reactStrictMode: true,
  async rewrites() {
    const apiUrl = process.env.API_INTERNAL_URL || 'http://localhost:7341';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
}
