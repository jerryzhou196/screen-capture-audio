"use client"

import { useEffect, useRef, useState } from "react"

interface TapeReelsProps {
  isPlaying: boolean
  isReversing: boolean
}

export function TapeReels({ isPlaying, isReversing }: TapeReelsProps) {
  const [rotation, setRotation] = useState(0)
  const animRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!isPlaying && !isReversing) {
      cancelAnimationFrame(animRef.current)
      return
    }

    const speed = isReversing ? -120 : 60 // degrees per second

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time
      const delta = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time
      setRotation((prev) => prev + speed * delta)
      animRef.current = requestAnimationFrame(animate)
    }

    lastTimeRef.current = 0
    animRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animRef.current)
  }, [isPlaying, isReversing])

  const reelStyle = (offset: number) => ({
    transform: `rotate(${rotation + offset}deg)`,
  })

  return (
    <div
      className="relative flex items-center justify-center gap-10 py-4 px-6 rounded-md overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(10,10,15,0.8) 100%)",
        border: "1px solid #333",
        boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Glass reflection overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
          borderRadius: "inherit",
        }}
      />

      {/* Left reel */}
      <div className="relative" style={{ width: 72, height: 72 }}>
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 40%, #2a2a30, #111114)",
            border: "2px solid #333",
            boxShadow: "inset 0 0 12px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)",
            ...reelStyle(0),
          }}
        >
          {/* Spokes */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <div
              key={angle}
              className="absolute"
              style={{
                width: 2,
                height: "45%",
                background: "#555",
                left: "50%",
                top: "5%",
                transformOrigin: "center bottom",
                transform: `translateX(-50%) rotate(${angle}deg)`,
              }}
            />
          ))}
          {/* Center hub */}
          <div
            className="absolute rounded-full"
            style={{
              width: 16,
              height: 16,
              background: "radial-gradient(circle at 40% 40%, #444, #222)",
              border: "1px solid #555",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </div>

      {/* Tape path (decorative) */}
      <div className="flex flex-col items-center gap-1">
        <div
          style={{
            width: 60,
            height: 3,
            background: isPlaying || isReversing ? "#4a3025" : "#2a1a15",
            borderRadius: 2,
            boxShadow: isPlaying || isReversing ? "0 0 4px rgba(180, 100, 50, 0.3)" : "none",
            transition: "all 0.3s",
          }}
        />
        <span
          className="text-[8px] font-mono uppercase tracking-[0.15em]"
          style={{ color: "#555" }}
        >
          {isReversing ? "REWIND" : isPlaying ? "PLAY" : "STOP"}
        </span>
        <div
          style={{
            width: 60,
            height: 3,
            background: isPlaying || isReversing ? "#4a3025" : "#2a1a15",
            borderRadius: 2,
            boxShadow: isPlaying || isReversing ? "0 0 4px rgba(180, 100, 50, 0.3)" : "none",
            transition: "all 0.3s",
          }}
        />
      </div>

      {/* Right reel */}
      <div className="relative" style={{ width: 72, height: 72 }}>
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 40%, #2a2a30, #111114)",
            border: "2px solid #333",
            boxShadow: "inset 0 0 12px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)",
            ...reelStyle(30),
          }}
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <div
              key={angle}
              className="absolute"
              style={{
                width: 2,
                height: "45%",
                background: "#555",
                left: "50%",
                top: "5%",
                transformOrigin: "center bottom",
                transform: `translateX(-50%) rotate(${angle}deg)`,
              }}
            />
          ))}
          <div
            className="absolute rounded-full"
            style={{
              width: 16,
              height: 16,
              background: "radial-gradient(circle at 40% 40%, #444, #222)",
              border: "1px solid #555",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </div>
    </div>
  )
}
