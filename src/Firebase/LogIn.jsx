import './LogIn.scss';
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';
import googleLogo from '../assetImages/google.svg';
import { auth, db } from './Firebase';
import Bar from '../Bar/Bar';

export default function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const authSignInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(() => {
                setLoggedIn(true);
                window.localStorage.setItem('LogInValue', JSON.stringify(true));
            })
            .catch((error) => console.error("Google Auth Error:", error));
    }

    const authSignInWithEmail = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setLoggedIn(true);
                window.localStorage.setItem('LogInValue', JSON.stringify(true));
                setEmail('');
                setPassword('');
            }).catch((error) => console.error("Email Auth Error:", error));
    };

    const authCreateAccountWithEmail = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                setEmail('');
                setPassword('');
            }).catch((error) => console.error("Create Account Error:", error));
    };

    const authSignOut = () => {
        signOut(auth)
            .then(() => {
                setLoggedIn(false);
                window.localStorage.setItem('LogInValue', JSON.stringify(false));
            }).catch((error) => console.error("Sign Out Error:", error));
    };

    const guestLogIn = () => setLoggedIn(true);

    useEffect(() => {
        const LogInData = window.localStorage.getItem('LogInValue');
        if (LogInData !== null && typeof JSON.parse(LogInData) === 'boolean') {
            setLoggedIn(JSON.parse(LogInData));
        } else {
            setLoggedIn(false);
        }
    }, []);

    // Function to fetch API data
    const ApiCatcher = async () => {
        const collectionPath = "API";
        try {
            const querySnapshot = await getDocs(collection(db, collectionPath));
            let apiKey = '';
            querySnapshot.forEach((doc) => {
                const recipeData = doc.data().Recipe;
                console.log(recipeData);
                apiKey = recipeData;
            });
            return apiKey;
        } catch (error) {
            console.error("Error getting documents:", error);
            return '';
        }
    }

    return (
        <>
            <Bar />
            {!loggedIn && (
                <div className='totalscreenLogView'>
                    <section id="logged-out-view">
                        <div className="containerLogIn">
                            <h1 className="app-title">NourishPaw</h1>
                            <div className="provider-buttons">
                                <button className="provider-btn" onClick={authSignInWithGoogle}>
                                    <img src={googleLogo} alt="Google Logo" className="google-btn-logo" />
                                </button>
                            </div>
                            <div className="auth-fields-and-buttons">
                                <input className='inputLog' id="email-input" type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
                                <input className='inputLog' id="password-input" type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                                <button className="primary-btn" onClick={authSignInWithEmail}>Sign in</button>
                                <button className="secondary-btn" onClick={authCreateAccountWithEmail}>Create Account</button>
                                <button className="tri-btn" onClick={guestLogIn}>Guest</button>
                            </div>
                        </div>
                    </section>
                </div>
            )}
            {loggedIn && (
                <div className='totalscreenLoggedInView'>
                    <p>Welcome! You are logged in.</p>
                    <button onClick={authSignOut}>Sign Out</button>
                    <div>
                        <p>Use ApiCatcher to get API key: {ApiCatcher()}</p>
                        {/* Add other components or routes that you want to render when the user is logged in */}
                    </div>
                </div>
            )}
        </>
    );
}
