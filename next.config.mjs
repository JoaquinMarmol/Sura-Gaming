/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "dist",
  assetPrefix: "./",
  images: {
    unoptimized: true, // Desactivar la optimización de imágenes
    path: "",
  },
};

export default nextConfig;
