import { useEffect, useState } from "react";
import type { ArtworkRow } from "../types";
import Emphasis from "./Emphasis";
import Popup from "./Popup";

interface StaticArtworkGalleryProps {
  rows: ArtworkRow[];
}

interface OpenState {
  row: ArtworkRow;
  index: number;
}

// Find the row and position of the artwork named by ?artwork=<slug>
const findArtwork = (rows: ArtworkRow[], slug: string | null) => {
  if (!slug) return null;
  for (const row of rows) {
    const index = row.pieces.findIndex((piece) => piece.slug === slug);
    if (index !== -1) return { row, index };
  }
  return null;
};

const updateUrl = (
  changes: Record<string, string | null>,
  mode: "push" | "replace" = "push",
) => {
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(changes)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  const query = params.toString();
  const newUrl = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  if (mode === "replace") window.history.replaceState({}, "", newUrl);
  else window.history.pushState({}, "", newUrl);
};

export default function StaticArtworkGallery({
  rows,
}: StaticArtworkGalleryProps) {
  const [open, setOpen] = useState<OpenState | null>(null);

  // Sync the open artwork from the URL, on load and on back/forward
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setOpen(findArtwork(rows, params.get("artwork")));
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [rows]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const openRow = (row: ArtworkRow) => {
    setOpen({ row, index: 0 });
    updateUrl({ artwork: row.pieces[0].slug });
  };

  const closePopup = () => {
    setOpen(null);
    updateUrl({ artwork: null });
  };

  const showPiece = (index: number) => {
    if (!open) return;
    setOpen({ row: open.row, index });
    updateUrl({ artwork: open.row.pieces[index].slug }, "replace");
  };

  return (
    <div>
      <div className="series-list">
        {rows.map((row) => (
          <button
            type="button"
            className="series-row"
            key={row.id}
            onClick={() => openRow(row)}
          >
            <div className="series-thumb">
              <img src={row.cover} alt={row.title} loading="lazy" />
            </div>
            <div className="series-text">
              <div className="series-category">{row.category}</div>
              <div className="series-heading">
                <span className="series-title">{row.title}</span>
                {row.years && <span className="series-years">{row.years}</span>}
              </div>
              {row.summary && (
                <div className="series-summary">
                  <Emphasis text={row.summary} />
                </div>
              )}
              {row.pieces.length > 1 && (
                <div className="series-count">{row.pieces.length} works</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {open && (
        <Popup
          row={open.row}
          index={open.index}
          onIndexChange={showPiece}
          onClose={closePopup}
        />
      )}
    </div>
  );
}
