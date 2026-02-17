"use client"

import { useState } from "react"

interface PlayerButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  active?: boolean
  variant?: "default" | "record" | "accent"
  icon?: React.ReactNode
}

export function PlayerButton({
  label,
  onClick,
  disabled = false,
  active = false,
  variant = "default",
  icon,
}: PlayerButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const bgColors = {
    default: active
      ? "linear-gradient(180deg, #3a3a42, #28282e)"
      : "linear-gradient(180deg, #2e2e36, #1e1e24)",
    record: active
      ? "linear-gradient(180deg, #5a1515, #3a0a0a)"
      : "linear-gradient(180deg, #3a1515, #2a0a0a)",
    accent: active
      ? "linear-gradient(180deg, #4a3820, #352818)"
      : "linear-gradient(180deg, #352818, #2a1e12)",
  }

  const borderColor = {
    default: active ? "#555" : "#444",
    record: active ? "#ff3030" : "#552020",
    accent: active ? "#8a6a30" : "#554420",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-[0.15em] select-none"
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? "linear-gradient(180deg, #222228, #1a1a1e)" : bgColors[variant],
        border: `1px solid ${disabled ? "#333" : borderColor[variant]}`,
        color: disabled ? "#444" : active ? "#ddd" : "#999",
        boxShadow: isPressed && !disabled
          ? "inset 0 2px 4px rgba(0,0,0,0.5)"
          : disabled
            ? "none"
            : "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        transform: isPressed && !disabled ? "translateY(1px)" : "none",
        transition: "all 0.1s",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {label}
    </button>
  )
}
