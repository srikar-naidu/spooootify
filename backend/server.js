const express = require('express')
const cors = require('cors')
const { execFile } = require('child_process')

const app = express()
// Allow requests from your Vite dev server (port 5173)
app.use(cors())

app.get('/api/audio', (req, res) => {
  const videoId = req.query.id

  if (!videoId) {
    return res.status(400).json({ error: 'Missing video id' })
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`

  // Run yt-dlp to extract the best audio-only stream URL
  // -f bestaudio: pick best audio quality
  // --get-url: just print the URL, don't download
  // -x: extract audio only
  execFile('yt-dlp.exe', [
    '-f', 'bestaudio',
    '--get-url',
    '-x',
    videoUrl
  ], (error, stdout, stderr) => {
    if (error) {
      console.error('yt-dlp error:', stderr)
      return res.status(500).json({ error: 'Failed to get audio URL' })
    }

    // stdout contains the URL — trim whitespace/newlines
    const audioUrl = stdout.trim()
    res.json({ url: audioUrl })
  })
})

// Start server on port 3001
app.listen(3001, () => {
  console.log('🎵 Backend running on http://localhost:3001')
})