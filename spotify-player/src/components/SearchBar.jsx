export default function SearchBar({ query, setQuery, onSearch, loading }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter') onSearch(query)
  }

  return (
    <div className="flex gap-2 w-full">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 text-base">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a song..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl
                     bg-white/15 backdrop-blur-md
                     border border-white/30
                     text-white placeholder-blue-200
                     focus:outline-none focus:border-blue-300 focus:bg-white/20
                     text-sm font-semibold
                     transition-all duration-200"
        />
      </div>
      <button
        onClick={() => onSearch(query)}
        disabled={loading}
        className="px-5 py-3 rounded-2xl
                   bg-blue-500 hover:bg-blue-400
                   text-white font-bold text-sm
                   shadow-lg transition-all duration-200
                   disabled:opacity-50 active:scale-95"
      >
        {loading ? '...' : 'Go'}
      </button>
    </div>
  )
}