import React, { useState, useEffect } from "react";
import photosData from "./Photos.json";
import "./PhotoDisplay.css";
import "../App.css";

const Photo = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const imageCdnBaseUrl =
    import.meta.env.VITE_CDN_URL || "https://images.xuecong.art/";

  useEffect(() => {
    if (Array.isArray(photosData)) {
      const loadedPhotos = photosData.map((photo) => {
        return {
          ...photo,
          url: `${imageCdnBaseUrl}${photo.imageName}`,
        };
      });
      setPhotos(loadedPhotos);
    }
  }, []);

  if (!photos || photos.length === 0) {
    return <div>Loading...</div>;
  }

  const openModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };
  return (
    <div>
      <div className="photogallery-wrapper">
        {photos.map((photo, index) => (
          <div
            className="photogallery"
            key={index}
            onClick={() => openModal(photo)}
          >
            <img src={photo.url} alt={photo.title} loading="lazy" />
            <div className="overlay">Click to see info</div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="modal" onClick={closeModal}>
          <span className="close">&times;</span>
          <img
            className="modal-content"
            src={selectedPhoto.url}
            alt={selectedPhoto.title}
            loading="lazy"
          />
          <div className="caption">Location: {selectedPhoto.title}</div>
          <div className="caption">Date: {selectedPhoto.time}</div>
          <div className="caption">Camera Info: {selectedPhoto.info}</div>
        </div>
      )}
    </div>
  );
};

export default Photo;
