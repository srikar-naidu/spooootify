import { useState, useRef, useEffect, useCallback } from 'react'

export function usePlayer() {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [loadingAudio, setLoadingAudio] = useState(false)

  const audioRef = useRef(new Audio())

  useEffect(() => {
    audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)

    // Loop: when song ends, restart from beginning automatically
    const onEnded = () => {
      audio.currentTime = 0
      audio.play()
      setIsPlaying(true)
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.pause()
    }
  }, [])

  const playSong = useCallback(async (song) => {
    const audio = audioRef.current
    audio.pause()
    setCurrentSong(song)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setLoadingAudio(true)

    try {
      // Uses VITE_BACKEND_URL in production, empty string (proxy) in dev
      const backendUrl = import.meta.env.VITE_BACKEND_URL || ''
      const res = await fetch(`${backendUrl}/api/audio?id=${song.id}`)
      if (!res.ok) throw new Error('Backend error')
      const data = await res.json()

      audio.src = data.url
      audio.load()
      await audio.play()
      setIsPlaying(true)
    } catch (err) {
      console.error('Failed to load audio:', err)
    } finally {
      setLoadingAudio(false)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!currentSong) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }, [isPlaying, currentSong])

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [])

  return {
    currentSong, isPlaying, currentTime, duration,
    volume, setVolume, loadingAudio, playSong, togglePlay, seek
  }
}