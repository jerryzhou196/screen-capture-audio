"use client"

import { useCallback, useRef, useState } from "react"

interface RotaryDialProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  disabled?: boolean
  unit?: string
  color?: string
}

export function RotaryDial({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  disabled = false,
  unit = "",
  color = "#e85d3a",
}: RotaryDialProps) {
  const dialRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  const startValueRef = useRef(0)

  const normalizedValue = (value - min) / (max - min)
  const rotation = -135 + normalizedValue * 270 // -135 to +135 degrees

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      e.preventDefault()
      setIsDragging(true)
      startYRef.current = e.clientY
      startValueRef.current = value
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [disabled, value]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || disabled) return
      const delta = startYRef.current - e.clientY
      const range = max - min
      const sensitivity = 200
      let newValue = startValueRef.current + (delta / sensitivity) * range
      newValue = Math.round(newValue / step) * step
      newValue = Math.max(min, Math.min(max, newValue))
      onChange(newValue)
    },
    [isDragging, disabled, min, max, step, onChange]
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Tick marks around the dial
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const angle = -135 + i * 27 // 270 / 10
    return angle
  })

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="text-[10px] font-mono uppercase tracking-[0.2em]"
        style={{ color: disabled ? "#555" : "#999" }}
      >
        {label}
      </span>

      <div className="relative" style={{ width: 80, height: 80 }}>
        {/* Tick marks */}
        {ticks.map((angle, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: 2,
              height: 6,
              background: i <= normalizedValue * 10 && !disabled ? color : "#444",
              left: "50%",
              top: "50%",
              transformOrigin: "center -28px",
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-28px)`,
              borderRadius: 1,
              transition: "background 0.15s",
            }}
          />
        ))}

        {/* Outer ring */}
        <div
          ref={dialRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute inset-[8px] rounded-full select-none"
          style={{
            cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "grab",
            background: disabled
              ? "radial-gradient(circle at 40% 35%, #2a2a30, #1a1a20)"
              : "radial-gradient(circle at 40% 35%, #3a3a42, #1e1e24)",
            boxShadow: isDragging
              ? `0 0 16px ${color}33, inset 0 1px 2px rgba(255,255,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.6)`
              : "inset 0 1px 2px rgba(255,255,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.6)",
            border: "1px solid #444",
            touchAction: "none",
          }}
        >
          {/* Knurled texture lines (decorative) */}
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: 1,
                height: "100%",
                left: "50%",
                top: 0,
                transform: `rotate(${i * 15}deg)`,
                background: "linear-gradient(to bottom, rgba(255,255,255,0.04), transparent, rgba(255,255,255,0.04))",
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Indicator line */}
          <div
            className="absolute"
            style={{
              width: 3,
              height: 14,
              background: disabled ? "#555" : color,
              left: "50%",
              top: 6,
              transform: `translateX(-50%) rotate(${rotation}deg)`,
              transformOrigin: `center ${(64 - 16) / 2 - 6}px`,
              borderRadius: 2,
              boxShadow: disabled ? "none" : `0 0 6px ${color}88`,
              pointerEvents: "none",
              transition: isDragging ? "none" : "transform 0.1s",
            }}
          />
        </div>
      </div>

      <span
        className="text-xs font-mono tabular-nums"
        style={{ color: disabled ? "#555" : color }}
      >
        {value.toFixed(step < 1 ? 2 : 0)}
        {unit}
      </span>
    </div>
  )
}
