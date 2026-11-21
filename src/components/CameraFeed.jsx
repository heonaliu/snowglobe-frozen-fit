import { useEffect, useRef, useState } from "react"

export default function CameraFeed() {
    const videoRef = useRef(null)
    const [error, setError] = useState(null)
    
    useEffect(() => {
        let stream;
        let cancelled = false;

        navigator.mediaDevices.getUserMedia({ video: true, audio: false}).then((s) => {
            if (cancelled) {
                s.getTracks().forEach((t) => t.stop())
                return
            }
            stream = s
            if (videoRef.current) {
                videoRef.current.srcObject = stream
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
            if (videoRef.current) {
                videoRef.current.srcObject = null
            }
        }
    }, [])

    return (
        <div>
            {error ? <p>Unable to access the camera.</p> : null}
            <video ref={videoRef} autoPlay playsInline muted style={{ width: "940px", height: "540px" }} />
        </div>
    )
}