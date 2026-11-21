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