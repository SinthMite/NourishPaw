import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import Bar from './Bar/Bar.jsx';
import Banner from './Home/Banner/Banner.jsx';
import Links from './Home/Links/Links.jsx';
import Resources from './Pages/Resources/Resources.jsx';
import MealPlan from './Pages/MealPlan/MealPlan.jsx';
import MyPets from './Pages/MyPets/MyPets.jsx';
import ShoppingList from './Pages/ShoppingList/ShoppingList.jsx';
import Tracker from './Pages/Tracker/Tracker.jsx';
import LogIn from './Firebase/LogIn.jsx';

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [pets, setPets] = useState([]);
  const [userId, setUserId] = useState('');
  const toggle = () => {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const LogInData = window.localStorage.getItem('LogInValue');
    if (LogInData !== null && typeof JSON.parse(LogInData) === 'boolean') {
      setLoggedIn(JSON.parse(LogInData));
    }
  }, []);

  const logInState = {
    isOpen,
    setIsOpen,
    toggle,
    loggedIn,
    setLoggedIn,
  };
  const petState = {
    pets,
    setPets,
  }
  const userIdState = {
    userId,
    setUserId,
  }
  return (
      <div className="App">
        <Bar logInState={logInState} />
        <LogIn hidden={isOpen} logInState={logInState} userIdState={userIdState} />
        <div className="content">
          <Routes>
            <Route path="/" element={
              <div className="banner">
                <Banner />
              </div>
            } />
            <Route path="/resources" element={
              <div className="resources">
                <Resources />
              </div>
            } />
            <Route path="/mealplan" element={
              <div className="mealplan">
                <MealPlan petState={petState} userIdState={userIdState} />
              </div>
            } />
            <Route path="/mypets" element={
              <div className="mypets">
                <MyPets petState={petState} />
              </div>
            } />
            <Route path="/shoppinglist" element={
              <div className="shoppinglist">
                <ShoppingList />
              </div>
            } />
            <Route path="/tracker" element={
              <div className="tracker">
                <Tracker />
              </div>
            } />
            <Route path="*" element={
              <div className="error">
                <h1>404</h1>
              </div>
            } />
          </Routes>
        </div>
        <div className='links'>
           <Links />
        </div>
       
      </div>
  );
}

export default App;
