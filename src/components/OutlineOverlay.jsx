// Draws the current target outline on top of the camera.
// The outline PNGs are square, so we fit them to the screen with "contain".
export default function OutlineOverlay({ outline }) {
  if (!outline) return null
  return (
  <>
    <div className="outline-shade" style={{ "--fill": `url(${outline.fill})` }} />
    <img
      key={outline.id}
      className="outline-overlay"
      src={outline.src}
      alt={outline.name}
      draggable="false"
    />
  </>
  )
}
