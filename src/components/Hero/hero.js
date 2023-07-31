import React from "react";
import "./hero.css"

const Hero = () => {
  return (
    <div className="main">
      <div className="main_container">
        <div className="main_content">
          <h1>Your DJ assistant</h1>
          <h2>Start your DJ journey</h2>
          <p>Explore our services</p>
          <button className="main_btn">
            <a href="/">Get Started</a>
          </button>
        </div>
        <div className="main_img-container">
          <img src="images/pic1.svg" alt="" id="img_name" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
