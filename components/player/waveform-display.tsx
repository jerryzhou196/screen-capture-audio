"use client"

import { useEffect, useRef } from "react"

interface WaveformDisplayProps {
  waveformData: Float32Array | null
  isActive: boolean
}

export function WaveformDisplay({ waveformData, isActive }: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height

    // Dark background with scanlines
    ctx.fillStyle = "#0a0f0a"
    ctx.fillRect(0, 0, w, h)

    // Scanline effect
    ctx.strokeStyle = "rgba(40, 255, 80, 0.03)"
    ctx.lineWidth = 0.5
    for (let y = 0; y < h; y += 2) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    // Grid lines
    ctx.strokeStyle = "rgba(40, 255, 80, 0.08)"
    ctx.lineWidth = 0.5
    for (let x = 0; x < w; x += w / 8) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y < h; y += h / 4) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    if (!waveformData || !isActive) {
      // Draw flat line
      ctx.strokeStyle = "rgba(40, 255, 80, 0.3)"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(0, h / 2)
      ctx.lineTo(w, h / 2)
      ctx.stroke()
      return
    }

    // Draw waveform
    const bufferLength = waveformData.length
    const sliceWidth = w / bufferLength

    // Glow effect
    ctx.shadowBlur = 8
    ctx.shadowColor = "rgba(40, 255, 80, 0.5)"
    ctx.strokeStyle = "#28ff50"
    ctx.lineWidth = 1.5
    ctx.beginPath()

    let x = 0
    for (let i = 0; i < bufferLength; i++) {
      const v = waveformData[i]
      const y = (v + 1) / 2 * h

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      x += sliceWidth
    }

    ctx.stroke()

    // Second pass for brightness
    ctx.shadowBlur = 0
    ctx.strokeStyle = "rgba(100, 255, 130, 0.4)"
    ctx.lineWidth = 3
    ctx.beginPath()
    x = 0
    for (let i = 0; i < bufferLength; i++) {
      const v = waveformData[i]
      const y = (v + 1) / 2 * h
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
      x += sliceWidth
    }
    ctx.stroke()
  }, [waveformData, isActive])

  return (
    <div
      className="relative overflow-hidden rounded-sm"
      style={{
        border: "2px solid #333",
        boxShadow: "inset 0 2px 8px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={{ width: "100%", height: 100 }}
      />
      {/* Glass reflection */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 40%, rgba(0,0,0,0.1) 100%)",
        }}
      />
    </div>
  )
}
