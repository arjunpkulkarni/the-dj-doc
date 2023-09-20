import React, { useState, useEffect, useRef } from "react";
import "./remix.css"; // Import your CSS file for styling
import WaveSurfer from "wavesurfer.js";

const RemixMaster = () => {
  const [audioSrc, setAudioSrc] = useState(null);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (audioSrc) {
      const wavesurfer = WaveSurfer.create({
        container: "#waveform",
        backend: "WebAudio",
        waveColor: "white",
        progressColor: "blue",
      });

      wavesurfer.load(audioSrc);

      setAudioPlayer(wavesurfer);
    }
  }, [audioSrc]);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setAudioSrc(objectURL);
    }
  };

  const playAudio = () => {
    if (audioPlayer) {
      audioPlayer.playPause();
    }
  };

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="remix-master-container">
      <h1>Remix Master</h1>
      <button onClick={openFileInput}>Choose File</button>
      <input
        type="file"
        accept=".mp3,.wav"
        onChange={handleFileInputChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <button onClick={playAudio}>Play</button>
      <div id="waveform"></div>
    </div>
  );
};

export default RemixMaster;
