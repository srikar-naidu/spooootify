import { useState, useCallback } from 'react'
import { searchSongs } from '../utils/youtube'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return
    setLoading(true)
    setError(null)
    try {
      const songs = await searchSongs(searchQuery)
      setResults(songs)
    } catch (err) {
      setError('Search failed. Check your API key or internet connection.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // New — clears results so dropdown closes
  const clearResults = useCallback(() => {
    setResults([])
  }, [])

  return { query, setQuery, results, loading, error, search, clearResults }
}