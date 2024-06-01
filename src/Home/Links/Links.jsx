import React from "react";
import { Link } from 'react-router-dom';

import './Links.scss'


export default function Links(){
    return(
        <div className="links-Div">
            <div className="links-list">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/resources">Resources</Link></li>
                </ul>
            </div>
        </div>
    )
}