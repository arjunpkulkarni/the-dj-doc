import React from 'react';
import { Link } from 'react-router-dom';
import "./navbar.css";
import * as ROUTES from "../../constants/routes";
import { RiAlbumFill } from 'react-icons/ri';

const NavigationBar = () => {
    return (
        <header>
            <nav className="navbar">
                <div className="navbar_container">
                    <Link to={ROUTES.HOME} className="navbar_link"> {/* Add a class name for styling */}
                        <div id="navbar_logo" className="navbar_logo">
                            <div className="logo-content">
                                DJ Doc
                            </div>
                        </div>
                    </Link>


                    <div className="navbar_toggle" id="mobile-menu">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                    <ul className="navbar_menu">
                        <li className="navbar_item">
                            <Link to={ROUTES.AIBEATS} className="navbar_links">
                                MixMeister
                            </Link>
                        </li>

                        <li className="navbar_item">
                            <Link to={ROUTES.SETBUILDER} className="navbar_links">
                                SetBuilder
                            </Link>
                        </li>

                        <li className="navbar_item">
                            <Link to={ROUTES.SPOTIFYCONVERT} className="navbar_links">
                                <i className="fa-brands fa-spotify"></i>
                                <span style={{ marginLeft: '5px' }}>Converter</span>
                            </Link>
                        </li>

                        <li className="navbar_item">
                            <Link to="/Beatmaker" className="navbar_links">
                                RemixMaker
                            </Link>
                        </li>

                        <li className="navbar_btn">
                            <Link to={ROUTES.SIGN_UP} className="button">
                                <i className="fa-solid fa-circle-user"></i>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default NavigationBar;
