import React, { useState, useEffect } from "react";
import "./aiBeats.css";
import axios from "axios";
//@ts-ignore
import * as Realm from "realm-web";

const CLIENT_ID = "ee3d1fd364864c578a8925749a35227a";
const REDIRECT_URI = "http://localhost:3000/AiBeats"; // Replace with your redirect URI
const SCOPES = ["user-read-private", "user-read-email"]; // Add more scopes if needed
const SCOPES_URL_PARAM = SCOPES.join("%20");
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

const apiEndpoint = 'https://nn84xvqiji.execute-api.us-east-1.amazonaws.com/Mixmeister/api-mixmeister';
const apiKey = 'y0r75sXT5F9KpMz5V7VV6aQfyTEkWiWK5gzB339q';

const AiBeats = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("Pop");
  const [result, setResult] = useState(null); // State to store the result
  const [showSearch, setShowSearch] = useState(true); // State to toggle between search and result

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
  
      const trackResponse = await axios.get(
        `https://api.spotify.com/v1/tracks/${track.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
  
      if (response.data) {
        const audioFeatures = response.data;
        // Return the year of the track
        const releaseDate = trackResponse.data.album.release_date;
        const year = parseInt(releaseDate.split('-')[0], 10); // Ensure year is an integer
  
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
  
        const formattedArray = { data: selectedFeaturesArray };
  
        console.log("Audio Features:", selectedFeaturesArray);
  
        try {
          const aiModelResponse = await axios.post(apiEndpoint, formattedArray, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "X-Api-Key": apiKey,
              'Content-Type': 'application/json',
            },
          });
  
          const responseBody = JSON.parse(aiModelResponse.data.body);
          const mixingScore = parseFloat(responseBody.mixing_score); // Ensure mixingScore is a double
  
          console.log("Mixing Score:", mixingScore);
  
          const app = new Realm.App({ id: "mixmeister-onfrh" });
  
          // Create an anonymous credential
          const credentials = Realm.Credentials.anonymous();
  
          // Authenticate the user
          const user = await app.logIn(credentials);
          // `App.currentUser` updates to match the logged-in user
          console.assert(user.id === app.currentUser.id);
  
          // Ensure selectedGenre is a string
          if (typeof selectedGenre === "string") {
            const result = await user.functions.getTheSong(mixingScore, year, selectedGenre);
            console.log("Result:", JSON.stringify(result));
  
            if (Array.isArray(result)) {
              console.log("Received song names:", result); // Log the parsed result
              setResult(result); // Set the result in state
              setShowSearch(false); // Hide the search input
            } else {
              console.log("Received result is not an array:", result);
            }
          } else {
            console.error("Invalid genre type.");
          }
        } catch (error) {
          console.error("Axios Error:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching audio features:", error);
    }
  };

  const handleBackToSearch = () => {
    console.log("Going back to search...");
    setShowSearch(true); // Toggle to display the search input
    setResult(null); // Clear the result
  };
  
  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };


return (
  <div>
    <h1>MixMeister</h1>
    {loggedIn ? (
      <div>
        {showSearch ? ( // Conditionally render based on showSearch state
          <div>
            <div className="input-container">
              <input
                type="text"
                placeholder="Search songs..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <label htmlFor="genre">Pick a Genre:</label>
            <select
              id="genre"
              name="genre"
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
            <option value="Pop">Pop</option>
            <option value="Rap">Rap</option>
            <option value="Underground Rap">Underground Rap</option>
            <option value="Hiphop">Hiphop</option>
            <option value="Techno">Techno</option>
            <option value="RnB">RnB</option>
            <option value="Dark Trap">Dark Trap</option>
            <option value="Techno">Techno</option>
            <option value="Emo">Emo</option>
            </select>

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
          // Display result and back button
          <div>
            <button onClick={handleBackToSearch}>Back to Search</button>
            <p>Result:</p>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
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
