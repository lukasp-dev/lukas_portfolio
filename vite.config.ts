import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'three/examples/jsm/controls/OrbitControls': 
        'three/examples/jsm/controls/OrbitControls.js'
    }
  }
})
