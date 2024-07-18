import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Paw from '../assets/dog-paw.svg';
import './Bar.scss';

export default function Bar({ logInState, menuState }) {
    const { isOpen, toggle, loggedIn } = logInState;
    const { menuOpen, setMenuOpen, showPopup, setShowPopup, } = menuState;

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

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
        <div className="bar">
            <div className="bar-header">
                <img src={Paw} alt="paw" className="pawLogo" />
                <button className="menu-toggle" onClick={handleMenuToggle}>
                    ☰
                </button>
            </div>
            <div className={`bar-list ${menuOpen ? 'open' : ''}`}>
                <ul>
                    <li><Link to="/mypets" onClick={handleLinkClick}>My Pets</Link></li>
                    <li><Link to="/mealplan" onClick={handleLinkClick}>Meal Planner</Link></li>
                    <li><Link to="/tracker" onClick={handleLinkClick}>Nutrition Tracker</Link></li>
                    <li><Link to="/resources">Resources</Link></li>
                </ul>
            </div>
            {showPopup && (
                <div className="popup-message">
                    Please log in or try the demo.
                </div>
            )}
            <div className="account-buttons">
                <button>My Account</button>
                {loggedIn ? (
                    <button onClick={toggle}>Log Out</button>
                ) : (
                    <button onClick={toggle}>Log In</button>
                )}
            </div>
        </div>
    );
}
