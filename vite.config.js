import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { leaderboardHandler } from './server/leaderboardApi.js'

// serves /api/leaderboard from the dev server, so `npm run dev` is all you need
const leaderboardApi = () => ({
  name: 'leaderboard-api',
  // (braces on purpose: returning a value from these hooks means something special to Vite)
  configureServer(server) {
    server.middlewares.use('/api/leaderboard', leaderboardHandler)
  },
  configurePreviewServer(server) {
    server.middlewares.use('/api/leaderboard', leaderboardHandler)
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), leaderboardApi()],
  server: { watch: { ignored: ['**/data/**'] } },   // saving a score shouldn't reload the page
})