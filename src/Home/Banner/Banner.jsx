import React,{ useState } from "react";
import './Banner.scss'


export default function Banner({ logInState, menuState }){
    const { loggedIn } = logInState;
    const { showPopup, setShowPopup, } = menuState;

    const handleLinkClick = (e) => {
        if (!loggedIn) {
            e.preventDefault();
            console.log('Link clicked, but user is not logged in');
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 3000); // Hide popup after 3 seconds
        }
    };

    return (
        <div className="banner-Div">
            <div className="banner-text">
                <div>
                <h1>Nourish<span>-</span>Paw</h1>
                <p>Welcome to NourishPaw! Our goal is to help you provide the best nutrition for your pets. Discover personalized meal plans, nutritional tips, and expert advice to keep your furry friends healthy and happy. Explore our app to ensure your pets receive the balanced diet they deserve.</p>
                <div>
                <a href="/mypets">
                    <button className="menu-toggle" onClick={handleLinkClick}>Start Now</button>
                </a>
                {showPopup && (
                <div className="popup-message">
                    Please log in or try the demo.
                </div>
            )}
                </div>
            </div>

            </div>
        </div>
    )
}