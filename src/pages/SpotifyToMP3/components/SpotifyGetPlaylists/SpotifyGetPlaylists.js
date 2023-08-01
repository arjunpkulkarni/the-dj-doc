import React, { useEffect, useState } from "react";
import axios from "axios";

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

const SpotifyGetPlaylists = () => {
    const [token, setToken] = useState("");
    const [data, setData] = useState({});

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            setToken(localStorage.getItem("accessToken"));
        }
    }, []);

    const handleGetPlaylists = () => {
        axios.get(PLAYLIST_ENDPOINT, {
            headers: {
                Authorization: "Bearer " + token,
            }
        }).then(response => {
            setData(response.data);
        })
        .catch((error) => {
            console.log(error)
        });
     };

    return (
    <>
    <button onClick={handleGetPlaylists}>Get Playlists</button>
   
    {data?.items ? data.items.map((item) => <p key={item.id}>{item.name}</p>) : null}


    </>);
}

export default SpotifyGetPlaylists;