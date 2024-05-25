import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Paw from '../assets/dog-paw.svg';
import './Bar.scss';

export default function Bar({ logInState }) {
    const { isOpen, toggle, loggedIn } = logInState;
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
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
                    <li><Link to="/mypets">My Pets</Link></li>
                    <li><Link to="/mealplan">Meal Planner</Link></li>
                    <li><Link to="/tracker">Nutrition Tracker</Link></li>
                    <li><Link to="/resources">Resources</Link></li>
                </ul>
            </div>
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
