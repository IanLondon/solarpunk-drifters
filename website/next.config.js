/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    loader: 'custom',
    loaderFile: './src/imageLoader.ts'
  }
}

module.exports = nextConfig
