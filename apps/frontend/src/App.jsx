import React, { useState, useEffect } from "react";
import Artwork from "./Components/Artworks";
import Starter from "./Components/Artpage";
import Filter from "./Components/Filter";
import "./App.css";

function App() {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    if (selectedArtwork) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, [selectedArtwork]);

  const handleFilter = (filterType) => {
    setSelectedFilter((prevFilter) => {
      if (prevFilter === filterType) {
        return null;
      } else {
        return filterType;
      }
    });
  };

  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const closeModal = () => {
    setSelectedArtwork(null);
  };

  return (
    <div className="App">
      <Starter />
      <Filter onFilter={handleFilter} selectedFilter={selectedFilter} />
      <Artwork selectedFilter={selectedFilter} openModal={openModal} />
    </div>
  );
}

export default App;
