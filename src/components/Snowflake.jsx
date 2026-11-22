import { snowflakeImg } from '../assets'

// Placeholder shown until you add src/assets/snowflake.png
function PlaceholderSnowflake() {
  return (
    <svg viewBox="-100 -100 200 200" className="corner-snowflake-art" aria-hidden="true">
      <g stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none">
        {[0, 45, 90, 135].map((a) => (   
          <g key={a} transform={`rotate(${a})`}>
            <line x1="-90" y1="0" x2="90" y2="0" />
            {[-1, 1].map((s) => (
              <g key={s}>
                <polyline points={`${s * 60},0 ${s * 72},-14`} />
                <polyline points={`${s * 60},0 ${s * 72},14`} />
                <polyline points={`${s * 35},0 ${s * 45},-10`} />
                <polyline points={`${s * 35},0 ${s * 45},10`} />
              </g>
            ))}
          </g>
        ))}
      </g>
    </svg>
  )
}

// Big decorative snowflake, bottom-left of the game screen.
// (Named "corner-snowflake" in CSS so it doesn't clash with the falling
// ".snowflake" flakes on the home page.)
export default function Snowflake() {
  return (
    <div className="corner-snowflake">
      {snowflakeImg ? (
        <img src={snowflakeImg} alt="" className="corner-snowflake-art" draggable="false" />
      ) : (
        <PlaceholderSnowflake />
      )}
    </div>
  )
}
