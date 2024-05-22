import React from "react";
import { Link } from 'react-router-dom';
import Paw from '../assets/dog-paw.svg';
import './Bar.scss';

export default function Bar({ logInState }) {
    const { isOpen, setIsOpen, toggle, loggedIn, setLoggedIn } = logInState;

    return (
        <div className="bar">
            <div>
                <img src={Paw} alt="paw" className="pawLogo" />
            </div>
            <div className="bar-list">
                <ul>
                    <li><Link to="/mypets">My Pets</Link></li>
                    <li><Link to="/mealplan">Meal Planner</Link></li>
                    <li><Link to="/tracker">Nutrition Tracker</Link></li>
                    <li><Link to="/shoppinglist">Shopping List</Link></li>
                    <li><Link to="/resources">Resources</Link></li>
                </ul>
                <ul>
                    <li><button>My Account</button></li>
                    {loggedIn ? (
                        <li><button onClick={toggle}>Log Out</button></li>
                    ) : (
                        <li><button onClick={toggle}>Log In</button></li>
                    )}
                </ul>
            </div>
        </div>
    );
}
