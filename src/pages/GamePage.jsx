import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useFlurryNavigate } from "../components/Flurry";
import CameraFeed from "../components/CameraFeed";
import OutlineOverlay from "../components/OutlineOverlay";
import LiveFit from "../components/LiveFit";
import Status from "../components/Status";
import Snowflake from "../components/Snowflake";
import { pickRandomOutline, getOutlineMask } from "../game/outlines";
import "./GamePage.css";
import { loadSegmenter, getPersonMask } from "../hooks/useBodySegmentation"
import { checkFit, colorMapToImage } from "../game/checkFit";

const ROUND_SECONDS = 7;
const TOTAL_ROUNDS = 3;


export const GamePage = () => {
  const videoRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(ROUND_SECONDS);
  const [outline, setOutline] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [score, setScore] = useState(null);
  const [fitMap, setFitMap] = useState(null);
  const [round, setRound] = useState(0);          // 1, 2, 3 once playing
  const [results, setResults] = useState([]);     // one entry per finished round
  const navigate = useFlurryNavigate();

  useEffect(() => { loadSegmenter() }, [])

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

    // score the frame (runs after the photo is on the canvas)
    Promise.all([
      getPersonMask(canvas),
      getOutlineMask(outline.fill, canvas.width, canvas.height),
    ]).then(([personMask, outlineMask]) => {
      const result = checkFit(personMask, outlineMask)
      const map = colorMapToImage(result.colorMap, canvas.width, canvas.height)
      setScore(result.score)
      setFitMap(map)
      setResults((prev) => [...prev, { photo, fitMap: map, outline, score: result.score }])
    })

    // jpeg keeps the 3 photos small enough to hand to the results page
    const photo = canvas.toDataURL("image/jpeg", 0.85);
    setSnapshot(photo);
  }, [outline]);

  const startRound = useCallback(() => {
    setSnapshot(null);
    setScore(null);
    setFitMap(null);
    setOutline((prev) => pickRandomOutline(prev));
    setRound((r) => r + 1);
    setSeconds(ROUND_SECONDS);
    setRunning(true);
  }, []);

  // countdown from a fixed end time, so a busy page can't stretch the seconds
  useEffect(() => {
    if (!running) return;
    const end = performance.now() + ROUND_SECONDS * 1000;
    const id = setInterval(() => {
      setSeconds(Math.max(0, Math.ceil((end - performance.now()) / 1000)));
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  // snapshot when it hits 0
  useEffect(() => {
    if (running && seconds <= 0) {
      takeSnapshot();
      setRunning(false);
    }
  }, [running, seconds, takeSnapshot]);

  // show the scored snapshot for 3s, then next round, or the results page after the last one
  useEffect(() => {
    if (!snapshot || score === null) return;
    const id = setTimeout(() => {
      if (round < TOTAL_ROUNDS) startRound();
      else navigate("/results", { state: { rounds: results } });
    }, 3000);
    return () => clearTimeout(id);
  }, [snapshot, score, round, results, startRound, navigate]);

  return (
    <div className="game">
      <CameraFeed videoRef={videoRef} onReady={() => setCameraReady(true)} />
      <div className="game-tint" />

      {running && <OutlineOverlay outline={outline} />}
      {running && <LiveFit videoRef={videoRef} outline={outline} />}

      <Snowflake />
      <Status seconds={seconds} active={running} />

      <Link to="/" className="game-back" onClick={(e) => { e.preventDefault(); navigate("/"); }}>← Home</Link>

      {!cameraReady && <p className="game-hint">Opening camera…</p>}

      {cameraReady && !running && !snapshot && (
        <button className="game-btn game-btn-bottom" onClick={startRound}>
          Start!
        </button>
      )}

      {snapshot && (
        <div className="game-result">
          <div className="game-result-frame">
            <img src={snapshot} alt="Your frozen pose" className="game-result-img" />
            <OutlineOverlay outline={outline} />
            {fitMap && <img src={fitMap} alt="" className="fit-map" />}
          </div>
          <div className="game-score">
            <h3 className="game-score-title">round {round} of {TOTAL_ROUNDS}</h3>
            <p className="game-score-number">{score === null ? "…" : `${score} / 10`}</p>
          </div>
        </div>
      )}
    </div>
  );
};
