import { useCallback, useEffect, useRef, useState } from "react";
import { burstOnAllButtons } from "./components/burst";
import { Routes, Route, useNavigate } from "react-router-dom";
import Flurry, { FlurryContext } from "./components/Flurry"
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { GamePage } from "./pages/GamePage";
import { ResultsPage } from "./pages/ResultsPage";

// snowflakes made once, outside the component, so flakes don't jump on re-render
const flakes = Array.from({ length: 100 }, () => ({
  left: Math.random() * 100,        // % across
  size: 10 + Math.random() * 20,    // px
  duration: 15 + Math.random() * 12, // seconds to fall
  delay: -Math.random() * 27,        // negative = already mid-fall on load
}));

function App() {
  const navigate = useNavigate();
  const [flurry, setFlurry] = useState(false);
  const busy = useRef(false);

  useEffect(burstOnAllButtons, []);   // snowflakes jump from every button/link click

  // useCallback keeps it the same function between renders, so the game page's
  // effect (which lists it as a dependency) doesn't re-run when the flurry starts
  const flurryTo = useCallback((path, options) => {
    if (busy.current) return;                           // ignore double-clicks
    busy.current = true;
    const wait = 350;                                   // let the click burst pop first, then the flurry starts
    setTimeout(() => setFlurry(true), wait);
    setTimeout(() => navigate(path, options), wait + 700);  // swap while the veil is fully up (40–60% of 1.6s)
    setTimeout(() => { setFlurry(false); busy.current = false; }, wait + 1600); // remove when the animation ends
  }, [navigate]);

  return (
    <>
      {/* snowflake code lives outside <Routes>, so it shows on every page and doesn't restart on navigation */}
      <div className="snow" aria-hidden="true">
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
      </div>
      {/* "goo" filter: blur, then snap the edge back to sharp, so blocky masks become smooth blobs.
          Used by .live-fit and .fit-map on the game and results pages. */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="goo" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
        </filter>
      </svg>
      {flurry && <Flurry />}
      <FlurryContext value={flurryTo}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </FlurryContext>
    </>
  );
}

export default App;
