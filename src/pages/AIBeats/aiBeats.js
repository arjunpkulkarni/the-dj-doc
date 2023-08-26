import React, { useState, useEffect } from "react";
import "./aiBeats.css";
import axios from "axios";

const CLIENT_ID = "ee3d1fd364864c578a8925749a35227a";
const REDIRECT_URI = "http://localhost:3000/AiBeats"; // Replace with your redirect URI
const SCOPES = ["user-read-private", "user-read-email"]; // Add more scopes if needed
const SCOPES_URL_PARAM = SCOPES.join("%20");
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

const apiEndpoint = 'https://nn84xvqiji.execute-api.us-east-1.amazonaws.com/Mixmeister/api-mixmeister';
const apiKey = 'y0r75sXT5F9KpMz5V7VV6aQfyTEkWiWK5gzB339q';
const token = 'YOUR_AUTHORIZATION_TOKEN'; // Make sure you have a valid token

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
        const selectedFeaturesArray = [
          audioFeatures.acousticness,
          audioFeatures.danceability,
          audioFeatures.energy,
          audioFeatures.instrumentalness,
          audioFeatures.loudness,
          audioFeatures.speechiness,
          audioFeatures.tempo,
          audioFeatures.valence
        ];

        const formattedArray = { data : selectedFeaturesArray }
        
  
        console.log("Audio Features:", selectedFeaturesArray);
  
        try {
          const aiModelResponse = await axios.post(apiEndpoint, formattedArray, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${token}`,
              "X-Api-Key": apiKey,
              'Content-Type': 'application/json',
            },
          });
        
          const responseBody = JSON.parse(aiModelResponse.data.body);
          const mixingScore = responseBody.mixing_score;
          
          console.log("Mixing Score:", mixingScore);

        } catch (error) {
          console.error("Axios Error:", error);
        }
        

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
