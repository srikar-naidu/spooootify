import { useState } from 'react'
import SearchBar from './components/SearchBar'
import TrackList from './components/TrackList'
import Player from './components/Player'
import { useSearch } from './hooks/useSearch'
import { usePlayer } from './hooks/usePlayer'

export default function App() {
  const { query, setQuery, results, loading, error, search, clearResults } = useSearch()
  const {
    currentSong, isPlaying, currentTime, duration,
    volume, setVolume, loadingAudio, playSong, togglePlay, seek
  } = usePlayer()

  function handlePlay(song) {
    playSong(song)
    // Close the dropdown after selecting a song
    clearResults()
  }

  return (
    // Full screen, no scroll, background image
    <div
      className="h-screen w-screen overflow-hidden flex flex-col items-center justify-between py-6 px-4"
      style={{
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay so text is readable over background */}
      <div className="absolute inset-0 bg-indigo-950/30 backdrop-blur-[2px]" />

      {/* Everything sits above the overlay */}
      <div className="relative z-10 w-full flex flex-col items-center h-full">

        {/* Header */}
        <div className="text-center mb-4 shrink-0">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-wide">
            SPOOOOTIFY
          </h1>
          <p className="text-blue-200 text-xs mt-1 font-semibold tracking-widest uppercase">
            search & play anything
          </p>
        </div>

        {/* Search area — results float as overlay */}
        <div className="relative w-full max-w-sm shrink-0">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={search}
            loading={loading}
          />

          {error && (
            <p className="mt-2 text-red-300 text-xs font-semibold bg-red-900/40
                          px-4 py-2 rounded-xl border border-red-400/30">
              {error}
            </p>
          )}

          {/* Floating dropdown — overlays everything below */}
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50
                            bg-white/10 backdrop-blur-xl rounded-2xl
                            border border-white/20 shadow-2xl
                            overflow-y-auto results-scroll"
                 style={{ maxHeight: '260px' }}>
              <TrackList
                results={results}
                onPlay={handlePlay}
                currentSong={currentSong}
                isPlaying={isPlaying}
              />
            </div>
          )}
        </div>

        {/* Player — takes up remaining space, centered */}
        <div className="flex-1 w-full flex items-center justify-center mt-4">
          <div className="w-full max-w-sm" style={{ maxHeight: '75vh' }}>
            <Player
              song={currentSong}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              onToggle={togglePlay}
              onSeek={seek}
              onVolumeChange={setVolume}
              loading={loadingAudio}
            />
          </div>
        </div>

      </div>
    </div>
  )
}