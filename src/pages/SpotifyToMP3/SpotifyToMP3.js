import React, { useEffect, useState } from "react";
import SpotifyGetPlaylists from "./components/SpotifyGetPlaylists/SpotifyGetPlaylists";
import "./spotifyToMP3.css";
import PlaylistTracks from "./components/PlaylistTracks/PlaylistTracks";
import JSZip from 'jszip';
import axios from 'axios';
import { saveAs } from 'file-saver'; // Import the 'file-saver' library


const CLIENT_ID = "808ca3c84b71497f992a56543a4f41bc";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/spotifyToMP3";
const SPACE_DELIMITER = "%20"
const SCOPES = ["user-read-currently-playing", "user-read-playback-state", "playlist-read-private"];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInURL = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInURL.reduce((accumulator, currentValue) => {
      const [key, value] = currentValue.split("=");
      accumulator[key] = value;
      return accumulator;
    }, {}); // Initialize accumulator as an empty object
  
    return paramsSplitUp; // Add this return statement
  };

const SpotifyToMP3 = () => {
  const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (window.location.hash) {
          const { access_token, expires_in, token_type } =
            getReturnedParamsFromSpotifyAuth(window.location.hash);
    
          localStorage.clear();
    
          localStorage.setItem("accessToken", access_token);
          localStorage.setItem("tokenType", token_type);
          localStorage.setItem("expiresIn", expires_in);
          setLoggedIn(true);
          console.log("SpotifyToMP3 component rendered");
        }
    }, []);


    const handleLogin = () => {
        window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    };

    return (
    <div className="main-container-spotify">
      {!loggedIn ? ( // Show the sign-in container if not logged in
        <div className="sign-in-container">
          <h1> Sign into Spotify </h1>
          <button onClick={handleLogin}> Connect To Spotify </button>
        </div>
      ) : (
        // Show the get playlist container if logged in
        <div className="get-playlist-container">
          <h2>Get Playlists</h2>
          <SpotifyGetPlaylists />
        </div>
      )}
    </div>
  );
    
    
};

export default SpotifyToMP3;