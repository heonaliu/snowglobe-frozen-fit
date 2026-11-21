import { useNavigate } from 'react-router-dom'


export const HomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/game');
  };

  return (
    <div>
      <h1>Frozen Fit</h1>
      <p>Fit your self within the area as best you can and freeze so you can thaw the frozen penguin!</p>
      <button onClick={handleStart}>Start</button>
    </div>
  )
}