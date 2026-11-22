import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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


export const GamePage = () => {
  const videoRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(ROUND_SECONDS);
  const [outline, setOutline] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [score, setScore] = useState(null);
  const [fitMap, setFitMap] = useState(null);

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
      console.log("score:", result.score, "fit:", result.fit.toFixed(2), result)
      setScore(result.score)
      setFitMap(colorMapToImage(result.colorMap, canvas.width, canvas.height))
    })

    setSnapshot(canvas.toDataURL("image/png"));
  }, [outline]);

  const startRound = useCallback(() => {
    setSnapshot(null);
    setScore(null);
    setFitMap(null);
    setOutline((prev) => pickRandomOutline(prev));
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

  useEffect(() => {
  if (!snapshot) return;
  const id = setTimeout(startRound, 3000);
  return () => clearTimeout(id);
  }, [snapshot, startRound]);

  return (
    <div className="game">
      {/* "goo" filter: blur, then snap the edge back to sharp, so blocky masks become smooth blobs */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="goo" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
        </filter>
      </svg>
      <CameraFeed videoRef={videoRef} onReady={() => setCameraReady(true)} />
      <div className="game-tint" />

      {running && <OutlineOverlay outline={outline} />}
      {running && <LiveFit videoRef={videoRef} outline={outline} />}

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
          <div className="game-result-frame">
            <img src={snapshot} alt="Your frozen pose" className="game-result-img" />
            <OutlineOverlay outline={outline} />
            {fitMap && <img src={fitMap} alt="" className="fit-map" />}
          </div>
          <div className="game-score">
            <h3 className="game-score-title">your score</h3>
            <p className="game-score-number">{score === null ? "…" : `${score} / 10`}</p>
          </div>
        </div>
      )}
    </div>
  );
};
