/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['scontent.fbkk12-1.fna.fbcdn.net'], // เพิ่มโดเมนของรูปภาพที่คุณใช้ที่นี่
  },
}

module.exports = nextConfig
