import React, { useState, useEffect } from "react";
import "./Artworks.css";
import "../App.css";
import Popup from "./Popup"; 

const Artwork = ({ selectedFilter }) => {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);
  const imageCdnBaseUrl =
    import.meta.env.VITE_CDN_URL || "https://images.xuecong.art/";

  useEffect(() => {
    if (selectedArtwork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedArtwork]);

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        let artPicData;
        if (selectedFilter === "painting") {
          const artPicDataModule = await import("./data/Painting.json");
          artPicData = artPicDataModule.default;
        } else if (selectedFilter === "sculpture") {
          const artPicDataModule = await import("./data/Sculpture.json");
          artPicData = artPicDataModule.default;
        } else if (selectedFilter === "installation") {
          const artPicDataModule = await import("./data/Installation.json");
          artPicData = artPicDataModule.default;
        } else if (selectedFilter === "other") {
          const artPicDataModule = await import("./data/Other.json");
          artPicData = artPicDataModule.default;
        } else {
          // No filter selected, load all artworks from every category
          const paintingModule = await import("./data/Painting.json");
          const sculptureModule = await import("./data/Sculpture.json");
          const installationModule = await import("./data/Installation.json");
          const otherModule = await import("./data/Other.json");

          const paintingData = paintingModule.default;
          const sculptureData = sculptureModule.default;
          const installationData = installationModule.default;
          const otherData = otherModule.default;

          artPicData = [
            ...(Array.isArray(paintingData) ? paintingData : []),
            ...(Array.isArray(sculptureData) ? sculptureData : []),
            ...(Array.isArray(installationData) ? installationData : []),
            ...(Array.isArray(otherData) ? otherData : []),
          ];
        }

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
  }, [selectedFilter]);

  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
    setCurrentDetailIndex(0); 
  };

  const closeModal = () => {
    setSelectedArtwork(null);
  };

  const goToPrevious = () => {
    setCurrentDetailIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : getDetailImageUrls().length - 1
    );
  };

  const goToNext = () => {
    setCurrentDetailIndex((nextIndex) =>
      nextIndex < getDetailImageUrls().length - 1 ? nextIndex + 1 : 0
    );
  };

  const getDetailImageUrls = () => {
    const urls = [];
    if (selectedArtwork) {
      urls.push(selectedArtwork.url);
      if (selectedArtwork.detail1)
        urls.push(`${imageCdnBaseUrl}${selectedArtwork.detail1}`);
      if (selectedArtwork.detail2)
        urls.push(`${imageCdnBaseUrl}${selectedArtwork.detail2}`);
      if (selectedArtwork.detail3)
        urls.push(`${imageCdnBaseUrl}${selectedArtwork.detail3}`);
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
