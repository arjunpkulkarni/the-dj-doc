import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; // Import the 'file-saver' library

const PlaylistTracks = ({ selectedPlaylistTracks }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);

    const zip = new JSZip();

    // Function to fetch the song file and add it to the zip
    const fetchAndAddToZip = async (track) => {
      try {
        const response = await fetch(track.track.preview_url);
        const blob = await response.blob();
        const trackName = track.track.name;
        zip.file(`${trackName}.mp3`, blob);
      } catch (error) {
        console.error('Error fetching song file:', error);
      }
    };

    // Fetch all songs and add them to the zip
    const fetchAllSongs = async () => {
      await Promise.all(selectedPlaylistTracks.map(fetchAndAddToZip));

      // Generate the zip and initiate the download
      zip.generateAsync({ type: 'blob' }).then((content) => {
        setIsDownloading(false);
        saveAs(content, 'playlist_tracks.zip'); // Save the zip file with a name 'playlist_tracks.zip'
      });
    };

    fetchAllSongs();
  };

  // Placeholder message when no tracks are selected
  if (!selectedPlaylistTracks || selectedPlaylistTracks.length === 0) {
    return <div className="playlist-tracks-container">No tracks selected.</div>;
  }

  return (
    <div className="playlist-tracks-container">
      <h3>Tracks of Selected Playlist:</h3>
      <ul>
        {selectedPlaylistTracks.map((track) => (
          <li key={track.track.id}>{track.track.name}</li>
        ))}
      </ul>
      <button onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? 'Downloading...' : 'Download All Songs as ZIP'}
      </button>
    </div>
  );
};

export default PlaylistTracks;
