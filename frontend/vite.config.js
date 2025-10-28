import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
       // target: "https://docuvault-agmi.onrender.com",
         target: "https://docuvault-agmi.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
