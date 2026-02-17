"use client"

import { TapePlayer } from "@/components/player/tape-player"

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 animate-fade-in"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #1e1e2a 0%, #0e0e14 60%, #08080c 100%)",
      }}
    >
      <div className="mb-10 text-center">
        <h1
          className="font-mono text-4xl font-bold tracking-[0.15em] lowercase sm:text-5xl md:text-6xl"
          style={{ color: "#c8a050" }}
        >
          slowedrvb.com
        </h1>
      </div>

      <TapePlayer />

      <div className="mt-10 text-center max-w-md">
        <p
          className="font-mono text-[10px] leading-relaxed tracking-[0.05em]"
          style={{ color: "#444" }}
        >
          {'Click "Capture Tab Audio" to begin. Select a browser tab with audio and enable "Share tab audio". Adjust reverb, bass, and speed during capture or playback.'}
        </p>
      </div>
    </main>
  )
}
