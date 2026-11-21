import { useNavigate } from 'react-router-dom'

// made once, outside the component, so flakes don't jump on re-render
const flakes = Array.from({ length: 40 }, () => ({
  left: Math.random() * 100,        // % across
  size: 10 + Math.random() * 20,    // px
  duration: 6 + Math.random() * 9,  // seconds to fall
  delay: -Math.random() * 15,       // negative = already mid-fall on load
}));

export const HomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/game');
  };

  return (
    <div className="home">
      <h1>Frozen Fit</h1>
      <p>Fit your self within the area as best you can and freeze so you can thaw the frozen penguin!</p>
      <button onClick={handleStart}>Start</button>

      {flakes.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          aria-hidden="true"
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        >
          ❄
        </span>
      ))}
    </div>
  )
}