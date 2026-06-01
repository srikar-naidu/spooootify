import { useState, useRef, useEffect, useCallback } from 'react'

export function usePlayer() {
  // The currently selected song object { id, title, artist, thumbnail }
  const [currentSong, setCurrentSong] = useState(null)
  // True when audio is actively playing
  const [isPlaying, setIsPlaying] = useState(false)
  // Current playback position in seconds
  const [currentTime, setCurrentTime] = useState(0)
  // Total song duration in seconds
  const [duration, setDuration] = useState(0)
  // Volume 0-1
  const [volume, setVolume] = useState(0.8)
  // True while fetching audio URL from backend
  const [loadingAudio, setLoadingAudio] = useState(false)

  // useRef holds the actual <audio> DOM element across renders
  // Changes to ref don't trigger re-renders (unlike useState)
  const audioRef = useRef(new Audio())

  // When volume state changes, update the actual audio element
  useEffect(() => {
    audioRef.current.volume = volume
  }, [volume])

  // Set up audio event listeners once on mount
  useEffect(() => {
    const audio = audioRef.current

    // timeupdate fires ~4x per second while playing — update progress bar
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    // loadedmetadata fires when audio info (duration) is available
    const onLoadedMetadata = () => setDuration(audio.duration)
    // ended fires when song finishes
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    // Cleanup: remove listeners when component unmounts
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.pause()
    }
  }, [])

  // Called when user clicks a song in the list
  const playSong = useCallback(async (song) => {
    const audio = audioRef.current
    audio.pause()
    setCurrentSong(song)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setLoadingAudio(true)

    try {
      // Ask our backend: "give me the audio URL for this YouTube video ID"
      const res = await fetch(`/api/audio?id=${song.id}`)
      if (!res.ok) throw new Error('Backend error')
      const data = await res.json()

      // Point the audio element at the direct stream URL
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

  // Toggle play/pause for current song
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

  // Called when user drags the progress bar
  const seek = useCallback((time) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [])

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    loadingAudio,
    playSong,
    togglePlay,
    seek
  }
}