// Leaderboard API (no extra packages needed).
//
//   GET  /api/leaderboard  -> { entries: [...top scores, best first] }
//   POST /api/leaderboard  -> body { team, members: [..up to 7], score }
//                          -> 201 { entry, rank }
//
// Every score is appended to ONE json file on disk (data/leaderboard.json by
// default), so the leaderboard survives restarts. It's used by both the Vite dev
// server (see vite.config.js) and the production server (server/index.js).
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const FILE = path.resolve(process.env.LEADERBOARD_FILE || 'data/leaderboard.json')
const MAX_NAME = 30      // characters in a team / member name
const MAX_MEMBERS = 7
const MAX_SCORE = 100    // sanity cap (3 rounds x 10 = 30 today)
const MAX_BODY = 10_000  // bytes
const TOP = 50           // how many entries GET returns

// ---------- storage ----------
async function readAll() {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') return []   // first run: no file yet
    throw err
  }
}

async function writeAll(list) {
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  const tmp = `${FILE}.tmp`
  await fs.writeFile(tmp, JSON.stringify(list, null, 2))
  await fs.rename(tmp, FILE)               // swap in one step, never a half-written file
}

// best score first; on a tie the team that got there first ranks higher
const byRank = (a, b) => b.score - a.score || a.createdAt - b.createdAt

// writes happen one at a time so two teams submitting together can't overwrite each other
let queue = Promise.resolve()
function addEntry(entry) {
  const job = queue.then(async () => {
    const list = await readAll()
    list.push(entry)
    await writeAll(list)
    return [...list].sort(byRank).findIndex((e) => e.id === entry.id) + 1
  })
  queue = job.catch(() => {})
  return job
}

// ---------- validation ----------
// trim and collapse spaces / line breaks
const clean = (value) =>
  typeof value === 'string'
    ? value.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME)
    : ''

function parseSubmission(body) {
  const team = clean(body.team)
  if (!team) return { error: 'Please enter a team name.' }

  if (body.members !== undefined && !Array.isArray(body.members)) {
    return { error: 'Members must be a list.' }
  }
  const members = (body.members ?? []).map(clean).filter(Boolean)
  if (members.length > MAX_MEMBERS) return { error: `Up to ${MAX_MEMBERS} team members.` }

  const { score } = body
  if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE) {
    return { error: 'That score is not valid.' }
  }
  return { team, members, score }
}

// ---------- http ----------
function send(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(data))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('Request too large'), { status: 413 }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

export async function leaderboardHandler(req, res) {
  try {
    if (req.method === 'GET') {
      const list = (await readAll()).sort(byRank).slice(0, TOP)
      return send(res, 200, { entries: list })
    }

    if (req.method === 'POST') {
      let body
      try {
        body = JSON.parse(await readBody(req))
      } catch (err) {
        if (err.status === 413) return send(res, 413, { error: 'Request too large.' })
        return send(res, 400, { error: 'Bad request.' })
      }
      const parsed = parseSubmission(body ?? {})
      if (parsed.error) return send(res, 400, { error: parsed.error })

      const entry = { id: randomUUID(), ...parsed, createdAt: Date.now() }
      const rank = await addEntry(entry)
      return send(res, 201, { entry, rank })
    }

    res.setHeader('Allow', 'GET, POST')
    return send(res, 405, { error: 'Method not allowed.' })
  } catch (err) {
    console.error('leaderboard error:', err)
    return send(res, 500, { error: 'Something went wrong on the server.' })
  }
}