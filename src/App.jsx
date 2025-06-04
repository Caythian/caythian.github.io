import React from 'react';
import './App.css';
import Headbar from './Components/Headbar';
import Footer from './Components/Footer';
import Artworkdisplay from './Components/Artworks';

function App() {
  return (
    <div>
      <Headbar/>
      <Artworkdisplay/>
      <Footer/>
    </div>

  );
}

export default App;
