import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  base: "",
  plugins: [
    vue(),
    viteCompression(),
  ],
  build: {
    chunkSizeWarningLimit: 600,
  },
});
