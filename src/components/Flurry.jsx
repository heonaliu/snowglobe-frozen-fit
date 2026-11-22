import { createContext, useContext } from 'react'
import './Flurry.css'

// App provides flurryTo(path, options); any page calls it instead of navigate()
export const FlurryContext = createContext(null)
export const useFlurryNavigate = () => useContext(FlurryContext)

const flakes = Array.from({ length: 200 }, () => ({
    top: Math.random() * 120 - 10,
    left: Math.random() * 130 - 30,  
    size: 12 + Math.random() ** 2 * 108,  
    delay: Math.random() * 0.2,
    spin: 180 + Math.random() * 540,
}))

export default function Flurry() {
    return (
        <div className="flurry" aria-hidden="true">
            {flakes.map((f, i) => (
                <span
                key={i}
                className='flurry-flake'
                style={{
                    top: `${f.top}%`,
                    left: `${f.left}%`,
                    fontSize: `${f.size}px`,
                    animationDelay: `${f.delay}s`,
                    '--spin': `${f.spin}deg`,
                }}
                >❄</span>
            ))}
        </div>
    )
}