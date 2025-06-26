import React, { useState } from 'react';
import Headbar from './Components/Headbar';
import Footer from './Components/Footer';
import Artworkdisplay from './Components/Artworks';
import Starter from './Components/Artpage';
import Filter from './Components/Filter';
import './App.css';

function App() {
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleFilter = (filterType) => {
    setSelectedFilter((prevFilter) => {
      if (prevFilter === filterType) {
        // If the same filter is clicked again, deselect it
        return null;
      } else {
        // Otherwise, select the new filter
        return filterType;
      }
    });
  };


  return (
    <div className="App">
      <Starter />
      <Headbar />
      <Filter onFilter={handleFilter} selectedFilter={selectedFilter} /> {/* Pass selectedFilter prop */}
      <Artworkdisplay selectedFilter={selectedFilter} />
      <Footer />
    </div>
  );
}

export default App;
