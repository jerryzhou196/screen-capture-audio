"use client"

import { useEffect, useRef } from "react"
import type { Recording } from "@/hooks/use-audio-engine"

interface CassetteSidebarProps {
  recordings: Recording[]
  activeRecordingId: string | null
  isPlayingBack: boolean
  onSelect: (id: string) => void
  onPlay: (id: string) => void
  onDownload: (id: string) => void
}

function formatTime(timestamp: number) {
  const d = new Date(timestamp)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

function CassetteTape({
  recording,
  isActive,
  isPlaying,
  index,
  onSelect,
  onPlay,
  onDownload,
}: {
  recording: Recording
  isActive: boolean
  isPlaying: boolean
  index: number
  onSelect: () => void
  onPlay: () => void
  onDownload: () => void
}) {
  return (
    <div
      className="cassette-slide-in group relative cursor-pointer"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`Select recording ${index + 1}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect()
      }}
    >
      {/* Cassette body */}
      <div
        className="relative rounded-lg overflow-hidden transition-all duration-200"
        style={{
          background: isActive
            ? "linear-gradient(180deg, #3a3040 0%, #2a2230 100%)"
            : "linear-gradient(180deg, #2a2a32 0%, #1e1e26 100%)",
          border: isActive ? "1px solid #c8a050" : "1px solid #333",
          boxShadow: isActive
            ? "0 0 12px rgba(200, 160, 80, 0.15), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
          padding: "10px 12px",
        }}
      >
        {/* Top label area */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="font-mono text-[9px] font-bold uppercase tracking-[0.15em]"
            style={{ color: isActive ? "#c8a050" : "#888" }}
          >
            TAPE {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="font-mono text-[8px] tracking-[0.05em]"
            style={{ color: "#555" }}
          >
            {formatTime(recording.createdAt)}
          </span>
        </div>

        {/* Mini tape window */}
        <div
          className="relative flex items-center justify-center gap-3 rounded-sm overflow-hidden mb-2"
          style={{
            background: "linear-gradient(180deg, #12121a, #0e0e16)",
            border: "1px solid #222",
            padding: "6px 8px",
            height: 32,
          }}
        >
          {/* Mini glass overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 50%)",
            }}
          />
          {/* Left mini reel */}
          <div
            className="rounded-full"
            style={{
              width: 18,
              height: 18,
              background: "radial-gradient(circle at 40% 40%, #2a2a30, #111)",
              border: "1px solid #333",
              animation: isActive && isPlaying ? "spin 2s linear infinite" : "none",
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 6,
                height: 6,
                background: "#333",
                border: "1px solid #444",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
          {/* Tape strip */}
          <div
            style={{
              width: 24,
              height: 2,
              background: isActive && isPlaying ? "#4a3025" : "#2a1a15",
              borderRadius: 1,
            }}
          />
          {/* Right mini reel */}
          <div
            className="rounded-full"
            style={{
              width: 18,
              height: 18,
              background: "radial-gradient(circle at 40% 40%, #2a2a30, #111)",
              border: "1px solid #333",
              animation: isActive && isPlaying ? "spin 2s linear infinite" : "none",
            }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPlay()
            }}
            className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm transition-all"
            style={{
              background: isActive && isPlaying ? "#e85d3a" : "transparent",
              color: isActive && isPlaying ? "#fff" : "#777",
              border: `1px solid ${isActive && isPlaying ? "#e85d3a" : "#444"}`,
            }}
            aria-label={isActive && isPlaying ? "Playing" : "Play recording"}
          >
            <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor">
              {isActive && isPlaying ? (
                <rect x="4" y="4" width="16" height="16" rx="2" />
              ) : (
                <path d="M5 3l14 9-14 9V3z" />
              )}
            </svg>
            {isActive && isPlaying ? "Playing" : "Play"}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onDownload()
            }}
            className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm transition-all"
            style={{
              color: "#666",
              border: "1px solid #333",
            }}
            aria-label="Download recording"
          >
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export function CassetteSidebar({
  recordings,
  activeRecordingId,
  isPlayingBack,
  onSelect,
  onPlay,
  onDownload,
}: CassetteSidebarProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new recordings arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [recordings.length])

  if (recordings.length === 0) return null

  return (
    <div
      className="flex flex-col gap-3 w-[200px] shrink-0 cassette-slide-in"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: recordings.length > 0 ? "#c8a050" : "#444",
            boxShadow: recordings.length > 0 ? "0 0 6px rgba(200,160,80,0.4)" : "none",
          }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold"
          style={{ color: "#888" }}
        >
          Cassettes
        </span>
        <span
          className="font-mono text-[9px] ml-auto"
          style={{ color: "#555" }}
        >
          {recordings.length}
        </span>
      </div>

      {/* Scrollable cassette list */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-2 overflow-y-auto pr-1"
        style={{
          maxHeight: "calc(100vh - 300px)",
          scrollbarWidth: "thin",
          scrollbarColor: "#333 transparent",
        }}
      >
        {recordings.map((recording, index) => (
          <CassetteTape
            key={recording.id}
            recording={recording}
            isActive={recording.id === activeRecordingId}
            isPlaying={recording.id === activeRecordingId && isPlayingBack}
            index={index}
            onSelect={() => onSelect(recording.id)}
            onPlay={() => onPlay(recording.id)}
            onDownload={() => onDownload(recording.id)}
          />
        ))}
      </div>
    </div>
  )
}
