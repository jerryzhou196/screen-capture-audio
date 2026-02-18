"use client"

import { useState, useEffect, useCallback } from "react"

export function OnboardingOverlay({ onDismiss }: { onDismiss: () => void }) {
  const [step, setStep] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 1200),
      setTimeout(() => setStep(3), 2400),
      setTimeout(() => setStep(4), 3600),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleDismiss = useCallback(() => {
    setExiting(true)
    setTimeout(onDismiss, 500)
  }, [onDismiss])

  useEffect(() => {
    const t = setTimeout(handleDismiss, 5200)
    return () => clearTimeout(t)
  }, [handleDismiss])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      style={{
        background: "rgba(6, 6, 10, 0.94)",
        backdropFilter: "blur(12px)",
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.5s ease-out",
      }}
      onClick={handleDismiss}
      role="button"
      tabIndex={0}
      aria-label="Dismiss onboarding"
      onKeyDown={(e) => {
        if (e.key === "Escape" || e.key === "Enter") handleDismiss()
      }}
    >
      <div className="flex flex-col items-center gap-10 select-none">
        {/* Step badges stacked vertically */}
        <div className="flex flex-col items-center gap-6">
          {/* Step 1: Click capture */}
          <div
            className="flex items-center gap-4 transition-all duration-700"
            style={{
              opacity: step >= 1 ? 1 : 0,
              transform: step >= 1 ? "translateY(0)" : "translateY(16px)",
            }}
          >
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{
                width: 40,
                height: 40,
                background: step >= 1 ? "rgba(200,160,80,0.15)" : "transparent",
                border: "1.5px solid rgba(200,160,80,0.3)",
              }}
            >
              <span className="font-mono text-sm font-bold" style={{ color: "#c8a050" }}>
                1
              </span>
            </div>
            <span className="font-mono text-sm" style={{ color: "#bbb" }}>
              Click{" "}
              <span
                className="inline-block px-2 py-0.5 rounded"
                style={{
                  background: "linear-gradient(180deg, #c8a050, #a07830)",
                  color: "#111",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                Capture Tab Audio
              </span>
            </span>
          </div>

          {/* Step 2: Pick a tab */}
          <div
            className="flex items-center gap-4 transition-all duration-700"
            style={{
              opacity: step >= 2 ? 1 : 0,
              transform: step >= 2 ? "translateY(0)" : "translateY(16px)",
            }}
          >
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{
                width: 40,
                height: 40,
                background: step >= 2 ? "rgba(200,160,80,0.15)" : "transparent",
                border: "1.5px solid rgba(200,160,80,0.3)",
              }}
            >
              <span className="font-mono text-sm font-bold" style={{ color: "#c8a050" }}>
                2
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm" style={{ color: "#bbb" }}>
                Share a tab playing audio, like
              </span>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                style={{
                  background: "rgba(29,185,84,0.12)",
                  border: "1px solid rgba(29,185,84,0.3)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span className="font-mono text-xs font-bold" style={{ color: "#1DB954" }}>
                  Spotify
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Check "share tab audio" */}
          <div
            className="flex items-center gap-4 transition-all duration-700"
            style={{
              opacity: step >= 3 ? 1 : 0,
              transform: step >= 3 ? "translateY(0)" : "translateY(16px)",
            }}
          >
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{
                width: 40,
                height: 40,
                background: step >= 3 ? "rgba(200,160,80,0.15)" : "transparent",
                border: "1.5px solid rgba(200,160,80,0.3)",
              }}
            >
              <span className="font-mono text-sm font-bold" style={{ color: "#c8a050" }}>
                3
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm" style={{ color: "#bbb" }}>
                Check
              </span>
              <div className="flex items-center gap-1.5">
                <div
                  className="flex items-center justify-center rounded-sm"
                  style={{
                    width: 16,
                    height: 16,
                    border: "1.5px solid #c8a050",
                    background: "#c8a050",
                  }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#111"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#c8a050" }}
                >
                  {"\"Also share tab audio\""}
                </span>
              </div>
            </div>
          </div>

          {/* Step 4: Enjoy */}
          <div
            className="flex items-center gap-4 transition-all duration-700"
            style={{
              opacity: step >= 4 ? 1 : 0,
              transform: step >= 4 ? "translateY(0)" : "translateY(16px)",
            }}
          >
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{
                width: 40,
                height: 40,
                background: step >= 4 ? "rgba(200,160,80,0.15)" : "transparent",
                border: "1.5px solid rgba(200,160,80,0.3)",
              }}
            >
              <span className="font-mono text-sm font-bold" style={{ color: "#c8a050" }}>
                4
              </span>
            </div>
            <span className="font-mono text-sm" style={{ color: "#bbb" }}>
              Twist the dials and vibe
            </span>
          </div>
        </div>

        {/* Skip hint */}
        <div
          className="font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-500"
          style={{
            color: "#444",
            opacity: step >= 1 ? 1 : 0,
          }}
        >
          click anywhere to skip
        </div>
      </div>
    </div>
  )
}
