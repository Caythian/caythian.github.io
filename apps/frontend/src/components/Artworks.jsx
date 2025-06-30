import React, { useState, useEffect } from "react";
import "./Artworks.css";
import "../App.css";
import Popup from "./Popup";

const Artwork = ({ selectedFilter }) => {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);
  const imageCdnBaseUrl = "/api/image/";
  const apiBaseUrl = "/api";

  useEffect(() => {
    if (selectedArtwork) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedArtwork]);

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const url = selectedFilter
          ? `${apiBaseUrl}/artworks/${selectedFilter}`
          : `${apiBaseUrl}/artworks`;
        const response = await fetch(url);
        let artPicData = await response.json();

        if (Array.isArray(artPicData)) {
          const loadedArtworks = artPicData.map((artwork) => ({
            ...artwork,
            url: `${imageCdnBaseUrl}${artwork.image}`,
          }));
          setArtworks(loadedArtworks);
        } else {
          console.error("Invalid JSON data:", artPicData);
          setArtworks([]);
        }
      } catch (error) {
        console.error("Error loading artworks:", error);
        setArtworks([]);
      }
    };

    loadArtworks();
  }, [selectedFilter, apiBaseUrl]);

  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
    setCurrentDetailIndex(0);
  };

  const closeModal = () => {
    setSelectedArtwork(null);
  };

  const goToPrevious = () => {
    setCurrentDetailIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : getDetailImageUrls().length - 1,
    );
  };

  const goToNext = () => {
    setCurrentDetailIndex((nextIndex) =>
      nextIndex < getDetailImageUrls().length - 1 ? nextIndex + 1 : 0,
    );
  };

  const getDetailImageUrls = () => {
    const urls = [];
    if (selectedArtwork) {
      urls.push(selectedArtwork.url);
      if (selectedArtwork.details && Array.isArray(selectedArtwork.details)) {
        selectedArtwork.details.forEach((detail) => {
          urls.push(`${imageCdnBaseUrl}${detail}`);
        });
      }
    }
    return urls;
  };

  if (!artworks || artworks.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="artworkgallery-wrapper">
        {artworks.map((artwork, index) => (
          <div
            className="artworkgallery"
            key={index}
            onClick={() => openModal(artwork)}
          >
            <img src={artwork.url} alt={artwork.title} loading="lazy" />
            <div className="overlay">{artwork.title}</div>
          </div>
        ))}
      </div>

      <Popup
        selectedArtwork={selectedArtwork}
        closeModal={closeModal}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
        getDetailImageUrls={getDetailImageUrls}
        imageCdnBaseUrl={imageCdnBaseUrl}
        currentDetailIndex={currentDetailIndex}
      />
    </div>
  );
};

export default Artwork;
