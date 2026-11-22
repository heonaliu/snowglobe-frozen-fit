import { Link, useLocation } from "react-router-dom";
import { useFlurryNavigate } from "../components/Flurry";
import OutlineOverlay from "../components/OutlineOverlay";
import "./GamePage.css";
import "./ResultsPage.css";
import { scoreImgs } from "../assets";

// highest band first; the first one the score reaches wins
const scoreImg = (score) =>
  score === 10 ? scoreImgs.perfect :
  score >= 7  ? scoreImgs.high :
  score >= 4  ? scoreImgs.mid :
                scoreImgs.low;


export const ResultsPage = () => {
  const navigate = useFlurryNavigate();
  // keep <Link> (right-click / open in new tab still work), but route the click through the flurry
  const flurryLink = (e) => { e.preventDefault(); navigate("/"); };
  // the game page hands the rounds over when it navigates here
  const rounds = useLocation().state?.rounds ?? [];
  const total = rounds.reduce((sum, r) => sum + r.score, 0);

  // opened directly or after a refresh: nothing to show
  if (rounds.length === 0) {
    return (
      <div className="results">
        <h1 className="results-title">no results yet</h1>
        <Link to="/" className="results-btn" onClick={flurryLink}>Home</Link>
      </div>
    );
  }

  return (
    <main className="results-page">
    <div className="results">
      <h1 className="results-title">results</h1>
      <p className="results-total">{total} / {rounds.length * 10}</p>

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
            {scoreImg(r.score) && (
              <img src={scoreImg(r.score)} alt="" className="results-score-img" draggable="false" />
            )}
          </article>
        ))}
      </section>

      <div className="results-actions">
        <button className="results-btn" onClick={() => navigate("/game")}>Play again</button>
        <Link to="/" className="results-btn results-btn-quiet" onClick={flurryLink}>Home</Link>
      </div>
    </div>
    </main>
  );
};
