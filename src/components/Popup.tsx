import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import type { ArtworkRow } from "../types";

const Chevron = ({ direction }: { direction: "up" | "down" }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="popup-chevron">
    <path d={direction === "down" ? "M5 9l7 7 7-7" : "M5 15l7-7 7 7"} />
  </svg>
);

interface PopupProps {
  row: ArtworkRow;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export default function Popup({
  row,
  index,
  onIndexChange,
  onClose,
}: PopupProps) {
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const descriptionBodyRef = useRef<HTMLDivElement>(null);

  const piece = row.pieces[index];
  const hasPrevious = index > 0;
  const hasNext = index < row.pieces.length - 1;
  const hasDescription = (piece.description?.length ?? 0) > 0;

  const goToPrevious = () => hasPrevious && onIndexChange(index - 1);
  const goToNext = () => hasNext && onIndexChange(index + 1);

  const openDescription = () => {
    if (hasDescription) setDescriptionOpen(true);
  };

  // Each artwork starts with its description folded
  useEffect(() => {
    setDescriptionOpen(false);
  }, [piece.id]);

  useEffect(() => {
    if (descriptionOpen) descriptionBodyRef.current?.scrollTo(0, 0);
  }, [descriptionOpen]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => previousFocus?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (descriptionOpen) setDescriptionOpen(false);
        else onClose();
      } else if (!descriptionOpen && e.key === "ArrowLeft") {
        goToPrevious();
      } else if (!descriptionOpen && e.key === "ArrowRight") {
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrevious,
    onSwipedUp: openDescription,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // Scrolling down over the image or info bar opens the description;
  // scrolling up at the top of the description folds it again
  const handleWheel = (e: React.WheelEvent) => {
    if (!descriptionOpen && e.deltaY > 10) openDescription();
  };

  const handleDescriptionWheel = (e: React.WheelEvent) => {
    if (e.deltaY < -10 && descriptionBodyRef.current?.scrollTop === 0) {
      setDescriptionOpen(false);
    }
  };

  return (
    <div className="popup-overlay">
      <button
        type="button"
        className="popup-backdrop"
        onClick={onClose}
        aria-label="Close"
        tabIndex={-1}
      />
      <div
        className="popup-window"
        role="dialog"
        aria-modal="true"
        aria-label={row.title}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="popup-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div className="popup-main" onWheel={handleWheel}>
          <div className="popup-stage" {...swipeHandlers}>
            <img
              key={piece.id}
              src={piece.image}
              alt={piece.title}
              className="popup-image"
              draggable={false}
            />
            <button
              type="button"
              className={`popup-nav prev ${hasPrevious ? "" : "invisible"}`}
              onClick={goToPrevious}
              aria-label="Previous artwork"
            >
              &lsaquo;
            </button>
            <button
              type="button"
              className={`popup-nav next ${hasNext ? "" : "invisible"}`}
              onClick={goToNext}
              aria-label="Next artwork"
            >
              &rsaquo;
            </button>
          </div>

          <div className="popup-info">
            <div className="popup-info-row">
              <div className="popup-info-text">
                <div className="popup-info-title">
                  {piece.title}
                  {piece.time && (
                    <span className="popup-info-year">{piece.time}</span>
                  )}
                </div>
                <div className="popup-info-meta">
                  {piece.medium && <em>{piece.medium}</em>}
                  {piece.medium && piece.dimension && <span> · </span>}
                  {piece.dimension && <span>{piece.dimension}</span>}
                </div>
                {piece.hasDetails && (
                  <a
                    className="popup-info-link"
                    href={`/artworks/${piece.slug}`}
                  >
                    Detail images →
                  </a>
                )}
              </div>
              {row.pieces.length > 1 && (
                <div className="popup-counter">
                  {index + 1} / {row.pieces.length}
                </div>
              )}
            </div>
            {hasDescription && (
              <button
                type="button"
                className="popup-toggle"
                onClick={openDescription}
                aria-label="Show description"
                aria-expanded={descriptionOpen}
              >
                <Chevron direction="down" />
              </button>
            )}
          </div>
        </div>

        <div
          className={`popup-description ${descriptionOpen ? "open" : ""}`}
          aria-hidden={!descriptionOpen}
          inert={!descriptionOpen}
        >
          <button
            type="button"
            className="popup-fold"
            onClick={() => setDescriptionOpen(false)}
            aria-label="Hide description"
          >
            <Chevron direction="up" />
          </button>
          <div
            className="popup-description-body"
            ref={descriptionBodyRef}
            onWheel={handleDescriptionWheel}
          >
            <div className="popup-description-title">{piece.title}</div>
            {piece.description?.map((line, lineIndex) => (
              <p key={lineIndex}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
