import { Link, useLocation } from "react-router-dom";
import { useFlurryNavigate } from "../components/Flurry";
import OutlineOverlay from "../components/OutlineOverlay";
import "./GamePage.css";
import "./ResultsPage.css";
import SubmitScore from "../components/SubmitScore";
import { scoreImg } from "../assets";
import SixSeven, { isSixSeven } from "../components/SixSeven";

export const ResultsPage = () => {
  const navigate = useFlurryNavigate();
  // keep <Link> (right-click / open in new tab still work), but route the click through the flurry
  const flurryLink = (e) => { e.preventDefault(); navigate(e.currentTarget.getAttribute("href")); };  // goes to the link's own "to"
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
      <SubmitScore score={total} maxScore={rounds.length * 10} />

      <section className="results-rounds">
        {rounds.map((r, i) => (
          <article key={i} className="game-score results-card">
            <h3 className="game-score-title">round {i + 1}</h3>
            {/* the photo shrinks to fit the space left in the card; the frame hugs it so the overlays line up */}
            <div className="results-photo">
              <div className="game-result-frame results-frame">
                <img src={r.photo} alt={`Your pose in round ${i + 1}`} className="game-result-img results-img" />
                <OutlineOverlay outline={r.outline} />
                <img src={r.fitMap} alt="" className="fit-map" />
              </div>
            </div>
            <p className="game-score-number">{r.score} / 10</p>
            {/* cube picture, stuck on the card's top corner like a sticker */}
            {scoreImg(r.score) && (
              <img src={scoreImg(r.score)} alt="" className="results-score-img" draggable="false" />
            )}
          </article>
        ))}
      </section>
      {/* easter egg: any round that scored 7 right after a 6. Waits for the cubes to pop first */}
      {rounds.some((r, i) => isSixSeven(rounds[i - 1]?.score, r.score)) && <SixSeven delay={0.9} />}

      <div className="results-actions">
        <button className="results-btn" onClick={() => navigate("/game")}>Play again</button>
        <Link to="/" className="results-btn results-btn-quiet" onClick={flurryLink}>Home</Link>
        <Link to="/leaderboard" className="results-btn results-btn-quiet" onClick={flurryLink}>Leaderboard</Link>
      </div>
    </div>
    </main>
  );
};
