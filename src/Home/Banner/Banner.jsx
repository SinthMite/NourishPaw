import React,{ useState } from "react";
import './Banner.scss'


export default function Banner(){
    return (
        <div className="banner-Div">
            <div className="banner-text">
                <div>
                <h1>Nourish<span>-</span>Paw</h1>
                <p>Welcome to NourishPaw! Our goal is to help you provide the best nutrition for your pets. Discover personalized meal plans, nutritional tips, and expert advice to keep your furry friends healthy and happy. Explore our app to ensure your pets receive the balanced diet they deserve.</p>
                <div>
                    <button>Learn More</button>
                </div>
            </div>

            </div>
        </div>
    )
}