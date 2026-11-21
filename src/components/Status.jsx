import { timerImg } from '../assets'

// Countdown timer, top-right of the game screen.
// (Score can be added here later.)
export default function Status({ seconds, active }) {
  const urgent = active && seconds <= 3
  return (
    <div className={`timer ${active ? 'timer-active' : ''} ${urgent ? 'timer-urgent' : ''}`}>
      {timerImg ? (
        <img src={timerImg} alt="" className="timer-img" draggable="false" />
      ) : (
        <div className="timer-placeholder" />
      )}
      <span className="timer-number">{seconds}</span>
    </div>
  )
}
