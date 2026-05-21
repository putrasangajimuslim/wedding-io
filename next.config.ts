/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth',
        permanent: true, // Gunakan true untuk SEO, atau false jika ini hanya sementara
      },
    ]
  },
}

module.exports = nextConfig