export default function TrackList({ results, onPlay, currentSong, isPlaying }) {
  if (results.length === 0) return null

  return (
    // No extra scroll wrapper here — parent div handles scrolling
    <div className="p-2 space-y-1">
      {results.map(song => {
        const isActive = currentSong?.id === song.id

        return (
          <div
            key={song.id}
            onClick={() => onPlay(song)}
            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer
                        transition-all duration-200 active:scale-[0.98]
                        ${isActive
                          ? 'bg-blue-500/40 border border-blue-300/50'
                          : 'hover:bg-white/20 border border-transparent'
                        }`}
          >
            <img
              src={song.thumbnail}
              alt={song.title}
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">
                {song.title}
              </p>
              <p className="text-blue-200 text-xs truncate">
                {song.artist}
              </p>
            </div>
            {isActive && isPlaying && (
              <span className="text-blue-300 text-xs shrink-0">▶</span>
            )}
          </div>
        )
      })}
    </div>
  )
}