import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import type { Artwork } from "../types";

interface PopupProps {
  selectedArtwork: Artwork | null;
  closeModal: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  getDetailImageUrls: () => string[];
  currentDetailIndex: number;
}

export default function Popup({
  selectedArtwork,
  closeModal,
  goToPrevious,
  goToNext,
  getDetailImageUrls,
  currentDetailIndex,
}: PopupProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    setIsExpanded(false);
  }, [selectedArtwork]);

  if (!selectedArtwork) return null;

  const handleNavClick = (e: React.MouseEvent, navFunction: () => void) => {
    e.stopPropagation();
    navFunction();
  };

  const imageUrls = getDetailImageUrls();
  const currentImageUrl = imageUrls[currentDetailIndex];

  return (
    <div className="popup-overlay" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <div className="modal-content-wrapper">
          <div className="image-and-nav-wrapper" {...swipeHandlers}>
            <div className="modal-images-container">
              {imageUrls.length > 0 && (
                <div
                  className="image-wrapper"
                  style={{
                    backgroundImage: `url(${currentImageUrl})`,
                  }}
                  aria-label={selectedArtwork.title}
                ></div>
              )}
            </div>
            <div className="nav-button-container">
              <button
                className={`nav-button prev ${!(imageUrls.length > 1 && currentDetailIndex > 0) ? "invisible" : ""}`}
                onClick={(e) => handleNavClick(e, goToPrevious)}
              >
                &lt;
              </button>
              <button
                className={`nav-button next ${!(imageUrls.length > 1 && currentDetailIndex < imageUrls.length - 1) ? "invisible" : ""}`}
                onClick={(e) => handleNavClick(e, goToNext)}
              >
                &gt;
              </button>
            </div>
          </div>
          <div className="caption-wrapper">
            <div className="caption">Title: {selectedArtwork.title}</div>
            {selectedArtwork.time && <div className="caption">Time: {selectedArtwork.time}</div>}
            {selectedArtwork.medium && <div className="caption">Medium: {selectedArtwork.medium}</div>}
            {selectedArtwork.dimension && <div className="caption">Dimension: {selectedArtwork.dimension}</div>}
            
            <div className="description">
              Description:
              <div className="descriptionplus">
                {Array.isArray(selectedArtwork.description) ? (
                  selectedArtwork.description.map((line, index) => (
                    <p key={index} className="line">
                      {line}
                    </p>
                  ))
                ) : selectedArtwork.description ? (
                  <>
                    <p className="regular-description">
                      {(() => {
                        const desc = String(selectedArtwork.description);
                        const words = desc.split(" ");
                        if (isExpanded || words.length <= 50) {
                          return desc;
                        }
                        return `${words.slice(0, 50).join(" ")}...`;
                      })()}
                    </p>
                    {(() => {
                      const desc = String(selectedArtwork.description);
                      const words = desc.split(" ");
                      return words.length > 50 ? (
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="read-more-button"
                        >
                          {isExpanded ? "Read Less" : "Read More"}
                        </button>
                      ) : null;
                    })()}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
