const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 


app.get('/download', async (req, res) => {
  const videoURL = req.query.url;
  console.log('Received download request for:', videoURL);

  if (!ytdl.validateURL(videoURL)) {
    console.log('Invalid URL received');
    return res.status(400).send('Invalid YouTube URL');
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    console.log('Video title:', info.videoDetails.title);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
    ytdl(videoURL, { quality: 'highestvideo', filter: 'videoandaudio' })
      .on('error', (err) => {
        console.error('Stream error:', err.message);
        if (!res.headersSent) {
          res.status(500).send('Stream error: ' + err.message);
        }
      })
      .pipe(res);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).send('Error downloading video: ' + err.message);
  }
});


// Fallback to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(10000, () => {
  console.log(' YouTube Downloader running at http://localhost:5000');
});
