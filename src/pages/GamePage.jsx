import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CameraFeed from "../components/CameraFeed";
import OutlineOverlay from "../components/OutlineOverlay";
import Status from "../components/Status";
import Snowflake from "../components/Snowflake";
import { pickRandomOutline } from "../game/outlines";
import "./GamePage.css";

const ROUND_SECONDS = 10;

export const GamePage = () => {
  const videoRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(ROUND_SECONDS);
  const [outline, setOutline] = useState(null);
  const [snapshot, setSnapshot] = useState(null);

  const takeSnapshot = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    // mirror so it matches what the player saw on screen
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    setSnapshot(canvas.toDataURL("image/png"));
  }, []);

  const startRound = () => {
    setSnapshot(null);
    setOutline((prev) => pickRandomOutline(prev));
    setSeconds(ROUND_SECONDS);
    setRunning(true);
  };

  // countdown; snapshot when it hits 0
  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      takeSnapshot();
      setRunning(false);
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, seconds, takeSnapshot]);

  return (
    <div className="game">
      <CameraFeed videoRef={videoRef} onReady={() => setCameraReady(true)} />
      <div className="game-tint" />

      {running && <OutlineOverlay outline={outline} />}

      <Snowflake />
      <Status seconds={seconds} active={running} />

      <Link to="/" className="game-back">← Home</Link>

      {!cameraReady && <p className="game-hint">Opening camera…</p>}

      {cameraReady && !running && !snapshot && (
        <button className="game-btn game-btn-bottom" onClick={startRound}>
          Start!
        </button>
      )}

      {snapshot && (
        <div className="game-result">
          <img src={snapshot} alt="Your frozen pose" className="game-result-img" />
          <button className="game-btn" onClick={startRound}>Play again</button>
        </div>
      )}
    </div>
  );
};
