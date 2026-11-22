// Production server:  npm run build  then  npm start
// Serves the built site (dist/) and the leaderboard API from one process.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { leaderboardHandler } from './leaderboardApi.js'

const DIST = path.resolve('dist')
const PORT = process.env.PORT || 3000

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ttf': 'font/ttf', '.woff2': 'font/woff2',
  '.wasm': 'application/wasm', '.tflite': 'application/octet-stream', '.ico': 'image/x-icon',
}

function serveFile(res, file) {
  res.setHeader('Content-Type', TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream')
  fs.createReadStream(file).pipe(res)
}

http
  .createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost')
    if (pathname === '/api/leaderboard') return leaderboardHandler(req, res)

    // look for the file inside dist/ (and never outside it)
    let file = path.join(DIST, decodeURIComponent(pathname))
    if (!file.startsWith(DIST + path.sep) && file !== DIST) file = DIST
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return serveFile(res, file)

    // anything else is a page of the app (/game, /results, /leaderboard) -> index.html
    serveFile(res, path.join(DIST, 'index.html'))
  })
  .listen(PORT, () => console.log(`Frozen Fit running at http://localhost:${PORT}`))