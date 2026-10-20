import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import type { ArtworkRow } from "../types";

type Direction = "up" | "down" | "left" | "right";

const chevronPaths: Record<Direction, string> = {
  up: "M5 15l7-7 7 7",
  down: "M5 9l7 7 7-7",
  left: "M15 5l-7 7 7 7",
  right: "M9 5l7 7-7 7",
};

const Chevron = ({ direction }: { direction: Direction }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="popup-chevron">
    <path d={chevronPaths[direction]} />
  </svg>
);

interface StripProps {
  label: string;
  thumbs: { thumb: string; alt: string }[];
  selected: number;
  onSelect: (index: number) => void;
  size: "large" | "small";
}

// A row of thumbnails with arrows that step to the previous / next one
function Strip({ label, thumbs, selected, onSelect, size }: StripProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the selected thumbnail in view
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[selected] as HTMLElement | undefined;
    if (!list || !item) return;
    const left = item.offsetLeft - list.offsetLeft;
    if (left < list.scrollLeft) {
      list.scrollTo({ left, behavior: "smooth" });
    } else if (left + item.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollTo({
        left: left + item.offsetWidth - list.clientWidth,
        behavior: "smooth",
      });
    }
  }, [selected]);

  return (
    <div className={`popup-strip ${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="popup-strip-arrow"
        onClick={() => onSelect(selected - 1)}
        disabled={selected === 0}
        aria-label="Previous"
      >
        <Chevron direction="left" />
      </button>
      <div className="popup-strip-list" ref={listRef}>
        {thumbs.map((item, index) => (
          <button
            type="button"
            key={item.thumb}
            className="popup-strip-thumb"
            onClick={() => onSelect(index)}
            aria-pressed={index === selected}
            aria-label={item.alt}
          >
            <img src={item.thumb} alt="" loading="lazy" draggable={false} />
          </button>
        ))}
      </div>
      <button
        type="button"
        className="popup-strip-arrow"
        onClick={() => onSelect(selected + 1)}
        disabled={selected === thumbs.length - 1}
        aria-label="Next"
      >
        <Chevron direction="right" />
      </button>
    </div>
  );
}

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
  const [imageIndex, setImageIndex] = useState(0);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const descriptionBodyRef = useRef<HTMLDivElement>(null);

  const piece = row.pieces[index];
  const image = piece.images[imageIndex] ?? piece.images[0];
  const hasDescription = (piece.description?.length ?? 0) > 0;

  const goToPrevious = () => index > 0 && onIndexChange(index - 1);
  const goToNext = () =>
    index < row.pieces.length - 1 && onIndexChange(index + 1);

  const openDescription = () => {
    if (hasDescription) setDescriptionOpen(true);
  };

  // Each artwork starts on its main image with the description folded
  useEffect(() => {
    setImageIndex(0);
    setDescriptionOpen(false);
  }, [piece.id]);

  useEffect(() => {
    if (descriptionOpen) descriptionBodyRef.current?.scrollTo(0, 0);
  }, [descriptionOpen]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus({ preventScroll: true });
    return () => previousFocus?.focus({ preventScroll: true });
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
            key={image.src}
            src={image.src}
            alt={
              imageIndex === 0
                ? piece.title
                : `${piece.title} detail ${imageIndex}`
            }
            className="popup-image"
            draggable={false}
          />
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
            </div>

            <div className="popup-strips">
              {row.pieces.length > 1 && (
                <Strip
                  label={`Artworks in ${row.title}`}
                  thumbs={row.pieces.map((p) => ({
                    thumb: p.images[0].thumb,
                    alt: p.title,
                  }))}
                  selected={index}
                  onSelect={onIndexChange}
                  size="large"
                />
              )}
              {piece.images.length > 1 && (
                <Strip
                  label={`Images of ${piece.title}`}
                  thumbs={piece.images.map((img, i) => ({
                    thumb: img.thumb,
                    alt: i === 0 ? piece.title : `${piece.title} detail ${i}`,
                  }))}
                  selected={imageIndex}
                  onSelect={setImageIndex}
                  size="small"
                />
              )}
            </div>
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
  );
}
