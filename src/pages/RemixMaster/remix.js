import React, { useState, useEffect, useRef } from "react";
import "./remix.css"; // Import your CSS file for styling
import WaveSurfer from "wavesurfer.js";

const RemixMaster = () => {
  const [audioSrc, setAudioSrc] = useState(null);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const fileInputRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioSrc) {
      const wavesurfer = WaveSurfer.create({
        container: "#waveform",
        backend: "WebAudio",
        waveColor: "white",
        progressColor: "blue",
        interact: false
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
      setStartTime(0); // Reset start and end times when a new file is selected
      setEndTime(0);
    }
  };

  const playAudio = () => {
  
  if (audioPlayer) {
    if (audioPlayer.isPlaying()) {
      audioPlayer.pause(); // Pause the audio if it's playing
      setIsPlaying(false);
    } else {
      // Calculate the start position in seconds
      const startPosition = startTime;
      
      // Seek to the calculated start position
      audioPlayer.seekTo(startPosition);
      
      audioPlayer.play(); // Start playing from the specified position

      setIsPlaying(true);
    }
  }
  };


  const openFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="remix-master-container">
      <div className="title_box">
        <h1 className="title">Remix Master</h1>
      </div>

      <div className="button_open_container">
        <button onClick={openFileInput} className="button_open">
          Choose File 1 
        </button>
        <input
          type="file"
          accept=".mp3,.wav"
          onChange={handleFileInputChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      </div>
      <div className="button_open_container_2">
        <button onClick={openFileInput} className="button_open_2">
          Choose File 2 
        </button>
        <input
          type="file"
          accept=".mp3,.wav"
          onChange={handleFileInputChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      </div>

      <div className="button_play_container">
        <button onClick={playAudio} className="button_play">
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <div className="editor_container">
        <div className="toolbar">
          <button className="toolbar-button">Cut</button>
          <button className="toolbar-button">Loop</button>
          <button className="toolbar-button">Crossfader</button>
          <button className="toolbar-button">FX</button>
          <button className="toolbar-button">Undo</button>
          <button className="toolbar-button">Redo</button>
      </div>

        <div id="waveform"></div>
      </div>
    </div>
  );
};

export default RemixMaster;
