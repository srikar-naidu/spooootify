const express = require('express')
const cors = require('cors')
const { execFile } = require('child_process')

const app = express()

// Allow all origins for Railway deployment
app.use(cors({
  origin: '*'
}))

app.get('/api/audio', (req, res) => {
  const videoId = req.query.id

  if (!videoId) {
    return res.status(400).json({ error: 'Missing video id' })
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`

  execFile('python', [
    '-m', 'yt_dlp',
    '-f', 'bestaudio',
    '--get-url',
    '-x',
    videoUrl
  ], (error, stdout, stderr) => {
    if (error) {
      console.error('yt-dlp error:', stderr)
      return res.status(500).json({ error: 'Failed to get audio URL' })
    }

    const audioUrl = stdout.trim()
    res.json({ url: audioUrl })
  })
})

// Dynamic port for Railway
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🎵 Backend running on port ${PORT}`)
})