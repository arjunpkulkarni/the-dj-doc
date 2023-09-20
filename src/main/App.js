// App.js

import "./App.css"
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HOME, SIGN_UP, AIBEATS, SPOTIFYCONVERT, SETBUILDER, REMIXMASTER, HARMONIX } from "../constants/routes";
import NavigationBar from "../components/NavBar";
import SignUpForm from "../components/SignUpForm";
import Hero from "../components/Hero";
import SpotifyToMP3 from "../pages/SpotifyToMP3/SpotifyToMP3"; // Correct the import to use uppercase
import AiBeats from "../pages/AIBeats/aiBeats";
import SetBuilder from "../pages/SetBuilder";
import RemixMaster from "../pages/RemixMaster"
import Harmonix from "../pages/Harmonix";

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
        <Route path={REMIXMASTER} element = {<RemixMaster />} />
        <Route path={HARMONIX} element = {<Harmonix />} />
      </Routes>
    </Router>
  );
}

export default App;
