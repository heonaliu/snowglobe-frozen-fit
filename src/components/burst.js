import './burst.css'

// App listens for every click on the page and bursts on any button or link
export function burstOnAllButtons() {
  const onClick = (e) => {
    const el = e.target.closest('button, a')
    if (el) burst(e, el)
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}

function burst(e, el, count = 14) {
  let x = e.clientX, y = e.clientY
  if (e.detail === 0) {              // keyboard "click" (Enter/Space): use the button's center
    const r = el.getBoundingClientRect()
    x = r.left + r.width / 2
    y = r.top + r.height / 2
  }

  for (let i = 0; i < count; i++) {
    const flake = document.createElement('span')
    flake.className = 'burst-flake'
    flake.textContent = '❄'

    const angle = Math.random() * Math.PI * 2     
    const dist = 60 + Math.random() * 90        
    flake.style.left = `${x}px`
    flake.style.top = `${y}px`
    flake.style.fontSize = `${12 + Math.random() * 18}px`
    flake.style.setProperty('--dx', `${Math.cos(angle) * dist}px`)
    flake.style.setProperty('--dy', `${Math.sin(angle) * dist - 40}px`)  
    flake.style.setProperty('--spin', `${Math.random() * 720 - 360}deg`)

    flake.addEventListener('animationend', () => flake.remove())   
    document.body.appendChild(flake)
  }
}
