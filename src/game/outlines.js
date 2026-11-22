// list of outline shapes the players has to fit into. 
export const outlines = [
  { id: "1",   name: "Pattern 1",   src: "/outlines/pattern1.png", fill: "/fills/fillpattern1.png" },
  { id: "2",      name: "Pattern 2", src: "/outlines/pattern2.png", fill: "/fills/fillpattern2.png" },
  { id: "3",     name: "Pattern 3",     src: "/outlines/pattern3.png", fill: "/fills/fillpattern3.png" },
  { id: "4", name: "Pattern 4", src: "/outlines/pattern4.png", fill: "/fills/fillpattern4.png" },
  { id: "5",      name: "Pattern 5", src: "/outlines/pattern5.png", fill: "/fills/fillpattern5.png" },
  { id: "6",     name: "Pattern 6",     src: "/outlines/pattern6.png", fill: "/fills/fillpattern6.png" },
  { id: "7",     name: "Pattern 7",     src: "/outlines/pattern7.png", fill: "/fills/fillpattern7.png" },
];

//picks a random outline for you
export function pickRandomOutline(previous) {
  const options = outlines.filter((o) => o.id !== previous?.id);
  return options[Math.floor(Math.random() * options.length)];
}

// returns one value per pixel: 1 = inside the outline, 0 = outside
// placed as a centred square of side `s` (default: fits the image, like object-fit: contain)
export async function getOutlineMask(fillSrc, W, H, s = Math.min(W, H)) {
  const img = new Image()
  img.src = fillSrc
  await img.decode()                       // wait for the PNG to load

  const canvas = document.createElement("canvas")
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")
  ctx.drawImage(img, (W - s) / 2, (H - s) / 2, s, s)

  const rgba = ctx.getImageData(0, 0, W, H).data       // 4 numbers per pixel: r, g, b, a
  const mask = new Uint8Array(W * H)
  for (let i = 0; i < mask.length; i++) {
    mask[i] = rgba[i * 4 + 3] > 128 ? 1 : 0            // alpha > half = inside
  }
  return mask
}



