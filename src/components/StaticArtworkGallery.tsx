import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { generateSlug } from "../lib/utils";
import type { Artwork } from "../types";
import Filter from "./Filter";
import Popup from "./Popup";

type SortMode = "time-desc" | "time-asc" | "title-asc" | "title-desc";

interface ProcessedArtwork extends Artwork {
  url: string;
  aspectRatio?: number;
  isLoading?: boolean;
}

interface StaticArtworkGalleryProps {
  artworks: Artwork[];
}

export default function StaticArtworkGallery({
  artworks,
}: StaticArtworkGalleryProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("time-desc");

  // Pre-process artworks with image URLs and dimension detection
  const [processedArtworks, setProcessedArtworks] = useState<
    ProcessedArtwork[]
  >([]);

  useEffect(() => {
    if (selectedArtwork) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedArtwork]);

  // Initialize state from URL params
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const artworkSlug = params.get("artwork");
    const sort = params.get("sort");

    // Set filter from URL
    if (
      category &&
      ["painting", "sculpture", "installation", "other"].includes(category)
    ) {
      setSelectedFilter(category);
    }

    if (
      sort === "title-asc" ||
      sort === "title-desc" ||
      sort === "time-asc" ||
      sort === "time-desc"
    ) {
      setSortMode(sort);
    }

    // Set selected artwork from URL (only if processedArtworks is ready)
    if (artworkSlug && processedArtworks.length > 0) {
      const artwork = processedArtworks.find(
        (artwork) => generateSlug(artwork.title, artwork.id) === artworkSlug,
      );
      if (artwork) {
        setSelectedArtwork(artwork);
        setCurrentDetailIndex(0);
      }
    }
  }, [processedArtworks]);

  const getImageDimensions = (
    src: string,
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  useEffect(() => {
    const processArtworks = async () => {
      const initialArtworks: ProcessedArtwork[] = artworks.map((artwork) => ({
        ...artwork,
        url: artwork.image, // Already resolved URL
        isLoading: true,
        // Explicitly preserve details to ensure they're not lost
        details: artwork.details,
      }));

      setProcessedArtworks(initialArtworks);

      // Load image dimensions in batches to avoid overwhelming the browser
      const batchSize = 5;
      for (let i = 0; i < initialArtworks.length; i += batchSize) {
        const batch = initialArtworks.slice(i, i + batchSize);

        const batchPromises = batch.map(async (artwork, index) => {
          try {
            const dimensions = await getImageDimensions(artwork.url);
            const aspectRatio = (dimensions.height / dimensions.width) * 100;
            return {
              index: i + index,
              aspectRatio,
              isLoading: false,
            };
          } catch (error) {
            console.warn(
              `Failed to load dimensions for ${artwork.title}:`,
              error,
            );
            return {
              index: i + index,
              aspectRatio: 75, // Default 4:3 aspect ratio
              isLoading: false,
            };
          }
        });

        const results = await Promise.all(batchPromises);

        setProcessedArtworks((prev) => {
          const updated = [...prev];
          results.forEach((result) => {
            updated[result.index] = {
              ...updated[result.index],
              aspectRatio: result.aspectRatio,
              isLoading: result.isLoading,
            };
          });
          return updated;
        });
      }
    };

    processArtworks();
  }, [artworks]);

  // Filter artworks based on selected category
  const filteredArtworks = useMemo(() => {
    if (!selectedFilter) return processedArtworks;
    return processedArtworks.filter(
      (artwork) => artwork.category === selectedFilter,
    );
  }, [processedArtworks, selectedFilter]);

  const sortedArtworks = useMemo(() => {
    const byTitleAsc = (a: ProcessedArtwork, b: ProcessedArtwork) => {
      const cmp = a.title.localeCompare(b.title, undefined, {
        sensitivity: "base",
        numeric: true,
      });
      if (cmp !== 0) return cmp;
      return (a.id || "").localeCompare(b.id || "");
    };
    const byTitleDesc = (a: ProcessedArtwork, b: ProcessedArtwork) =>
      byTitleAsc(b, a);

    const byTimeDesc = (a: ProcessedArtwork, b: ProcessedArtwork) => {
      // Put artworks without a time at the end
      if (!a.time && !b.time) return byTitleDesc(a, b);
      if (!a.time) return 1;
      if (!b.time) return -1;

      const timeA = Number.parseInt(a.time, 10);
      const timeB = Number.parseInt(b.time, 10);
      if (Number.isFinite(timeA) && Number.isFinite(timeB) && timeA !== timeB) {
        return timeB - timeA;
      }
      return byTitleDesc(a, b);
    };

    const byTimeAsc = (a: ProcessedArtwork, b: ProcessedArtwork) => {
      // Put artworks without a time at the end
      if (!a.time && !b.time) return byTitleDesc(a, b);
      if (!a.time) return 1;
      if (!b.time) return -1;

      const timeA = Number.parseInt(a.time, 10);
      const timeB = Number.parseInt(b.time, 10);
      if (Number.isFinite(timeA) && Number.isFinite(timeB) && timeA !== timeB) {
        return timeA - timeB;
      }
      return byTitleDesc(a, b);
    };

    const copy = [...filteredArtworks];
    if (sortMode === "title-asc") return copy.sort(byTitleAsc);
    if (sortMode === "title-desc") return copy.sort((a, b) => byTitleAsc(b, a));
    if (sortMode === "time-asc") return copy.sort(byTimeAsc);
    return copy.sort(byTimeDesc);
  }, [filteredArtworks, sortMode]);

  const handleFilter = (filterType: string | null) => {
    setSelectedFilter(filterType);

    // Update URL with filter
    const params = new URLSearchParams(window.location.search);
    if (filterType) {
      params.set("category", filterType);
    } else {
      params.delete("category");
    }
    // Keep artwork param if it exists
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.pushState({}, "", newUrl);
  };

  const handleSortChange = (nextSort: SortMode) => {
    setSortMode(nextSort);

    const params = new URLSearchParams(window.location.search);
    params.set("sort", nextSort);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  const openModal = (artwork: ProcessedArtwork) => {
    setSelectedArtwork(artwork);
    setCurrentDetailIndex(0);

    // Update URL with artwork
    const params = new URLSearchParams(window.location.search);
    const artworkSlug = generateSlug(artwork.title, artwork.id);
    params.set("artwork", artworkSlug);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  const closeModal = () => {
    setSelectedArtwork(null);

    // Remove artwork from URL, keep category
    const params = new URLSearchParams(window.location.search);
    params.delete("artwork");
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.pushState({}, "", newUrl);
  };

  const goToPrevious = () => {
    setCurrentDetailIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : getDetailImageUrls().length - 1,
    );
  };

  const goToNext = () => {
    setCurrentDetailIndex((nextIndex) =>
      nextIndex < getDetailImageUrls().length - 1 ? nextIndex + 1 : 0,
    );
  };

  const getDetailImageUrls = () => {
    const urls: string[] = [];
    if (selectedArtwork) {
      // Always include the main image first
      urls.push(selectedArtwork.image);
      // Add detail images if they exist
      if (selectedArtwork.details && Array.isArray(selectedArtwork.details) && selectedArtwork.details.length > 0) {
        selectedArtwork.details.forEach((detail) => {
          // Ensure detail is a string (URL)
          if (detail && typeof detail === 'string') {
            urls.push(detail);
          } else if (detail && typeof detail === 'object' && detail.src) {
            // Handle case where detail might be an Image object
            urls.push(detail.src);
          }
        });
      }
    }
    return urls;
  };

  return (
    <div>
      <div className="artwork-controls">
        <Filter onFilter={handleFilter} selectedFilter={selectedFilter} />
        <label className="sort-control">
          <span className="sort-control-label">Sort</span>
          <select
            className="sort-control-select"
            value={sortMode}
            onChange={(e) => handleSortChange(e.target.value as SortMode)}
            aria-label="Sort artworks"
          >
            <option value="title-asc">Title (A to Z)</option>
            <option value="title-desc">Title (Z to A)</option>
            <option value="time-desc">Time (Newest)</option>
            <option value="time-asc">Time (Oldest)</option>
          </select>
        </label>
      </div>

      <div className="artworkgallery-wrapper">
        {sortedArtworks.map((artwork, index) => (
          <button
            type="button"
            className={`artworkgallery ${artwork.isLoading ? "loading" : ""}`}
            key={artwork.id || index}
            onClick={() => openModal(artwork)}
            style={
              {
                "--aspect-ratio": artwork.aspectRatio
                  ? `${artwork.aspectRatio}%`
                  : "75%",
                border: "none",
                fontSize: "inherit",
                padding: 0,
                background: "transparent",
              } as React.CSSProperties
            }
          >
            <div className="artworkgallery-content">
              {artwork.isLoading ? (
                <div className="skeleton" />
              ) : (
                <img
                  src={artwork.url}
                  alt={artwork.title}
                  loading="lazy"
                  className="artwork-image"
                  onError={(e) => {
                    console.warn(`Failed to load image for ${artwork.title}`);
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div className="overlay">{artwork.title}</div>
            </div>
          </button>
        ))}
      </div>

      {sortedArtworks.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#001125" }}>
          No artworks found for the selected category.
        </div>
      )}

      <Popup
        selectedArtwork={selectedArtwork}
        closeModal={closeModal}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
        getDetailImageUrls={getDetailImageUrls}
        currentDetailIndex={currentDetailIndex}
      />
    </div>
  );
}
