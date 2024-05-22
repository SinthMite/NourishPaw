import './LogIn.scss';
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';
import Home from '../Home/Home.jsx';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import googleLogo from '../assetImages/google.svg';

export default function LogIn({ firebase }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const authSignInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(firebase.auth, provider)
            .then((result) => {
                setLoggedIn(true); // Set loggedIn state to true on successful login
                window.localStorage.setItem('LogInValue', JSON.stringify(true)); // Update local storage value
            })
            .catch((error) => {
                console.error("Google Auth Error:", error);
            });
    }

    const authSignInWithEmail = () => {
        signInWithEmailAndPassword(firebase.auth, email, password)
            .then((userCredential) => {
                setLoggedIn(true); // Set loggedIn state to true on successful login
                window.localStorage.setItem('LogInValue', JSON.stringify(true)); // Update local storage value
                setEmail('');
                setPassword('');
            }).catch((error) => {
                console.error("Email Auth Error:", error);
            });
    };

    const authCreateAccountWithEmail = () => {
        createUserWithEmailAndPassword(firebase.auth, email, password)
            .then((userCredential) => {
                setEmail('');
                setPassword('');
            }).catch((error) => {
                console.error("Create Account Error:", error);
            });
    };

    const authSignOut = () => {
        signOut(firebase.auth)
            .then(() => {
                setLoggedIn(false); // Set loggedIn state to false on logout
                window.localStorage.setItem('LogInValue', JSON.stringify(false)); // Update local storage value
            }).catch((error) => {
                console.error("Sign Out Error:", error);
            });
    };

    const guestLogIn = () => {
        setLoggedIn(true); // Set loggedIn state to true for guest login
    }

    useEffect(() => {
        const LogInData = window.localStorage.getItem('LogInValue');
        if (LogInData !== null && typeof JSON.parse(LogInData) === 'boolean') {
            setLoggedIn(JSON.parse(LogInData)); // Set the loggedIn state with the retrieved value
        } else {
            setLoggedIn(false); // Default to false if no valid value found in local storage
        }
    }, []);

    // Function to fetch API data
    const ApiCatcher = async () => {
        const collectionPath = "API"; // Collection path
        try {
            const querySnapshot = await getDocs(collection(firebase.db, collectionPath));
            let apiKey = ''; // Initialize apiKey variable
            querySnapshot.forEach((doc) => {
                const recipeData = doc.data().Recipe;
                const recipeString = `${recipeData}`;
                console.log(recipeString);
                apiKey = recipeString; // Set apiKey to the retrieved value
            });
            return apiKey; // Return the apiKey value
        } catch (error) {
            console.error("Error getting documents:", error);
            return ''; // Return an empty string in case of error
        }
    }

    return (
        <>
            {!loggedIn && (
                <div className='totalscreenLogView'>
                    <section id="logged-out-view">
                        <div className="containerLogIn">
                            <h1 className="app-title">FlavorQuest</h1>
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
                    <Header firebase={firebase} authSignOut={authSignOut} />
                    <Home ApiCatcher={ApiCatcher} />
                    <Footer />
                </div>
            )}
        </>
    );
}
