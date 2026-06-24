import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  gravity: number
}

const COLORS = ['#6aaa64', '#c9b458', '#f9df6d', '#a0c35a', '#b0c4ef', '#ba81c5', '#4a90d9', '#e8632b']
const PARTICLE_COUNT = 70
const DURATION = 2500

export function Confetti({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!trigger) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const cx = canvas.width / 2
    const cy = canvas.height * 0.3

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (Math.random() * Math.PI * 2)
      const speed = 3 + Math.random() * 6
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 4 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.12 + Math.random() * 0.06,
      })
    }

    const start = performance.now()
    let frame: number

    function animate(now: number) {
      const elapsed = now - start
      if (elapsed > DURATION) {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
        return
      }

      const fade = elapsed > DURATION * 0.7 ? 1 - (elapsed - DURATION * 0.7) / (DURATION * 0.3) : 1

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      ctx!.globalAlpha = fade

      for (const p of particles) {
        p.x += p.vx
        p.vy += p.gravity
        p.y += p.vy
        p.vx *= 0.99
        p.rotation += p.rotationSpeed

        ctx!.save()
        ctx!.translate(p.x, p.y)
        ctx!.rotate((p.rotation * Math.PI) / 180)
        ctx!.fillStyle = p.color
        ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx!.restore()
      }

      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [trigger])

  if (!trigger) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
    />
  )
}
