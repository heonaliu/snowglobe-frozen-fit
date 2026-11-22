import { FilesetResolver, ImageSegmenter } from "@mediapipe/tasks-vision"

let segmenterPromise = null

// downloads the model the first time it's called; later calls reuse it
export function loadSegmenter() {
  if (!segmenterPromise) {
    segmenterPromise = FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm"
    ).then((vision) =>
      ImageSegmenter.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite",
          delegate: "GPU", // run the model on the graphics card, not the CPU
        },
        runningMode: "IMAGE",
        outputCategoryMask: true,
      })
    )
  }
  return segmenterPromise
}

// returns one value per pixel: 1 = person, 0 = background
export async function getPersonMask(canvas) {
  const segmenter = await loadSegmenter()
  const result = segmenter.segment(canvas)
  const labels = result.categoryMask.getAsUint8Array()
  result.close()
  return labels.map((v) => (v > 0 ? 1 : 0))
}
