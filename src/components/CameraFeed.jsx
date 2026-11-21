import { useEffect, useState } from "react"

// Opens the webcam and fills its parent (the game screen) with the feed.
// The parent owns `videoRef` so it can grab a snapshot from the video.
export default function CameraFeed({ videoRef, onReady }) {
    const [error, setError] = useState(null)

    useEffect(() => {
        let stream;
        let cancelled = false;
        const video = videoRef.current

        navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: false,
        }).then((s) => {
            if (cancelled) {
                s.getTracks().forEach((t) => t.stop())
                return
            }
            stream = s
            if (video) {
                video.srcObject = stream
            }
        }).catch((err) => {
            console.error("Error accessing camera: ", err)
            if (!cancelled) {
                setError(err)
            }
        })

        return () => {
            cancelled = true // the leaving of page will cancel the camera
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
            }
            if (video) {
                video.srcObject = null
            }
        }
    }, [videoRef])

    return (
        <>
            <video
                ref={videoRef}
                className="camera"
                autoPlay
                playsInline
                muted
                onLoadedMetadata={onReady}
            />
            {error ? (
                <p className="camera-error">
                    Unable to access the camera. Please allow camera access and refresh.
                </p>
            ) : null}
        </>
    )
}
