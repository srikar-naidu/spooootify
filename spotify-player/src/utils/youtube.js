import axios from 'axios'

// Your API key pulled from .env file
// VITE_ prefix is required for Vite to expose env vars to frontend
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

// Base URL for YouTube Data API v3
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

// Search YouTube for videos matching a query
// Returns array of video objects with id, title, artist, thumbnail
export async function searchSongs(query) {
  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      part: 'snippet',        // We want the snippet (title, thumbnail, etc)
      q: query + ' song',     // Append "song" to get better music results
      type: 'video',          // Only videos, not playlists or channels
      videoCategoryId: '10',  // Category 10 = Music on YouTube
      maxResults: 10,         // Show 10 results
      key: API_KEY
    }
  })

  // Transform the raw YouTube response into a simpler shape we need
  return response.data.items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    // channelTitle is usually the artist name for music videos
    artist: item.snippet.channelTitle,
    // mqdefault = medium quality thumbnail, always available
    thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url
  }))
}