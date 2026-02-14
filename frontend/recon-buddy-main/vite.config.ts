import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    // Proxy /api requests to Flask backend
    proxy: {
      server: {
    
        "/ip": { target: "http://localhost:5000", changeOrigin: true, secure: false },
        "/dns": { target: "http://localhost:5000", changeOrigin: true, secure: false },
        "/headers": { target: "http://localhost:5000", changeOrigin: true, secure: false },
        "/recon": { target: "http://localhost:5000", changeOrigin: true, secure: false },
    
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },  server: {
      proxy: {
          "/ip": { target: "http://localhost:5000", changeOrigin: true, secure: false },
          "/dns": { target: "http://localhost:5000", changeOrigin: true, secure: false },
          "/headers": { target: "http://localhost:5000", changeOrigin: true, secure: false },
          "/recon": { target: "http://localhost:5000", changeOrigin: true, secure: false },
      },
  },  server: {
      proxy: {
          "/ip": { target: "http://localhost:5000", changeOrigin: true, secure: false },
          "/dns": { target: "http://localhost:5000", changeOrigin: true, secure: false },
          "/headers": { target: "http://localhost:5000", changeOrigin: true, secure: false },
          "/recon": { target: "http://localhost:5000", changeOrigin: true, secure: false },
      },
  },
}));