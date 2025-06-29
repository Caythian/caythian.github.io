import React, { useState, useEffect } from "react";
import photosData from "./Photos.json";
import "./PhotoDisplay.css";
import "../App.css";
import Popup from "./Popup";

const Photo = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const imageCdnBaseUrl =
    import.meta.env.VITE_CDN_URL || "https://images.xuecong.art/";

  useEffect(() => {
    if (Array.isArray(photosData)) {
      const loadedPhotos = photosData.map((photo) => {
        return {
          ...photo,
          url: `${imageCdnBaseUrl}${photo.imageName}`,
          description: `Camera Info: ${photo.info}`,
        };
      });
      setPhotos(loadedPhotos);
    }
  }, []);

  const openModal = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentPhotoIndex(index);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  const goToPrevious = () => {
    const newIndex =
      currentPhotoIndex > 0 ? currentPhotoIndex - 1 : photos.length - 1;
    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const goToNext = () => {
    const newIndex =
      currentPhotoIndex < photos.length - 1 ? currentPhotoIndex + 1 : 0;
    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const getDetailImageUrls = () => {
    if (!selectedPhoto) return [];
    // For photos, we'll just show the single image.
    // The navigation will loop through the photos array.
    return [selectedPhoto.url];
  };

  if (!photos || photos.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="photogallery-wrapper">
        {photos.map((photo, index) => (
          <div
            className="photogallery"
            key={index}
            onClick={() => openModal(photo, index)}
          >
            <img src={photo.url} alt={photo.title} loading="lazy" />
            <div className="overlay">Click to see info</div>
          </div>
        ))}
      </div>

      <Popup
        selectedArtwork={selectedPhoto}
        closeModal={closeModal}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
        getDetailImageUrls={getDetailImageUrls}
        currentDetailIndex={0} // Always 0 as we only have one image per item
      />
    </div>
  );
};

export default Photo;
