import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlaylistTracks from '../PlaylistTracks/PlaylistTracks'; // Import the new component

const PLAYLIST_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';

const SpotifyGetPlaylists = () => {
  const [token, setToken] = useState('');
  const [data, setData] = useState({});
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      setToken(localStorage.getItem('accessToken'));
    }
  }, []);

  const handleGetPlaylists = () => {
    axios
      .get(PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGetTracks = async (playlistId) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      setSelectedPlaylistTracks(response.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button onClick={handleGetPlaylists}>Get Playlists</button>

      {data?.items ? (
        data.items.map((item) => (
          <div key={item.id}>
            <p>{item.name}</p>
            <button onClick={() => handleGetTracks(item.id)}>View Tracks</button>
          </div>
        ))
      ) : null}

      {/* Render the tracks of the selected playlist in the new container */}
      {selectedPlaylistTracks.length > 0 && <PlaylistTracks selectedPlaylistTracks={selectedPlaylistTracks} />}
    </>
  );
};

export default SpotifyGetPlaylists;
