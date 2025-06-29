import React, { useEffect, useState } from 'react';
import './Popup.css';
import { useSwipeable } from 'react-swipeable';

function Popup({ selectedArtwork, closeModal, goToPrevious, goToNext, getDetailImageUrls, currentDetailIndex }) {
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

  const handleNavClick = (e, navFunction) => {
    e.stopPropagation();
    navFunction();
  };

  return (
    <div className="popup-overlay" onClick={closeModal}> 
      <div className="modal" onClick={e => e.stopPropagation()}> 
        <span className="close" onClick={closeModal}>&times;</span>
         <div className="modal-content-wrapper">
            <div className="image-and-nav-wrapper" {...swipeHandlers}>
              <div className="modal-images-container">
                {getDetailImageUrls().length > 0 && (
                  <div
                    className="modal-content"
                    style={{ backgroundImage: `url(${getDetailImageUrls()[currentDetailIndex]})` }}
                    aria-label={selectedArtwork.title}
                  >
                  </div>
                )}
              </div>
              <div className="nav-button-container">
                <button className={`nav-button prev ${!(getDetailImageUrls().length > 1 && currentDetailIndex > 0) ? 'invisible' : ''}`} onClick={(e) => handleNavClick(e, goToPrevious)}>
                  &lt;
                </button>
                <button className={`nav-button next ${!(getDetailImageUrls().length > 1 && currentDetailIndex < getDetailImageUrls().length - 1) ? 'invisible' : ''}`} onClick={(e) => handleNavClick(e, goToNext)}>
                  &gt;
                </button>
              </div>
            </div>
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
                    <>
                      <p className="regular-description">
                        {isExpanded || selectedArtwork.description.split(' ').length <= 50
                          ? selectedArtwork.description
                          : `${selectedArtwork.description.split(' ').slice(0, 50).join(' ')}...`}
                      </p>
                      {selectedArtwork.description.split(' ').length > 50 && (
                        <button onClick={() => setIsExpanded(!isExpanded)} className="read-more-button">
                          {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export default Popup;
