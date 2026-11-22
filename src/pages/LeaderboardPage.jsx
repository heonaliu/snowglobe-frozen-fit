import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchLeaderboard } from "../game/leaderboard";
import { useFlurryNavigate } from "../components/Flurry";
import "./LeaderboardPage.css";

const TINTS = ["lavender", "butter", "sky"];   // top three get the card colors from the home page

const formatDate = (ms) =>
  new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export const LeaderboardPage = () => {
  // the results page passes the id of the team that just saved, so we can highlight it
  const highlightId = useLocation().state?.highlightId;
  const navigate = useFlurryNavigate();
  // keep <Link> (right-click / new tab still work), but route the click through the flurry
  const flurryLink = (e) => { e.preventDefault(); navigate(e.currentTarget.getAttribute("href")); };
  const [entries, setEntries] = useState(null);   // null = still loading
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchLeaderboard()
      .then((list) => { if (!cancelled) setEntries(list); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="board">
      <h1 className="board-title">leaderboard</h1>
      <p className="board-sub">can you find your place?</p>

      {error && <p className="board-message" role="alert">{error}</p>}
      {!error && entries === null && <p className="board-message">loading…</p>}
      {entries?.length === 0 && (
        <p className="board-message">no scores yet — be the first to freeze!</p>
      )}

      {entries?.length > 0 && (
        <ol className="board-list">
          {entries.map((e, i) => (
            <li
              key={e.id}
              className={[
                "board-row",
                i < 3 ? `board-row-${TINTS[i]}` : "",
                e.id === highlightId ? "board-row-you" : "",
              ].join(" ")}
            >
              <span className="board-rank">{i + 1}</span>
              <div className="board-team">
                <span className="board-name">{e.team}</span>
                {e.members.length > 0 && (
                  <span className="board-members">{e.members.join(", ")}</span>
                )}
              </div>
              <div className="board-score">
                <span>{e.score}</span>
                <span className="board-date">{formatDate(e.createdAt)}</span>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="board-actions">
        <Link to="/game" className="board-btn" onClick={flurryLink}>Play</Link>
        <Link to="/" className="board-btn board-btn-quiet" onClick={flurryLink}>Home</Link>
      </div>
    </div>
  );
};