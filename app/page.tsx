"use client"

import { useState, useEffect } from "react"
import { TapePlayer } from "@/components/player/tape-player"
import { OnboardingOverlay } from "@/components/player/onboarding-overlay"

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Only show onboarding on first visit
    const seen = sessionStorage.getItem("onboarding-seen")
    if (!seen) {
      setShowOnboarding(true)
    }
  }, [])

  const handleDismissOnboarding = () => {
    setShowOnboarding(false)
    sessionStorage.setItem("onboarding-seen", "1")
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 animate-fade-in"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #1e1e2a 0%, #0e0e14 60%, #08080c 100%)",
      }}
    >
      {showOnboarding && <OnboardingOverlay onDismiss={handleDismissOnboarding} />}

      <TapePlayer />
    </main>
  )
}
