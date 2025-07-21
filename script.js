function downloadVideo() {
  const urlInput = document.getElementById('videoUrl');
  const status = document.getElementById('status');
  const videoUrl = urlInput.value.trim();

  if (!videoUrl) {
    alert('Please enter a YouTube URL');
    return;
  }

  status.textContent = 'Starting download...';

  // Redirect to backend /download route
  window.location.href = `/download?url=${encodeURIComponent(videoUrl)}`;
}
