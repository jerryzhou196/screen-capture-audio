"use client"

import { TapePlayer } from "@/components/player/tape-player"

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #1e1e2a 0%, #0e0e14 60%, #08080c 100%)",
      }}
    >
      <div className="mb-8 text-center">
        <h1
          className="font-mono text-xs tracking-[0.4em] uppercase mb-1"
          style={{ color: "#666" }}
        >
          Audio Processing Unit
        </h1>
        <p
          className="font-mono text-[10px] tracking-[0.2em]"
          style={{ color: "#444" }}
        >
          Capture tab audio with reverb, bass boost, and waveform visualization
        </p>
      </div>

      <TapePlayer />

      <div className="mt-8 text-center max-w-md">
        <p
          className="font-mono text-[10px] leading-relaxed tracking-[0.05em]"
          style={{ color: "#444" }}
        >
          {'Click "Capture Tab Audio" to begin. Select a browser tab with audio and enable "Share tab audio". Use the dials to adjust reverb mix and bass boost. Record processed output and play it back with speed control.'}
        </p>
      </div>
    </main>
  )
}
