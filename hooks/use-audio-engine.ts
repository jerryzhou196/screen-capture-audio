"use client"

import { useCallback, useRef, useState } from "react"

export type Recording = {
  id: string
  blobUrl: string
  name: string
  createdAt: number
}

export type AudioEngineState = {
  isCapturing: boolean
  isRecording: boolean
  isPlayingBack: boolean
  reverbMix: number
  bassGain: number
  bassEnabled: boolean
  speed: number
  preservePitch: boolean
  waveformData: Float32Array | null
  recordings: Recording[]
  activeRecordingId: string | null
}

export function useAudioEngine() {
  const [state, setState] = useState<AudioEngineState>({
    isCapturing: false,
    isRecording: false,
    isPlayingBack: false,
    reverbMix: 0.35,
    bassGain: 8,
    bassEnabled: false,
    speed: 1,
    preservePitch: true,
    waveformData: null,
    recordings: [],
    activeRecordingId: null,
  })

  const acRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const srcNodeRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const convolverRef = useRef<ConvolverNode | null>(null)
  const dryGainRef = useRef<GainNode | null>(null)
  const wetGainRef = useRef<GainNode | null>(null)
  const bassFilterDryRef = useRef<BiquadFilterNode | null>(null)
  const bassFilterWetRef = useRef<BiquadFilterNode | null>(null)
  const outGainRef = useRef<GainNode | null>(null)
  const destRef = useRef<MediaStreamAudioDestinationNode | null>(null)
  const monitorRef = useRef<HTMLAudioElement | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animFrameRef = useRef<number>(0)
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null)

  // Store current state values in refs so playback graph can read them
  const reverbMixRef = useRef(0.35)
  const bassGainValRef = useRef(8)
  const bassEnabledRef = useRef(false)

  function makeImpulseResponse(ac: AudioContext, seconds: number, decay: number) {
    const rate = ac.sampleRate
    const length = Math.floor(rate * seconds)
    const ir = ac.createBuffer(2, length, rate)
    for (let ch = 0; ch < ir.numberOfChannels; ch++) {
      const data = ir.getChannelData(ch)
      for (let i = 0; i < length; i++) {
        const t = i / length
        const env = Math.pow(1 - t, decay)
        data[i] = (Math.random() * 2 - 1) * env
      }
    }
    return ir
  }

  function makeBassFilter(ac: AudioContext) {
    const f = ac.createBiquadFilter()
    f.type = "lowshelf"
    f.frequency.value = 120
    f.Q.value = 0.707
    f.gain.value = 0
    return f
  }

  const updateWaveform = useCallback(() => {
    const analyser = analyserRef.current
    if (!analyser) return
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Float32Array(bufferLength)
    analyser.getFloatTimeDomainData(dataArray)
    setState((prev) => ({ ...prev, waveformData: new Float32Array(dataArray) }))
    animFrameRef.current = requestAnimationFrame(updateWaveform)
  }, [])

  const startCapture = useCallback(async () => {
    const ac = new AudioContext()
    acRef.current = ac

    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        suppressLocalAudioPlayback: true,
      },
    })

    for (const t of mediaStream.getVideoTracks()) t.stop()

    const audioTracks = mediaStream.getAudioTracks()
    if (!audioTracks.length) {
      throw new Error("No audio track captured. Re-try and ensure 'Share tab audio' is enabled.")
    }

    mediaStreamRef.current = mediaStream
    const srcNode = ac.createMediaStreamSource(mediaStream)
    srcNodeRef.current = srcNode

    // Build audio graph
    const convolver = ac.createConvolver()
    const dryGain = ac.createGain()
    const wetGain = ac.createGain()
    const outGain = ac.createGain()
    outGain.gain.value = 0.85

    convolver.buffer = makeImpulseResponse(ac, 1.6, 2.2)

    const bassFilterDry = makeBassFilter(ac)
    const bassFilterWet = makeBassFilter(ac)

    const analyser = ac.createAnalyser()
    analyser.fftSize = 2048

    srcNode.connect(dryGain)
    srcNode.connect(convolver)
    convolver.connect(wetGain)
    dryGain.connect(bassFilterDry)
    wetGain.connect(bassFilterWet)
    bassFilterDry.connect(outGain)
    bassFilterWet.connect(outGain)
    outGain.connect(analyser)

    const dest = ac.createMediaStreamDestination()
    outGain.connect(dest)

    convolverRef.current = convolver
    dryGainRef.current = dryGain
    wetGainRef.current = wetGain
    bassFilterDryRef.current = bassFilterDry
    bassFilterWetRef.current = bassFilterWet
    outGainRef.current = outGain
    destRef.current = dest
    analyserRef.current = analyser

    const monitor = new Audio()
    monitor.srcObject = dest.stream
    monitor.play().catch(() => {})
    monitorRef.current = monitor

    // Apply initial state
    const wet = reverbMixRef.current
    dryGain.gain.value = 1 - wet
    wetGain.gain.value = wet

    const effectiveBass = bassEnabledRef.current ? bassGainValRef.current : 0
    bassFilterDry.gain.value = effectiveBass
    bassFilterWet.gain.value = effectiveBass

    audioTracks[0].addEventListener("ended", () => {
      stopAll()
    })

    setState((prev) => ({ ...prev, isCapturing: true }))
    updateWaveform()
  }, [updateWaveform])

  const stopAll = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current)

    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop()
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop())
      mediaStreamRef.current = null
    }

    if (monitorRef.current) {
      monitorRef.current.pause()
      monitorRef.current.srcObject = null
      monitorRef.current = null
    }

    if (acRef.current) {
      acRef.current.close().catch(() => {})
      acRef.current = null
    }

    srcNodeRef.current = null
    convolverRef.current = null
    dryGainRef.current = null
    wetGainRef.current = null
    bassFilterDryRef.current = null
    bassFilterWetRef.current = null
    outGainRef.current = null
    destRef.current = null
    analyserRef.current = null

    setState((prev) => ({
      ...prev,
      isCapturing: false,
      isRecording: false,
      waveformData: null,
    }))
  }, [])

  const setReverbMix = useCallback((value: number) => {
    reverbMixRef.current = value
    if (dryGainRef.current) dryGainRef.current.gain.value = 1 - value
    if (wetGainRef.current) wetGainRef.current.gain.value = value
    setState((prev) => ({ ...prev, reverbMix: value }))
  }, [])

  const setBassGain = useCallback((value: number) => {
    bassGainValRef.current = value
    setState((prev) => {
      const effective = prev.bassEnabled ? value : 0
      if (bassFilterDryRef.current) bassFilterDryRef.current.gain.value = effective
      if (bassFilterWetRef.current) bassFilterWetRef.current.gain.value = effective
      return { ...prev, bassGain: value }
    })
  }, [])

  const setBassEnabled = useCallback((enabled: boolean) => {
    bassEnabledRef.current = enabled
    setState((prev) => {
      const effective = enabled ? prev.bassGain : 0
      if (bassFilterDryRef.current) bassFilterDryRef.current.gain.value = effective
      if (bassFilterWetRef.current) bassFilterWetRef.current.gain.value = effective
      return { ...prev, bassEnabled: enabled }
    })
  }, [])

  const setSpeed = useCallback((value: number) => {
    if (playbackAudioRef.current) {
      playbackAudioRef.current.playbackRate = value
    }
    setState((prev) => ({ ...prev, speed: value }))
  }, [])

  const setPreservePitch = useCallback((value: boolean) => {
    if (playbackAudioRef.current) {
      playbackAudioRef.current.preservesPitch = value
    }
    setState((prev) => ({ ...prev, preservePitch: value }))
  }, [])

  const startRecording = useCallback(() => {
    const dest = destRef.current
    if (!dest) return

    chunksRef.current = []

    const mimeCandidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/ogg",
    ]

    let mimeType = ""
    for (const m of mimeCandidates) {
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) {
        mimeType = m
        break
      }
    }

    const recorder = new MediaRecorder(dest.stream, mimeType ? { mimeType } : undefined)

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" })
      const url = URL.createObjectURL(blob)
      const newRecording: Recording = {
        id: crypto.randomUUID(),
        blobUrl: url,
        name: `Recording ${Date.now()}`,
        createdAt: Date.now(),
      }
      setState((prev) => ({
        ...prev,
        isRecording: false,
        recordings: [...prev.recordings, newRecording],
        activeRecordingId: newRecording.id,
      }))
    }

    recorder.start()
    recorderRef.current = recorder
    setState((prev) => ({ ...prev, isRecording: true }))
  }, [])

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop()
    }
  }, [])

  const playRecording = useCallback((recordingId?: string) => {
    const targetId = recordingId || state.activeRecordingId
    const recording = state.recordings.find((r) => r.id === targetId)
    if (!recording) return

    // Stop capture if still running
    if (state.isCapturing) {
      stopAll()
    }

    // Stop any current playback
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause()
      playbackAudioRef.current = null
    }
    if (acRef.current) {
      acRef.current.close().catch(() => {})
      acRef.current = null
    }
    cancelAnimationFrame(animFrameRef.current)

    const audio = new Audio(recording.blobUrl)
    audio.playbackRate = state.speed
    audio.preservesPitch = state.preservePitch
    playbackAudioRef.current = audio

    // Create a full audio graph for playback with reverb + bass
    const ac = new AudioContext()
    acRef.current = ac
    const source = ac.createMediaElementSource(audio)

    // Build the same convolver + bass filter graph
    const convolver = ac.createConvolver()
    const dryGain = ac.createGain()
    const wetGain = ac.createGain()
    const outGain = ac.createGain()
    outGain.gain.value = 0.85

    convolver.buffer = makeImpulseResponse(ac, 1.6, 2.2)

    const bassFilterDry = makeBassFilter(ac)
    const bassFilterWet = makeBassFilter(ac)

    const analyser = ac.createAnalyser()
    analyser.fftSize = 2048

    // Wire the graph: source -> dry/wet split -> bass filters -> outGain -> analyser -> destination
    source.connect(dryGain)
    source.connect(convolver)
    convolver.connect(wetGain)
    dryGain.connect(bassFilterDry)
    wetGain.connect(bassFilterWet)
    bassFilterDry.connect(outGain)
    bassFilterWet.connect(outGain)
    outGain.connect(analyser)
    analyser.connect(ac.destination)

    // Store refs so dials work during playback
    convolverRef.current = convolver
    dryGainRef.current = dryGain
    wetGainRef.current = wetGain
    bassFilterDryRef.current = bassFilterDry
    bassFilterWetRef.current = bassFilterWet
    outGainRef.current = outGain
    analyserRef.current = analyser

    // Apply current reverb/bass state to the playback graph
    const wet = reverbMixRef.current
    dryGain.gain.value = 1 - wet
    wetGain.gain.value = wet
    const effectiveBass = bassEnabledRef.current ? bassGainValRef.current : 0
    bassFilterDry.gain.value = effectiveBass
    bassFilterWet.gain.value = effectiveBass

    audio.play()
    setState((prev) => ({ ...prev, isPlayingBack: true, activeRecordingId: recording.id }))

    const updateWaveformPlayback = () => {
      if (!analyserRef.current) return
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Float32Array(bufferLength)
      analyserRef.current.getFloatTimeDomainData(dataArray)
      setState((prev) => ({ ...prev, waveformData: new Float32Array(dataArray) }))
      animFrameRef.current = requestAnimationFrame(updateWaveformPlayback)
    }
    updateWaveformPlayback()

    audio.onended = () => {
      cancelAnimationFrame(animFrameRef.current)
      if (ac) ac.close().catch(() => {})
      acRef.current = null
      analyserRef.current = null
      convolverRef.current = null
      dryGainRef.current = null
      wetGainRef.current = null
      bassFilterDryRef.current = null
      bassFilterWetRef.current = null
      outGainRef.current = null
      playbackAudioRef.current = null
      setState((prev) => ({ ...prev, isPlayingBack: false, waveformData: null }))
    }
  }, [state.recordings, state.activeRecordingId, state.isCapturing, state.speed, state.preservePitch, stopAll])

  const stopPlayback = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current)
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause()
      playbackAudioRef.current = null
    }
    if (acRef.current) {
      acRef.current.close().catch(() => {})
      acRef.current = null
    }
    analyserRef.current = null
    convolverRef.current = null
    dryGainRef.current = null
    wetGainRef.current = null
    bassFilterDryRef.current = null
    bassFilterWetRef.current = null
    outGainRef.current = null
    setState((prev) => ({ ...prev, isPlayingBack: false, waveformData: null }))
  }, [])

  const setImpulse = useCallback((type: "small" | "large") => {
    const ac = acRef.current
    const convolver = convolverRef.current
    if (!ac || !convolver) return
    if (type === "small") {
      convolver.buffer = makeImpulseResponse(ac, 1.0, 2.0)
    } else {
      convolver.buffer = makeImpulseResponse(ac, 3.2, 3.5)
    }
  }, [])

  const downloadRecording = useCallback((recordingId?: string) => {
    const targetId = recordingId || state.activeRecordingId
    const recording = state.recordings.find((r) => r.id === targetId)
    if (!recording) return
    const a = document.createElement("a")
    a.href = recording.blobUrl
    a.download = `slowedrvb-${recording.id.slice(0, 8)}.webm`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }, [state.recordings, state.activeRecordingId])

  const selectRecording = useCallback((recordingId: string) => {
    setState((prev) => ({ ...prev, activeRecordingId: recordingId }))
  }, [])

  return {
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
  }
}
