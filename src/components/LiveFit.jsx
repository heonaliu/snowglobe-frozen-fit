import { useEffect, useRef } from "react"
import { getPersonMask } from "../hooks/useBodySegmentation"
import { getOutlineMask } from "../game/outlines"
import { checkFit, drawColorMap } from "../game/checkFit"

// the model works at 256x256 internally, so a bigger frame only costs time
const W = 256
// pause between live frames so the video and countdown stay smooth (~8 updates/sec max)
const GAP_MS = 120

// Live green/red over the moving camera while the countdown runs.
// Works on a small mirrored copy of the video, shown with object-fit: cover like .camera.
export default function LiveFit({ videoRef, outline }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const out = canvasRef.current
    if (!outline || !video?.videoWidth) return

    const H = Math.round((W * video.videoHeight) / video.videoWidth)
    out.width = W
    out.height = H
    const outCtx = out.getContext("2d")

    const frame = document.createElement("canvas")
    frame.width = W
    frame.height = H
    const frameCtx = frame.getContext("2d", { willReadFrequently: true })
    frameCtx.setTransform(-1, 0, 0, 1, W, 0) // mirror, like the camera

    // The screen outline is a centred square the size of the screen's short side.
    // The camera is scaled by k to cover the screen, so in frame pixels that square is side/k.
    const k = Math.max(video.clientWidth / W, video.clientHeight / H)
    const side = Math.min(video.clientWidth, video.clientHeight) / k

    let stopped = false
    let timer
    getOutlineMask(outline.fill, W, H, side).then((outlineMask) => {
      const tick = async () => {
        if (stopped) return
        frameCtx.drawImage(video, 0, 0, W, H)
        const personMask = await getPersonMask(frame)
        if (stopped) return
        drawColorMap(outCtx, checkFit(personMask, outlineMask).colorMap, W, H)
        timer = setTimeout(tick, GAP_MS)
      }
      tick()
    })

    return () => {
      stopped = true
      clearTimeout(timer)
    }
  }, [outline, videoRef])

  return <canvas ref={canvasRef} className="live-fit" />
}
