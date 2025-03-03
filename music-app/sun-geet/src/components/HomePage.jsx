import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // Importing the CSS file
import drums from "../assets/drums.jpg"


export default function HomePage() {
    return (
        <div className="homepage">
            <div className="left-section">
                <div className="drums">
                <img src={drums} alt="drums" />
                </div>
                <h1 className="logo">SUN-GEET</h1>
            </div>


            <div className="right-section">
                <div className="right-top">
                    <h2 className="section-title">Features</h2>
                    <div className="button-container">
                        <button onClick={() => navigate("/music")}>MUSIC</button>
                        <button type="sing-btn"></button>
                        <button type="mood-btn"></button>
                        <button type="profile-btn"></button>
                    </div>
                </div>

                <div className="right-bottom">
                    <h2 className="section-title">Top Albums</h2>
                </div>

            </div>
        </div>
    );
}
