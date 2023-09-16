// App.js

import "./App.css"
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HOME, SIGN_UP, AIBEATS, SPOTIFYCONVERT, SETBUILDER } from "../constants/routes";
import NavigationBar from "../components/NavBar";
import SignUpForm from "../components/SignUpForm";
import Hero from "../components/Hero";
import SpotifyToMP3 from "../pages/SpotifyToMP3/SpotifyToMP3"; // Correct the import to use uppercase
import AiBeats from "../pages/AIBeats/aiBeats";
import SetBuilder from "../pages/SetBuilder";


function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path={SIGN_UP} element={<SignUpForm />} />
        <Route path={HOME} element={<Hero />} />
        <Route path={SPOTIFYCONVERT} element={<SpotifyToMP3 />} />
        <Route path={AIBEATS} element= {<AiBeats />} />
        <Route path={SETBUILDER} element = {<SetBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;
