import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import Bar from './Bar/Bar.jsx';
import Banner from './Home/Banner/Banner.jsx';
import Links from './Home/Links/Links.jsx';
import Resources from './Pages/Resources/Resources.jsx';
function App() {
  return (
    <div className="App">
      <Bar />
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
        </Routes>
      <div className="links">
        <Links />
      </div>
    </div>
  );
}

export default App;
