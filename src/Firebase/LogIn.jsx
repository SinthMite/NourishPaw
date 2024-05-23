import './LogIn.scss';
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './Firebase';

export default function LogIn({ hidden, logInState, userIdState }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setLoggedIn, loggedIn } = logInState;
    const {userId, setUserId} = userIdState;
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const authSignInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                setUserId(result.user.uid); // Extract userId
                setLoggedIn(true);
                // Store userId locally or in context
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
                // Store userId locally or in context
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
        <div className='totalscreenLogView' hidden={hidden}>
            {!loggedIn ? (
                <section id="logged-out-view">
                    <div className="containerLogIn">
                        <h1 className="app-title">Welcome</h1>
                        <div className="provider-buttons">
                            <button className="provider-btn" onClick={authSignInWithGoogle}>Sign in with Google</button>
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
