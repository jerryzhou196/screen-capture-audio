"use client"

import { useState, useEffect, useCallback } from "react"

export function OnboardingOverlay({ onDismiss }: { onDismiss: () => void }) {
  const [step, setStep] = useState(0)
  const [exiting, setExiting] = useState(false)

  // Animate through steps
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400),   // cursor appears
      setTimeout(() => setStep(2), 1200),   // cursor moves to tab
      setTimeout(() => setStep(3), 2000),   // tab selected highlight
      setTimeout(() => setStep(4), 2800),   // "share audio" checkbox
      setTimeout(() => setStep(5), 3600),   // checkmark appears
      setTimeout(() => setStep(6), 4400),   // share button pressed
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleDismiss = useCallback(() => {
    setExiting(true)
    setTimeout(onDismiss, 500)
  }, [onDismiss])

  // Auto-dismiss after animation completes
  useEffect(() => {
    const t = setTimeout(handleDismiss, 5800)
    return () => clearTimeout(t)
  }, [handleDismiss])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      style={{
        background: "rgba(6, 6, 10, 0.92)",
        backdropFilter: "blur(8px)",
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.5s ease-out",
      }}
      onClick={handleDismiss}
      role="button"
      tabIndex={0}
      aria-label="Dismiss onboarding"
      onKeyDown={(e) => { if (e.key === "Escape" || e.key === "Enter") handleDismiss() }}
    >
      <div className="flex flex-col items-center gap-8 select-none">
        {/* Title */}
        <div
          className="font-mono text-sm uppercase tracking-[0.3em] transition-all duration-500"
          style={{
            color: "#c8a050",
            opacity: step >= 0 ? 1 : 0,
            transform: step >= 0 ? "translateY(0)" : "translateY(10px)",
          }}
        >
          How to capture audio
        </div>

        {/* Fake browser share dialog */}
        <div
          className="relative rounded-xl overflow-hidden transition-all duration-700"
          style={{
            width: 420,
            background: "linear-gradient(180deg, #2c2c34 0%, #1c1c24 100%)",
            border: "1px solid #3a3a44",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            opacity: step >= 0 ? 1 : 0,
            transform: step >= 0 ? "scale(1)" : "scale(0.95)",
          }}
        >
          {/* Dialog header */}
          <div
            className="flex items-center gap-2 px-5 py-3"
            style={{
              background: "#252530",
              borderBottom: "1px solid #333",
            }}
          >
            <span className="font-mono text-xs" style={{ color: "#aaa" }}>
              Choose what to share
            </span>
          </div>

          {/* Tab bar */}
          <div className="flex px-5 pt-3 gap-3">
            {["A Window", "A Tab"].map((label, i) => (
              <div
                key={label}
                className="font-mono text-[11px] px-4 py-2 rounded-t-md transition-all duration-300"
                style={{
                  color: (step >= 2 && i === 1) ? "#c8a050" : "#777",
                  background: (step >= 2 && i === 1) ? "#1a1a24" : "transparent",
                  borderBottom: (step >= 2 && i === 1) ? "2px solid #c8a050" : "2px solid transparent",
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Tab content - The "Spotify" tab item */}
          <div className="px-5 py-4">
            <div
              className="flex items-center gap-3 p-3 rounded-lg transition-all duration-500"
              style={{
                background: step >= 3 ? "rgba(200, 160, 80, 0.08)" : "rgba(255,255,255,0.02)",
                border: step >= 3 ? "1px solid rgba(200, 160, 80, 0.25)" : "1px solid #2a2a33",
              }}
            >
              {/* Spotify icon */}
              <div
                className="flex items-center justify-center rounded-md shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  background: "#1DB954",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#000">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs" style={{ color: "#ddd" }}>
                  Spotify - Web Player
                </span>
                <span className="font-mono text-[10px]" style={{ color: "#666" }}>
                  open.spotify.com
                </span>
              </div>
              {/* Radio button */}
              <div className="ml-auto">
                <div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: 18,
                    height: 18,
                    border: step >= 3 ? "2px solid #c8a050" : "2px solid #555",
                    background: step >= 3 ? "#c8a050" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {step >= 3 && (
                    <div
                      className="rounded-full"
                      style={{ width: 8, height: 8, background: "#111" }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Share tab audio checkbox */}
          <div
            className="flex items-center gap-3 px-5 py-3 transition-all duration-500"
            style={{
              borderTop: "1px solid #2a2a33",
              opacity: step >= 4 ? 1 : 0.3,
            }}
          >
            <div
              className="flex items-center justify-center rounded-sm transition-all duration-300"
              style={{
                width: 18,
                height: 18,
                border: step >= 5 ? "2px solid #c8a050" : "2px solid #555",
                background: step >= 5 ? "#c8a050" : "transparent",
              }}
            >
              {step >= 5 && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </div>
            <span
              className="font-mono text-[11px] transition-colors duration-300"
              style={{ color: step >= 5 ? "#c8a050" : "#888" }}
            >
              Also share tab audio
            </span>
          </div>

          {/* Share button */}
          <div className="flex justify-end gap-3 px-5 py-4" style={{ borderTop: "1px solid #2a2a33" }}>
            <div
              className="font-mono text-[11px] px-4 py-2 rounded-md"
              style={{ color: "#777", border: "1px solid #333" }}
            >
              Cancel
            </div>
            <div
              className="font-mono text-[11px] px-4 py-2 rounded-md transition-all duration-500"
              style={{
                background: step >= 6 ? "#c8a050" : "#333",
                color: step >= 6 ? "#111" : "#777",
                border: step >= 6 ? "1px solid #c8a050" : "1px solid #444",
                transform: step >= 6 ? "scale(1.05)" : "scale(1)",
                boxShadow: step >= 6 ? "0 0 16px rgba(200,160,80,0.3)" : "none",
              }}
            >
              Share
            </div>
          </div>
        </div>

        {/* Animated cursor */}
        <div
          className="absolute pointer-events-none transition-all duration-700 ease-in-out"
          style={{
            opacity: step >= 1 && step < 6 ? 1 : 0,
            // Position the cursor to point at different elements
            ...(step < 2 ? { left: "55%", top: "60%" } : {}),
            ...(step >= 2 && step < 4 ? { left: "52%", top: "50%" } : {}),
            ...(step >= 4 && step < 6 ? { left: "42%", top: "62%" } : {}),
          }}
        >
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
            <path
              d="M2 1L2 17L6.5 13L11 21L14 19.5L9.5 11.5L15 10L2 1Z"
              fill="#fff"
              stroke="#000"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Bottom hint */}
        <div
          className="font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-500"
          style={{
            color: "#555",
            opacity: step >= 1 ? 1 : 0,
          }}
        >
          click anywhere to skip
        </div>
      </div>
    </div>
  )
}
