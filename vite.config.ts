import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), glsl()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr', '**/*.ktx2'],
  build: {
    // three alone is ~900 kB minified; the warning would fire on every build.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // three + R3F are the bulk of the bundle: keep them in their own chunk.
        manualChunks: (id) =>
          /node_modules\/(three|@react-three)\//.test(id) ? 'three' : undefined,
      },
    },
  },
})
