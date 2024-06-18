import './LogIn.scss';
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from './Firebase';
import googleLogo from '../assets/google.webp';

export default function LogIn({ hidden, logInState, userIdState }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setLoggedIn, loggedIn } = logInState;
    const { userId, setUserId } = userIdState;

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    // Retrieve login state from local storage on component mount
    useEffect(() => {
        const logInData = window.localStorage.getItem('LogInValue');
        if (logInData !== null) {
            const parsedLogInData = JSON.parse(logInData);
            if (typeof parsedLogInData === 'boolean') {
                console.log('Loaded logInData from localStorage:', parsedLogInData); // Debugging line
                setLoggedIn(parsedLogInData);
            }
        } else {
            setLoggedIn(false);
        }
    }, [setLoggedIn]);

    // Save login state to local storage whenever it changes
    useEffect(() => {
        if (loggedIn !== null) {
            console.log('Setting logInData to localStorage:', loggedIn); // Debugging line
            window.localStorage.setItem('LogInValue', JSON.stringify(loggedIn));
        }
    }, [loggedIn]);

    const authSignInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                setUserId(result.user.uid); // Extract userId
                setLoggedIn(true);
                console.log('Google Sign-In successful. User ID:', result.user.uid); // Debugging line
            })
            .catch((error) => console.error("Google Auth Error:", error));
    };

    const authSignInWithEmail = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                setUserId(result.user.uid); // Extract userId
                setLoggedIn(true);
                setEmail('');
                setPassword('');
                console.log('Email Sign-In successful. User ID:', result.user.uid); // Debugging line
            })
            .catch((error) => console.error("Email Auth Error:", error));
    };

    const authCreateAccountWithEmail = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setEmail('');
                setPassword('');
                console.log('Account creation successful'); // Debugging line
            })
            .catch((error) => console.error("Create Account Error:", error));
    };

    const authSignOut = () => {
        signOut(auth)
            .then(() => {
                setLoggedIn(false);
                setUserId(null); // Clear userId on sign out
                console.log('Sign out successful'); // Debugging line
            })
            .catch((error) => console.error("Sign Out Error:", error));
    };

    const guestLogIn = () => {
        const guestEmail = 'tester@test.com';
        const guestPassword = 'password';
        signInWithEmailAndPassword(auth, guestEmail, guestPassword)
            .then((result) => {
                setUserId(result.user.uid); // Extract userId
                setLoggedIn(true);
                console.log('Guest login successful. User ID:', result.user.uid); // Debugging line
            })
            .catch((error) => console.error("Guest Auth Error:", error));
    };

    return (
        <div className='totalscreenLogView' hidden={hidden}>
            {loggedIn === false ? (
                <section id="logged-out-view">
                    <div className="containerLogIn">
                        <h1 className="app-title">Welcome</h1>
                        <div className="provider-buttons">
                            <button className="provider-btn" onClick={authSignInWithGoogle}>
                                <img src={googleLogo} alt="Google Logo" className='googleLogo' />
                            </button>
                        </div>
                        <div className="auth-fields-and-buttons">
                            <input className='inputLog' id="email-input" type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
                            <input className='inputLog' id="password-input" type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                            <button className="primary-btn" onClick={authSignInWithEmail}>Sign in</button>
                            <button className="secondary-btn" onClick={authCreateAccountWithEmail}>Create Account</button>
                            <button className="tri-btn" onClick={guestLogIn}>Demo</button>
                        </div>
                    </div>
                </section>
            ) : (
                <section id="logged-in-view">
                    <div className="containerLogIn">
                        <h1 className="app-title">Welcome</h1>
                        <button className="primary-btn" onClick={authSignOut}>Sign Out</button>
                    </div>
                </section>
            )}
        </div>
    );
}
