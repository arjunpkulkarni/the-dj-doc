import React from 'react';

const PlaylistTracks = ({ selectedPlaylistTracks }) => {
  return (
    <div>
      <h3>Tracks of Selected Playlist:</h3>
      <ul>
        {selectedPlaylistTracks.map((track) => (
          <li key={track.track.id}>{track.track.name}</li>
        ))}
      </ul>
      {/* Add any additional functionality or buttons related to the tracks here */}
    </div>
  );
};

export default PlaylistTracks;
