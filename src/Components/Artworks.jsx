import React, { useState, useEffect } from "react";
import artPicData from "./Artpic.json";
import "./Artworks.css";
import "../App.css";

const Artwork = () => {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const imageCdnBaseUrl =
    import.meta.env.VITE_CDN_URL || "https://images.xuecong.art/";

  useEffect(() => {
    if (Array.isArray(artPicData)) {
      const loadedArtworks = artPicData.map((artwork) => {
        return {
          ...artwork,
          url: `${imageCdnBaseUrl}${artwork.image}`,
        };
      });
      setArtworks(loadedArtworks);
    }
  }, []);

  if (!artworks || artworks.length === 0) {
    return <div>Loading...</div>;
  }

  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const closeModal = () => {
    setSelectedArtwork(null);
  };

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

      {selectedArtwork && (
        <div className="modal" onClick={closeModal}>
          <span className="close">&times;</span>
          <div className="modal-content-wrapper">
            <div className="modal-images-container">
              <img
                className="modal-content"
                src={selectedArtwork.url}
                alt={selectedArtwork.title}
                loading="lazy"
              />
              {selectedArtwork.detail1 && (
                <img
                  className="modal-content"
                  src={`${imageCdnBaseUrl}${selectedArtwork.detail1}`}
                  alt="Detail 1"
                  loading="lazy"
                />
              )}
              {selectedArtwork.detail2 && (
                <img
                  className="modal-content"
                  src={`${imageCdnBaseUrl}${selectedArtwork.detail2}`}
                  alt="Detail 2"
                  loading="lazy"
                />
              )}
              {selectedArtwork.detail3 && (
                <img
                  className="modal-content"
                  src={`${imageCdnBaseUrl}${selectedArtwork.detail3}`}
                  alt="Detail 3"
                  loading="lazy"
                />
              )}
            </div>
            <div className="caption-wrapper">
              <div className="caption">Title: {selectedArtwork.title}</div>
              <div className="caption">Time: {selectedArtwork.time}</div>
              <div className="caption">Medium: {selectedArtwork.medium}</div>
              <div className="description">
                Description:
                <div className="descriptionplus">
                  {Array.isArray(selectedArtwork.description) ? (
                    selectedArtwork.description.map((line, index) => (
                      <p key={index} className="line">
                        {line}
                      </p>
                    ))
                  ) : (
                    <p className="regular-description">
                      {selectedArtwork.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Artwork;
