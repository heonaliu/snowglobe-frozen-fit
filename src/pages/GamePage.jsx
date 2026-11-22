import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CameraFeed from "../components/CameraFeed";
import OutlineOverlay from "../components/OutlineOverlay";
import Status from "../components/Status";
import Snowflake from "../components/Snowflake";
import { pickRandomOutline, getOutlineMask } from "../game/outlines";
import "./GamePage.css";
import { loadSegmenter, getPersonMask } from "../hooks/useBodySegmentation"
import { checkFit } from "../game/checkFit";

const ROUND_SECONDS = 7;


export const GamePage = () => {
  const videoRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(ROUND_SECONDS);
  const [outline, setOutline] = useState(null);
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => { loadSegmenter() }, [])

  const takeSnapshot = useCallback(() => {
    Promise.all([
      getPersonMask(canvas),
      getOutlineMask(outline.fill, canvas.width, canvas.height),
    ]).then(([personMask, outlineMask]) => {
    const result = checkFit(personMask, outlineMask)
    console.log("score:", result.score, "fit:", result.fit.toFixed(2), result)
    })

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
    getPersonMask(canvas).then((mask) => {
      const count = mask.reduce((a, b) => a + b, 0)
      console.log("person pixels:", count, "of", mask.length)
    })
    getOutlineMask(outline.fill, canvas.width, canvas.height).then((mask) => {
      const count = mask.reduce((a, b) => a + b, 0)
      console.log("outline pixels:", count, "of", mask.length)
    })

    setSnapshot(canvas.toDataURL("image/png"));
  }, [outline]);

  const startRound = useCallback(() => {
    setSnapshot(null);
    setOutline((prev) => pickRandomOutline(prev));
    setSeconds(ROUND_SECONDS);
    setRunning(true);
  }, []);

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

  useEffect(() => {
  if (!snapshot) return;
  const id = setTimeout(startRound, 3000);
  return () => clearTimeout(id);
  }, [snapshot, startRound]);

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
          <div className="game-result-frame">
            <img src={snapshot} alt="Your frozen pose" className="game-result-img" />
            <OutlineOverlay outline={outline} />
          </div>
        </div>
      )}
    </div>
  );
};
