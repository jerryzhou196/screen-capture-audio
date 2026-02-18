"use client"

import { useAudioEngine } from "@/hooks/use-audio-engine"
import { RotaryDial } from "./rotary-dial"
import { WaveformDisplay } from "./waveform-display"
import { TapeReels } from "./tape-reels"
import { RecordingLED } from "./recording-led"
import { PlayerButton } from "./player-button"
import { CassetteSidebar } from "./cassette-sidebar"

export function TapePlayer() {
  const {
    state,
    startCapture,
    stopAll,
    setReverbMix,
    setBassGain,
    setBassEnabled,
    setSpeed,
    setPreservePitch,
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    setImpulse,
    downloadRecording,
    selectRecording,
  } = useAudioEngine()

  const handleStartCapture = async () => {
    try {
      await startCapture()
    } catch (err) {
      console.error(err)
    }
  }

  const audioActive = state.isCapturing || state.isPlayingBack
  const hasRecordings = state.recordings.length > 0
  const activeRecording = state.recordings.find((r) => r.id === state.activeRecordingId)

  return (
    <div className="flex items-start justify-center gap-6">
      {/* Main player chassis */}
      <div
        className="relative w-full max-w-[720px] rounded-2xl overflow-hidden shrink-0"
        style={{
          background: "linear-gradient(180deg, #2a2a32 0%, #1a1a22 40%, #161620 100%)",
          border: "1px solid #3a3a44",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.6), 0 2px 0 rgba(255,255,255,0.03) inset, 0 -1px 0 rgba(0,0,0,0.8)",
        }}
      >
        {/* Top bezel with brushed metal effect */}
        <div
          className="relative flex items-center justify-between px-6 py-4"
          style={{
            background: "linear-gradient(180deg, #333340, #2a2a35)",
            borderBottom: "1px solid #444",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Brand label */}
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-base font-bold tracking-[0.3em] uppercase"
              style={{ color: "#c8a050" }}
            >
              TAPELAB
            </span>
            <span
              className="font-mono text-[9px] tracking-[0.2em] uppercase"
              style={{ color: "#666" }}
            >
              PRO-1000
            </span>
          </div>

          {/* Recording LED on top right */}
          <RecordingLED isRecording={state.isRecording} />
        </div>

        {/* Tape reels section with glass window */}
        <div className="px-6 pt-5">
          <TapeReels
            isPlaying={state.isCapturing || state.isPlayingBack}
            isReversing={!state.isCapturing && !state.isPlayingBack && hasRecordings}
          />
        </div>

        {/* Waveform display */}
        <div className="px-6 pt-5">
          <WaveformDisplay
            waveformData={state.waveformData}
            isActive={state.isCapturing || state.isPlayingBack}
          />
        </div>

        {/* Dials section */}
        <div
          className="flex items-start justify-center gap-10 px-6 pt-6 pb-4"
          style={{
            borderTop: "1px solid #2a2a30",
          }}
        >
          <RotaryDial
            label="Reverb"
            value={state.reverbMix}
            min={0}
            max={1}
            step={0.01}
            onChange={setReverbMix}
            disabled={!audioActive}
            color="#e85d3a"
          />

          <div className="flex flex-col items-center gap-2">
            <RotaryDial
              label="Bass"
              value={state.bassGain}
              min={0}
              max={18}
              step={0.5}
              onChange={(v) => {
                setBassGain(v)
                if (!state.bassEnabled && v > 0) setBassEnabled(true)
              }}
              disabled={!audioActive}
              unit=" dB"
              color="#c8a050"
            />
            <button
              onClick={() => setBassEnabled(!state.bassEnabled)}
              disabled={!audioActive}
              className="font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm"
              style={{
                background: state.bassEnabled ? "#c8a050" : "transparent",
                color: state.bassEnabled ? "#111" : "#666",
                border: `1px solid ${state.bassEnabled ? "#c8a050" : "#444"}`,
                cursor: audioActive ? "pointer" : "not-allowed",
                opacity: audioActive ? 1 : 0.4,
                transition: "all 0.15s",
              }}
            >
              {state.bassEnabled ? "On" : "Off"}
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <RotaryDial
              label="Speed"
              value={state.speed}
              min={0.25}
              max={2}
              step={0.05}
              onChange={setSpeed}
              disabled={!state.isPlayingBack}
              unit="x"
              color="#50a0c8"
            />
            <button
              onClick={() => setPreservePitch(!state.preservePitch)}
              disabled={!state.isPlayingBack}
              className="font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm"
              style={{
                background: state.preservePitch ? "#50a0c8" : "transparent",
                color: state.preservePitch ? "#111" : "#666",
                border: `1px solid ${state.preservePitch ? "#50a0c8" : "#444"}`,
                cursor: state.isPlayingBack ? "pointer" : "not-allowed",
                opacity: state.isPlayingBack ? 1 : 0.4,
                transition: "all 0.15s",
              }}
            >
              Pitch Lock
            </button>
          </div>
        </div>

        {/* Impulse response selector */}
        <div className="flex items-center justify-center gap-2 px-6 py-2">
          <span
            className="font-mono text-[9px] uppercase tracking-[0.15em] mr-2"
            style={{ color: "#666" }}
          >
            IR:
          </span>
          <PlayerButton
            label="Small Room"
            onClick={() => setImpulse("small")}
            disabled={!audioActive}
          />
          <PlayerButton
            label="Large Hall"
            onClick={() => setImpulse("large")}
            disabled={!audioActive}
          />
        </div>

        {/* Transport controls */}
        <div
          className="flex items-center justify-center gap-3 px-6 py-5"
          style={{
            background: "linear-gradient(180deg, #1e1e26, #18181f)",
            borderTop: "1px solid #2a2a30",
          }}
        >
          {!state.isCapturing ? (
            <PlayerButton
              label="Capture Tab Audio"
              onClick={handleStartCapture}
              variant="accent"
              icon={
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
              }
            />
          ) : (
            <>
              <PlayerButton
                label="Stop"
                onClick={stopAll}
                icon={
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                  </svg>
                }
              />
              <PlayerButton
                label={state.isRecording ? "Stop Rec" : "Record"}
                onClick={state.isRecording ? stopRecording : startRecording}
                variant="record"
                active={state.isRecording}
                icon={
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                }
              />
            </>
          )}

          {activeRecording && !state.isPlayingBack && !state.isCapturing && (
            <PlayerButton
              label="Play Recording"
              onClick={() => playRecording(state.activeRecordingId ?? undefined)}
              variant="accent"
              icon={
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              }
            />
          )}

          {state.isPlayingBack && (
            <PlayerButton
              label="Stop Playback"
              onClick={stopPlayback}
              variant="accent"
              active
              icon={
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
              }
            />
          )}

          {/* Download button */}
          {activeRecording && (
            <PlayerButton
              label="Download"
              onClick={() => downloadRecording(state.activeRecordingId ?? undefined)}
              icon={
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              }
            />
          )}
        </div>

        {/* Bottom bezel with screws */}
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{
            background: "linear-gradient(180deg, #222230, #1a1a24)",
            borderTop: "1px solid #2a2a30",
          }}
        >
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 12,
                height: 12,
                background: "radial-gradient(circle at 35% 35%, #555, #333)",
                border: "1px solid #444",
                boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)",
              }}
            />
          ))}
          <span
            className="font-mono text-[9px] tracking-[0.1em]"
            style={{ color: "#444" }}
          >
            {state.isCapturing
              ? "CAPTURING..."
              : state.isPlayingBack
                ? "PLAYBACK"
                : hasRecordings
                  ? "READY"
                  : "IDLE"}
          </span>
          {[0, 1].map((i) => (
            <div
              key={i + 2}
              className="rounded-full"
              style={{
                width: 12,
                height: 12,
                background: "radial-gradient(circle at 35% 35%, #555, #333)",
                border: "1px solid #444",
                boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Cassette sidebar - slides in when recordings exist */}
      <CassetteSidebar
        recordings={state.recordings}
        activeRecordingId={state.activeRecordingId}
        isPlayingBack={state.isPlayingBack}
        onSelect={selectRecording}
        onPlay={(id) => playRecording(id)}
        onDownload={(id) => downloadRecording(id)}
      />
    </div>
  )
}
