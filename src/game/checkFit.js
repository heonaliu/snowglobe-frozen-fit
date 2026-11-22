/**
 * checkFit.js
 *
 * Scores how well the player's body fits inside the target outline.
 *
 * Compares two same-size masks pixel by pixel:
 *   - personMask:  1 = player's body, 0 = background (from useBodySegmentation)
 *   - outlineMask: 1 = inside the outline, 0 = outside (from the outline image)
 *
 * Every pixel falls into one of three groups:
 *   - inside  (green): body pixel inside the outline   → good
 *   - outside (red):   body pixel outside the outline  → penalty
 *   - gap:             outline pixel the body missed   → penalty
 *
 * Fit is measured with Intersection over Union (IoU):
 *   fit = inside / (inside + outside + gaps)   → 0 to 1
 * which is then scaled to a score from 1 to 10.
 *
 * Returns:
 *   {
 *     score,     // 1–10 score for this frame
 *     fit,       // raw fit value, 0–1
 *     inside,    // number of green pixels
 *     outside,   // number of red pixels
 *     gaps,      // number of unfilled outline pixels
 *     colorMap   // per-pixel colors for drawing: 0 none, 1 green, 2 red, 3 gap
 *   }
 * **/

export function checkFit(personMask, outlineMask) {
  let inside = 0, outside = 0, gaps = 0
  const colorMap = new Uint8Array(personMask.length)

  for (let i = 0; i < personMask.length; i++) {
    const person = personMask[i]
    const shape = outlineMask[i]
    if (person && shape)  { inside++;  colorMap[i] = 1 }   // green
    else if (person)      { outside++; colorMap[i] = 2 }   // red
    else if (shape)       { gaps++;    colorMap[i] = 3 }   // gap
  }

  const fit = inside / (inside + outside + gaps || 1)      // || 1 avoids dividing by 0
  const score = Math.round(1 + fit * 9)                    // 0–1 → 1–10
  return { score, fit, inside, outside, gaps, colorMap }
}

// turns checkFit's colorMap into a see-through PNG to lay over the snapshot
// 1 = #9AEAE3 mint (you, inside), 2 = #EA9AE3 pink (you, outside); gaps and background stay clear
// [r, g, b, opacity 0–255]; solid here because the goo filter needs solid shapes,
// the see-through look comes from `opacity` in GamePage.css
const COLORS = { 1: [154, 234, 227, 255], 2: [234, 154, 227, 255] }

// paints the colorMap onto a canvas the same size as the mask (used live and for the snapshot)
export function drawColorMap(ctx, colorMap, width, height) {
  const img = ctx.createImageData(width, height)   // starts fully transparent
  for (let i = 0; i < colorMap.length; i++) {
    const c = COLORS[colorMap[i]]
    if (c) img.data.set(c, i * 4)
  }
  ctx.putImageData(img, 0, 0)
}

export function colorMapToImage(colorMap, width, height) {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  drawColorMap(canvas.getContext("2d"), colorMap, width, height)
  return canvas.toDataURL("image/png")
}
