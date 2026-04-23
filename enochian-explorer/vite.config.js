import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Liber84/',  // <-- AGGIUNGI QUESTA RIGA (attento alla virgola finale!)
  plugins: [react()],
})
