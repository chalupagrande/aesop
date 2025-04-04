import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import restart from 'vite-plugin-restart'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  root: 'src/', // Sources files (typically where index.html is)
  publicDir: '../public/', // Path from "root" to static assets (files that are served as they are)
  server:
  {
    host: true, // Open to local network and display URL,
    allowedHosts: ["stirred-whippet-lively.ngrok-free.app"], // Allow ngrok URL
    // open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
  },
  build:
  {
    outDir: '../dist', // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true // Add sourcemap
  },
  plugins:
    [
      react(), // React plugin
      tailwindcss(), // Tailwind CSS plugin,
      restart({ restart: ['../public/**',] }) // Restart server on static file change
    ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
