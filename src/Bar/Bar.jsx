// src/Bar/Bar.jsx
import React from "react";
import Paw from '../assets/dog-paw.svg';
import './Bar.scss';

export default function Bar() {
    return (
        <div className="bar">
            <div>
                <img src={Paw} alt="paw" className="pawLogo" />
            </div>
            <div className="bar-list">
                <ul>
                    <li><a href="/mypets">My Pets</a></li>
                    <li><a href="/mealplan">Meal Planner</a></li>
                    <li><a href="/tracker">Nutrition Tracker</a></li>
                    <li><a href="/shoppinglist">Shopping List</a></li>
                    <li><a href="/resources">Resources</a></li>
                </ul>
                <ul>
                    <li><button>My Account</button></li>
                    <li><button onClick={() => window.location.href = '/login'}>Log In</button></li>
                </ul>
            </div>
        </div>
    );
}
