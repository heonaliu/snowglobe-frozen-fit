// Drop your own drawings into this folder named exactly:
//   snowflake.png   (large corner snowflake)
//   timer.png       (frame/background for the countdown)
// PNG, SVG, WEBP or JPG all work. If a file is missing, a simple
// placeholder shape is shown instead so the page never breaks.
const found = import.meta.glob('./*.{png,svg,webp,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const pick = (name) => {
  const key = Object.keys(found).find((k) =>
    new RegExp(`^\\./${name}\\.(png|svg|webp|jpe?g)$`, 'i').test(k)
  )
  return key ? found[key] : null
}

export const snowflakeImg = pick('snowflake')
export const timerImg = pick('timer')

// Home page art slots
export const titleImg = pick('title')   // title picture at the top
export const cardImgs = [pick('card1'), pick('card2'), pick('card3')]  // one per card

export const scoreImgs = {
  low: '/cubes/melty.png', // 0 - 2  
  mid: '/cubes/pray.png', // 3 - 5
  high: '/cubes/thumbsup.png',   // 6–7
  perfect: '/cubes/cheffkiss.png', // 8 - 10
}

// cube picture for a 0–10 score (used on the game and results pages)
export const scoreImg = (score) =>
  score >= 8 ? scoreImgs.perfect :
  score >= 6 ? scoreImgs.high :
  score >= 3 ? scoreImgs.mid :
               scoreImgs.low