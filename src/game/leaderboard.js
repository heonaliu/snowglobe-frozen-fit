// Leaderboard stored in Firestore, in the "leaderboard" collection.
// Each document: { team, members: [...], score, createdAt (ms) }
import {
  addDoc, collection, getCountFromServer, getDocs, limit, orderBy, query, where,
} from 'firebase/firestore'
import { db } from './firebase'

export const MAX_MEMBERS = 7
export const MAX_NAME = 30
const MAX_SCORE = 100
const TOP = 50

const board = collection(db, 'leaderboard')

// best score first; on a tie the team that got there first ranks higher
const byRank = (a, b) => b.score - a.score || a.createdAt - b.createdAt

// trim and collapse spaces / line breaks
const clean = (value) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME) : ''

// the top scores of all time, best first
export async function fetchLeaderboard() {
  try {
    const snap = await getDocs(query(board, orderBy('score', 'desc'), limit(TOP)))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(byRank)
  } catch (err) {
    console.error('leaderboard load failed:', err)
    throw new Error('Could not load the leaderboard.')
  }
}

// saves a team's score; resolves with { entry, rank }
export async function submitScore({ team, members, score }) {
  team = clean(team)
  members = (members ?? []).map(clean).filter(Boolean)
  if (!team) throw new Error('Please enter a team name.')
  if (members.length > MAX_MEMBERS) throw new Error(`Up to ${MAX_MEMBERS} team members.`)
  if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE) {
    throw new Error('That score is not valid.')
  }

  try {
    const data = { team, members, score, createdAt: Date.now() }
    const ref = await addDoc(board, data)
    // this entry is the newest, so it ranks below every earlier tie:
    // rank = number of entries with a score >= ours (ours included)
    const count = await getCountFromServer(query(board, where('score', '>=', score)))
    return { entry: { id: ref.id, ...data }, rank: count.data().count }
  } catch (err) {
    console.error('leaderboard save failed:', err)
    throw new Error('Could not save your score.')
  }
}
