import "./Popup.css";
import React from 'react';
import './Popup.css'; // Create a Modal.css file for styling

function Popup({ selectedArtwork, closeModal, goToPrevious, goToNext, getDetailImageUrls, imageCdnBaseUrl, currentDetailIndex }) {
  if (!selectedArtwork) return null;

  return (
    <div className="modal" onClick={closeModal}>
      <span className="close">&times;</span>
      <div className="modal-content-wrapper">
        <button className="nav-button prev" onClick={goToPrevious}>
          &lt;
        </button>

        <div className="modal-images-container">
          {getDetailImageUrls().length > 0 && (
            <img
              className="modal-content"
              src={getDetailImageUrls()[currentDetailIndex]}
              alt={selectedArtwork.title}
              loading="lazy"
            />
          )}
        </div>

        <button className="nav-button next" onClick={goToNext}>
          &gt;
        </button>

        <div className="caption-wrapper">
          <div className="caption">Title: {selectedArtwork.title}</div>
          <div className="caption">Time: {selectedArtwork.time}</div>
          <div className="caption">Medium: {selectedArtwork.medium}</div>
          <div className="caption">Dimension: {selectedArtwork.dimension}</div>
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
  );
}

export default Popup;
