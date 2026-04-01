import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/chrono-walk/',
  server: {
    port: 5173
  }
})
