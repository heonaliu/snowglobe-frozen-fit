import { useState } from "react";
import { Link } from "react-router-dom";
import { submitScore, MAX_MEMBERS, MAX_NAME } from "../game/leaderboard";
import "./SubmitScore.css";

// "Save your score" form: a team name plus up to 7 team members.
export default function SubmitScore({ score, maxScore }) {
  const [team, setTeam] = useState("");
  const [members, setMembers] = useState(["", ""]);
  const [status, setStatus] = useState("idle");   // idle | saving | saved
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(null);       // { entry, rank } once saved

  const setMember = (i, value) =>
    setMembers((list) => list.map((m, j) => (j === i ? value : m)));
  const addMember = () => setMembers((list) => [...list, ""]);
  const removeMember = (i) => setMembers((list) => list.filter((_, j) => j !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("saving");
    setError("");
    try {
      const result = await submitScore({ team, members, score });
      setSaved(result);
      setStatus("saved");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  };

  if (status === "saved") {
    return (
      <section className="results-form" aria-live="polite">
        <h2 className="results-form-title">saved!</h2>
        <p className="results-form-text">
          <strong>{saved.entry.team}</strong> is #{saved.rank} on the leaderboard.
        </p>
        <Link
          to="/leaderboard"
          state={{ highlightId: saved.entry.id }}
          className="results-btn"
        >
          See leaderboard
        </Link>
      </section>
    );
  }

  return (
    <form className="results-form" onSubmit={handleSubmit}>
      <h2 className="results-form-title">save your score</h2>
      <p className="results-form-text">
        {score} / {maxScore} — add your team to the leaderboard!
      </p>

      <label className="results-label" htmlFor="team-name">Team name</label>
      <input
        id="team-name"
        className="results-input"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        maxLength={MAX_NAME}
        placeholder="e.g. The Ice Cubes"
        autoComplete="off"
        required
      />

      <span className="results-label" id="members-label">Team members</span>
      <div className="results-members" role="group" aria-labelledby="members-label">
        {members.map((name, i) => (
          <div className="results-member" key={i}>
            <input
              className="results-input"
              value={name}
              onChange={(e) => setMember(i, e.target.value)}
              maxLength={MAX_NAME}
              placeholder={`Member ${i + 1}`}
              aria-label={`Member ${i + 1}`}
              autoComplete="off"
            />
            {members.length > 1 && (
              <button
                type="button"
                className="results-remove"
                onClick={() => removeMember(i)}
                aria-label={`Remove member ${i + 1}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {members.length < MAX_MEMBERS && (
        <button type="button" className="results-add" onClick={addMember}>
          + add member ({members.length}/{MAX_MEMBERS})
        </button>
      )}

      {error && <p className="results-error" role="alert">{error}</p>}

      <button className="results-btn" type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Save to leaderboard"}
      </button>
    </form>
  );
}