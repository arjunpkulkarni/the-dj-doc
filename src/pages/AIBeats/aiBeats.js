import React, { useState, useEffect } from "react";
import "./aiBeats.css";
import axios from "axios";
import * as Realm from "realm-web";

const CLIENT_ID = "ee3d1fd364864c578a8925749a35227a";
const REDIRECT_URI = "http://localhost:3000/AiBeats"; // Replace with your redirect URI
const SCOPES = ["user-read-private", "user-read-email"]; // Add more scopes if needed
const SCOPES_URL_PARAM = SCOPES.join("%20");
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

const apiEndpoint =
  "https://nn84xvqiji.execute-api.us-east-1.amazonaws.com/Mixmeister/api-mixmeister";
const apiKey = "y0r75sXT5F9KpMz5V7VV6aQfyTEkWiWK5gzB339q";

const AiBeats = () => {
  const getGenre = () => {
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    const genres = ["Pop", "Rap", "Techno", "Emo"]; // Make sure genre names match the options in your select input
    const numGenres = getRandomInt(genres.length) + 1; // Ensure at least one genre is selected

    const selectedGenres = [];

    for (let i = 0; i < numGenres; i++) {
      const randomIndex = getRandomInt(genres.length);
      selectedGenres.push(genres[randomIndex]);
    }

    return selectedGenres.join(" "); // Join selected genres into a single string
  };

  const preprocessResult = (result) => {
    // Remove empty strings, square brackets, and duplicates
    const processedResult = result.filter((item, index, self) => {
      return (
        item.trim() !== "" &&
        item.trim() !== "[]" &&
        self.indexOf(item) === index
      );
    });

    // Number the items
    const numberedResult = processedResult.map((item, index) => {
      return `${index + 1}. ${item}`;
    });

    return numberedResult;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(getGenre());
  const [result, setResult] = useState(null); // State to store the result
  const [showSearch, setShowSearch] = useState(true); // State to toggle between search and result
  const [showRelatedArtists, setShowRelatedArtists] = useState(false);
  const [randomArtists, setRandomArtists] = useState([]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [albumSongs, setAlbumSongs] = useState([]);
  const [selectedAlbumTracks, setSelectedAlbumTracks] = useState([]);

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
    console.log("handleTrackSelection called with track:", track);

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
        const year = parseInt(releaseDate.split("-")[0], 10); // Ensure year is an integer

        // Extract the desired features
        const selectedFeaturesArray = [
          audioFeatures.acousticness,
          audioFeatures.danceability,
          audioFeatures.energy,
          audioFeatures.instrumentalness,
          audioFeatures.loudness,
          audioFeatures.speechiness,
          audioFeatures.tempo,
          audioFeatures.valence,
        ];

        const formattedArray = { data: selectedFeaturesArray };

        console.log("Audio Features:", selectedFeaturesArray);

        // Extract the artist ID from the first artist of the track
        const artistId = track.artists[0].id;

        // Call the fetchRelatedArtists function with the artist ID
        await fetchRelatedArtists(artistId);

        setShowRelatedArtists(true);

        try {
          const aiModelResponse = await axios.post(
            apiEndpoint,
            formattedArray,
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "X-Api-Key": apiKey,
                "Content-Type": "application/json",
              },
            }
          );

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
            const result = await user.functions.getTheSong(
              mixingScore,
              year,
              selectedGenre
            );
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

  const fetchRelatedArtists = async (artistId) => {
    console.log("Fetch Related Artists Called");

    try {
      const accessToken = localStorage.getItem("accessToken"); // Replace with your Spotify access token
      const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/related-artists`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Handle the response data (list of related artists)
      const relatedArtists = response.data.artists;

      // Shuffle the relatedArtists array to randomize the order
      const shuffledArtists = shuffleArray(relatedArtists);

      // Take the first 5 artists from the shuffled array
      const randomArtists = shuffledArtists.slice(0, 5);

      setRandomArtists(randomArtists);

      // Print the names of the randomly selected artists
      randomArtists.forEach((artist) => {
        console.log("Randomly Selected Artist Name:", artist.name);
      });

      // You can perform further actions with the randomly selected artists' data here
    } catch (error) {
      // Handle errors
      console.error("Error fetching related artists:", error);
    }
  };

  const fetchArtistAlbums = async (artistId) => {
    // console.log(`Fetching albums for artist with ID: ${artistId}`);
    try {
      const accessToken = localStorage.getItem("accessToken"); // Replace with your Spotify access token
      const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data && response.data.items) {
        const albums = response.data.items;

        // Shuffle the albums array to randomize the order
        const shuffledAlbums = shuffleArray(albums);

        // Take the first 5 albums from the shuffled array
        const randomAlbums = shuffledAlbums.slice(0, 5);

        // Log the names of the randomly selected albums
        randomAlbums.forEach((album) => {
          console.log("Randomly Selected Album Name:", album.name);
        });

        setArtistAlbums(randomAlbums);
        setSelectedArtist(artistId);

        // You can perform further actions with the randomly selected albums' data here
      } else {
        console.error("Invalid response from Spotify API");
      }
    } catch (error) {
      // Handle errors
      console.error("Error fetching artist albums:", error);
    }
  };

  const fetchAlbumTracks = async (albumId) => {
    try {
      const accessToken = localStorage.getItem("accessToken"); // Replace with your Spotify access token
      const apiUrl = `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=5`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = response.data; // You don't need to parse JSON, as Axios already does it

      if (data && data.items) {
        const tracks = data.items;

        // Shuffle the tracks array to randomize the order
        const shuffledTracks = shuffleArray(tracks);

        // Take the first 5 tracks from the shuffled array
        const randomTracks = shuffledTracks.slice(0, 5);

        // Log the names of the randomly selected tracks
        randomTracks.forEach((track) => {
          console.log("Randomly Selected Track Name:", track.name);
        });

        setAlbumSongs(randomTracks);
        setSelectedAlbumTracks(tracks); // Set the selected album tracks

        // You can perform further actions with the randomly selected tracks' data here
      } else {
        console.error("Invalid response from Spotify API");
      }
    } catch (error) {
      // Handle errors
      console.error("Error fetching album tracks:", error);
    }
  };

  // Function to shuffle an array randomly
  const shuffleArray = (array) => {
    let currentIndex = array.length,
      randomIndex,
      temporaryValue;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };

  // need to figure all genres i have and implement few changes and then work on css.
  return (
    <div className="content-container">
      <h1
        className="h1_aiBeats"
        style={{ marginBottom: "0", color: "#007bff" }}
      >
        MixMeister
      </h1>

      {loggedIn ? (
        <div>
          {showSearch ? (
            <div className="search-container">
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Search songs..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="genre-container">
                <label htmlFor="genre">Pick a Genre:</label>
                <select
                  id="genre"
                  name="genre"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  <option value="Pop">Pop</option>
                  <option value="Rap">Rap</option>
                  <option value="Underground Rap">Underground Rap</option>
                  <option value="Hiphop">Hiphop</option>
                  <option value="Techno">Techno</option>
                  <option value="RnB">RnB</option>
                  <option value="Dark Trap">Dark Trap</option>
                  <option value="Emo">Emo</option>
                </select>
              </div>
              <ul>
                {searchResults.map((track) => (
                  <li key={track.id}>
                    <button
                      className="track-button"
                      onClick={() => handleTrackSelection(track)}
                    >
                      {track.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="result-container">
              <button onClick={handleBackToSearch} className="back-button">
                Back to Search
              </button>
              <p className="result-title">Result:</p>
              <pre className="result-json">
                {JSON.stringify(preprocessResult(result), null, 2)}
              </pre>
              <div className="related-artists-container">
                <h2>Get Albums of Related Artists:</h2>
                <ul>
                  {randomArtists.map((artist, index) => (
                    <li key={index}>
                      <button
                        className="artist-button"
                        onClick={() => fetchArtistAlbums(artist.id)}
                      >
                        {artist.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {selectedArtist && (
                <div className="album-container">
                  <h2>Get Songs of Related Albums:</h2>
                  <ul>
                    {artistAlbums.map((album) => (
                      <li key={album.id}>
                        <button
                          className="album-button"
                          onClick={() => fetchAlbumTracks(album.id)}
                        >
                          {album.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {selectedAlbumTracks.length > 0 && (
            <div className="songs-container">
              <h2>Songs:</h2>
              <ul>
                {selectedAlbumTracks.map((track) => (
                  <li key={track.id}>{track.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="button-container">
          <button onClick={handleLogin}>Connect</button>
        </div>
      )}
    </div>
  );
};

export default AiBeats;
