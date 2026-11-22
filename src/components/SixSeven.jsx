import './SixSeven.css'

// Easter egg: a 7 right after a 6. Use on the game and results pages.
export const isSixSeven = (prevScore, score) => prevScore === 6 && score === 7

// Pops up in the middle of the screen, flips between the two frames, then goes away.
// `delay` (seconds) lets the results page wait for its cubes to pop first.
export default function SixSeven({ delay = 0 }) {
  return (
    <div className="six-seven" style={{ animationDelay: `${delay}s` }} aria-hidden="true">
      <img src="/cubes/6-7.png" alt="" className="six-seven-frame six-seven-a" draggable="false" />
      <img src="/cubes/7-6.png" alt="" className="six-seven-frame six-seven-b" draggable="false" />
    </div>
  )
}
