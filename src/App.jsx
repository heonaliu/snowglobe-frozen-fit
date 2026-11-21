import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { GamePage } from "./pages/GamePage";

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </>
  );
}

export default App;
