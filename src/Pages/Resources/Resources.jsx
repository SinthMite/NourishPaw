import React from "react";
import './Resources.scss'

export default function Resources(){
    return (
        <div className="about-us">
          <h1 className="about-us-title">About NourishPaw</h1>
          <p className="about-us-paragraph">
            At NourishPaw, our mission is to help pet owners provide the best nutrition for their pets. We believe that every pet deserves a healthy and balanced diet to live a happy life.
          </p>
          <p className="about-us-paragraph">
            Our app offers a comprehensive solution for pet owners to manage their pet's dietary needs. From personalized meal plans to tracking nutrition and finding the best food products, NourishPaw is your go-to platform for all things pet nutrition.
          </p>
          <h2 className="about-us-subtitle">Our Goals</h2>
          <ul className="about-us-list">
            <li className="about-us-list-item">Ensure pets receive the nutrition they need to thrive.</li>
            <li className="about-us-list-item">Provide personalized meal plans tailored to each pet's specific needs.</li>
            <li className="about-us-list-item">Help pet owners make informed decisions about their pet's diet.</li>
            <li className="about-us-list-item">Offer a user-friendly platform for managing pet profiles and tracking nutrition.</li>
            <li className="about-us-list-item">Connect pet owners with high-quality pet food products.</li>
          </ul>
          <p className="about-us-paragraph">
            We are passionate about pets and their well-being. Our team is dedicated to continually improving our app to better serve pet owners and their furry friends. With NourishPaw, you can be confident that you are providing the best nutrition for your pets.
          </p>
        </div>
      );
    };