import { useEffect, useState } from "react"

export default function CameraFeed() {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
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

    const takeSnapshot = () => {
        const video = videoRef.current 
        if (!video.videoWidth) return 
        const canvas = canvasRef.current 

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        ctx.drawImage(video, 0, 0)
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        console.log(data)
    }

    useEffect(() => {
        const id = setInterval(takeSnapshot, 3 * 1000)
        return () => clearInterval(id)
    }, [])

    return (
        <div>
            {error ? <p>Unable to access the camera. Please allow access and refresh.</p> : null}
            <video ref={videoRef} autoPlay playsInline muted style={{ width: "940px", height: "540px" }} />
            <canvas ref={canvasRef} style={{ display: "none"}} />
        </div>
    )
}

