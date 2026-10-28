import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        // Keep the heavy 3D stack in its own cacheable chunks, separate from
        // the app shell so the first paint only needs React + UI.
        manualChunks(id) {
          // Vite's dynamic-import helper is shared by the entry and the 3D
          // chunk; keep it tiny and separate so the entry never has to pull
          // three.js in statically.
          if (id.includes('vite/preload-helper')) return 'preload'
          if (!id.includes('node_modules/')) return
          if (id.includes('node_modules/three/')) return 'three'
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react'
          // Everything else from node_modules is only used by the 3D scene
          // (three-stdlib, react-reconciler, zustand, @react-three/*, ...)
          return 'r3f'
        },
      },
    },
  },
})
