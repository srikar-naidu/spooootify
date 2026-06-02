function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Player({
  song, isPlaying, currentTime, duration,
  volume, onToggle, onSeek, onVolumeChange, loading
}) {
  if (!song) return (
    <div className="w-full rounded-3xl bg-white/10 backdrop-blur-md
                    border border-white/20 p-8 text-center">
      <div className="text-5xl mb-3">🎵</div>
      <p className="text-white/60 text-xs tracking-widest uppercase">
        search a song to start playing
      </p>
    </div>
  )

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full rounded-3xl bg-white/10 backdrop-blur-xl
                    border border-white/20 shadow-2xl p-5">

      {/* Album art */}
      <div className="relative mb-4">
        <img
          src={song.thumbnail}
          alt={song.title}
          className={`w-full rounded-2xl shadow-xl object-cover
                      transition-all duration-700
                      ${isPlaying ? 'scale-[1.02] shadow-blue-500/30' : 'scale-100'}`}
          style={{ height: '200px' }}
        />
        {isPlaying && (
          <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-400/50 animate-pulse" />
        )}

        {/* Loop indicator badge */}
        <div className="absolute bottom-2 right-2 bg-blue-500/80 backdrop-blur-sm
                        text-white text-xs px-2 py-1 rounded-lg font-bold tracking-wider">
          🔁 LOOP
        </div>
      </div>

      {/* Song info */}
      <div className="text-center mb-4">
        <p className="text-white font-bold text-xs leading-tight line-clamp-1 tracking-wide">
          {song.title}
        </p>
        <p className="text-blue-300 text-xs mt-1 tracking-widest">
          {song.artist}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          step={0.1}
          onChange={e => onSeek(parseFloat(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${progress}%, rgba(255,255,255,0.2) ${progress}%)`
          }}
        />
        <div className="flex justify-between text-xs text-blue-300 font-bold mt-1 tracking-wider">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Play/Pause */}
      <div className="flex justify-center mb-4">
        <button
          onClick={onToggle}
          disabled={loading}
          className="w-14 h-14 rounded-full
                     bg-blue-500 hover:bg-blue-400
                     text-white text-2xl
                     shadow-lg shadow-blue-500/40
                     transition-all duration-200
                     disabled:opacity-50 active:scale-90
                     flex items-center justify-center"
        >
          {loading ? '⏳' : isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-white/60">🔈</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={e => onVolumeChange(parseFloat(e.target.value))}
          className="flex-1"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%)`
          }}
        />
        <span className="text-sm text-white/60">🔊</span>
      </div>
    </div>
  )
}