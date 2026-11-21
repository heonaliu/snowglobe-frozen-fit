import { useNavigate } from 'react-router-dom'
import Snowflake from '../components/Snowflake'
import { titleImg, cardImgs } from '../assets'
import './HomePage.css'

// made once, outside the component, so flakes don't jump on re-render
const flakes = Array.from({ length: 40 }, () => ({
  left: Math.random() * 100,        // % across
  size: 10 + Math.random() * 20,    // px
  duration: 6 + Math.random() * 9,  // seconds to fall
  delay: -Math.random() * 15,       // negative = already mid-fall on load
}));

// Edit the wording here. Art for each card: src/assets/card1.png, card2.png, card3.png
const steps = [
  {
    title: '1. get ready',
    tint: 'lavender',
    text: 'enable your camera and step back. get everyone in the frame!',
  },
  {
    title: '2. fit the shape!',
    tint: 'butter',
    text: 'a shape will appear on the screen. twist and squish yourselves to get everyone in, without spilling out OR leaving blank space!',
  },
  {
    title: '3. freeze!',
    tint: 'sky',
    text: 'when the timer gets to 0, the camera will take a snapshot. the better you all fill the frame, the higher the score you\'ll get!',
  },
]

export const HomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/game');
  };

  return (
    <div className="home">
      {/* background layer: stays put while the page scrolls */}
      <div className="home-bg" aria-hidden="true">
        {flakes.map((f, i) => (
          <span
            key={i}
            className="snowflake"
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
        <Snowflake />
      </div>

      <main className="home-content">
        {/* Title picture. Save it as src/assets/title.png (png/svg/webp/jpg). */}
        <h1 className="home-title">
          {titleImg ? (
            <img src={titleImg} alt="Frozen Fit" className="home-title-img" draggable="false" />
          ) : (
            <span className="home-title-placeholder">
              title picture here<br />(src/assets/title.png)
            </span>
          )}
        </h1>

        <h2 className="home-heading">how does this work?</h2>

        <section className="home-cards">
          {steps.map((step, i) => (
            <article key={step.title} className={`home-card home-card-${step.tint}`}>
              <h3 className="home-card-title">{step.title}</h3>
              <div className="home-card-art">
                {cardImgs[i] ? (
                  <img src={cardImgs[i]} alt="" className="home-card-img" draggable="false" />
                ) : (
                  <div className="home-card-placeholder">
                    your drawing<br />(src/assets/card{i + 1}.png)
                  </div>
                )}
              </div>
              <p className="home-card-text">{step.text}</p>
            </article>
          ))}
        </section>

        <button className="home-btn" onClick={handleStart}>Start</button>
      </main>
    </div>
  )
}