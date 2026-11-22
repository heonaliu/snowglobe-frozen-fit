// Talks to the leaderboard API (server/leaderboardApi.js).

export const MAX_MEMBERS = 7
export const MAX_NAME = 30

// the top scores of all time, best first
export async function fetchLeaderboard() {
  const res = await fetch('/api/leaderboard')
  if (!res.ok) throw new Error('Could not load the leaderboard.')
  return (await res.json()).entries
}

// saves a team's score; resolves with { entry, rank }
export async function submitScore({ team, members, score }) {
  const res = await fetch('/api/leaderboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team, members, score }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Could not save your score.')
  return data
}