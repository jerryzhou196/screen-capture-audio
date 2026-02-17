"use client"

interface RecordingLEDProps {
  isRecording: boolean
}

export function RecordingLED({ isRecording }: RecordingLEDProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative rounded-full"
        style={{
          width: 10,
          height: 10,
          background: isRecording ? "#ff2020" : "#3a1010",
          border: "1px solid #555",
          boxShadow: isRecording
            ? "0 0 8px #ff2020, 0 0 16px rgba(255, 32, 32, 0.4), inset 0 0 3px rgba(255,255,255,0.3)"
            : "inset 0 1px 2px rgba(0,0,0,0.5)",
          animation: isRecording ? "pulse-led 1s ease-in-out infinite" : "none",
        }}
      />
      <span
        className="text-[9px] font-mono uppercase tracking-[0.2em]"
        style={{ color: isRecording ? "#ff4040" : "#555" }}
      >
        REC
      </span>

      <style jsx>{`
        @keyframes pulse-led {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
