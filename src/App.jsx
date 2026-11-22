import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { GamePage } from "./pages/GamePage";
import { ResultsPage } from "./pages/ResultsPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";

// snowflakes made once, outside the component, so flakes don't jump on re-render
const flakes = Array.from({ length: 100 }, () => ({
  left: Math.random() * 100,        // % across
  size: 10 + Math.random() * 20,    // px
  duration: 15 + Math.random() * 12, // seconds to fall
  delay: -Math.random() * 27,        // negative = already mid-fall on load
}));

function App() {
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </>
  );
}

export default App;
