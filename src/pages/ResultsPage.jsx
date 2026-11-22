import { Link, useLocation, useNavigate } from "react-router-dom";
import OutlineOverlay from "../components/OutlineOverlay";
import "./GamePage.css";
import "./ResultsPage.css";
import SubmitScore from "../components/SubmitScore";

export const ResultsPage = () => {
  const navigate = useNavigate();
  // the game page hands the rounds over when it navigates here
  const rounds = useLocation().state?.rounds ?? [];
  const total = rounds.reduce((sum, r) => sum + r.score, 0);

  // opened directly or after a refresh: nothing to show
  if (rounds.length === 0) {
    return (
      <div className="results">
        <h1 className="results-title">no results yet</h1>
        <Link to="/" className="results-btn">Home</Link>
      </div>
    );
  }

  return (
    <div className="results">
      <h1 className="results-title">results</h1>
      <p className="results-total">{total} / {rounds.length * 10}</p>
      <SubmitScore score={total} maxScore={rounds.length * 10} />

      <section className="results-rounds">
        {rounds.map((r, i) => (
          <article key={i} className="game-score results-card">
            <h3 className="game-score-title">round {i + 1}</h3>
            <div className="game-result-frame results-frame">
              <img src={r.photo} alt={`Your pose in round ${i + 1}`} className="game-result-img results-img" />
              <OutlineOverlay outline={r.outline} />
              <img src={r.fitMap} alt="" className="fit-map" />
            </div>
            <p className="game-score-number">{r.score} / 10</p>
          </article>
        ))}
      </section>

      <div className="results-actions">
        <button className="results-btn" onClick={() => navigate("/game")}>Play again</button>
        <Link to="/" className="results-btn results-btn-quiet">Home</Link>
        <Link to="/leaderboard" className="results-btn results-btn-quiet">Leaderboard</Link>
      </div>
    </div>
  );
};
