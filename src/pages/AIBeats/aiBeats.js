import React, { useState, useEffect } from "react";
import "./aiBeats.css";
import axios from "axios";

const CLIENT_ID = "ee3d1fd364864c578a8925749a35227a";
const REDIRECT_URI = "http://localhost:3000/AiBeats"; // Replace with your redirect URI
const SCOPES = ["user-read-private", "user-read-email"]; // Add more scopes if needed
const SCOPES_URL_PARAM = SCOPES.join("%20");
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

const AiBeats = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        setLoggedIn(true);
      }
      window.location.hash = "";
    }
  }, []);

  const handleSearch = async (event) => {
    const query = event.target.value;

    setSearchTerm(query);

    if (query) {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            query
          )}&type=track`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.tracks.items);
        }
      } catch (error) {
        console.error("Error fetching data from Spotify:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleTrackSelection = async (track) => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/audio-features/${track.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data) {
        const audioFeatures = response.data;

         // Extract the desired features
      const selectedFeatures = {
        acousticness: audioFeatures.acousticness,
        danceability: audioFeatures.danceability,
        energy: audioFeatures.energy,
        instrumentalness: audioFeatures.instrumentalness,
        loudness: audioFeatures.loudness,
        speechiness: audioFeatures.speechiness,
        tempo: audioFeatures.tempo,
        valence: audioFeatures.valence,
      };

      console.log("Audio Features:", selectedFeatures);

        // Now you can pass the audioFeatures to your AI model hosted on AWS
        const aiModelResponse = await axios.post(
          "https://runtime.sagemaker.us-east-1.amazonaws.com/endpoints/Custom-SKLearn-Model-2023-08-14-05-07-10/invocations",
          selectedFeatures
        );

        console.log("AI Model Response:", aiModelResponse.data);
      }
    } catch (error) {
      console.error("Error fetching audio features:", error);
    }
  };

  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };

  return (
    <div>
      <h1>MixMeister</h1>
      {loggedIn ? (
        <div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Search songs..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <ul>
            {searchResults.map((track) => (
              <li key={track.id}>
                <button onClick={() => handleTrackSelection(track)}>
                  {track.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="button-container">
          <p>Please log in to Spotify:</p>
          <button onClick={handleLogin}>Log in</button>
        </div>
      )}
    </div>
  );
};

export default AiBeats;
