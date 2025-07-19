"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { type Artwork } from "@/lib/db";
import Image from "next/image";

interface ArtworkViewerProps {
  artwork: Artwork | null;
  open: boolean;
  onClose: () => void;
}

export function ArtworkViewer({ artwork, open, onClose }: ArtworkViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState<boolean>(false);

  if (!artwork) return null;

  // Combine main image and detail images
  const allImages = [artwork.image, ...(artwork.details || [])];
  const currentImage = allImages[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    setIsZoomed(false);
    setImageError(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setIsZoomed(false);
    setImageError(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "painting": return "bg-blue-100 text-blue-800";
      case "sculpture": return "bg-green-100 text-green-800";
      case "installation": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">{artwork.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getCategoryColor(artwork.category)}>
                    {artwork.category}
                  </Badge>
                  {artwork.time && (
                    <span className="text-sm text-muted-foreground">{artwork.time}</span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Image Viewer */}
            <div className="flex-1 relative bg-black flex items-center justify-center">
              {currentImage && !imageError ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={`/api/files/${currentImage}`}
                    alt={`${artwork.title} - Image ${currentImageIndex + 1}`}
                    fill
                    className={`object-contain transition-transform duration-200 ${
                      isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                    onError={() => setImageError(true)}
                    priority
                  />
                  
                  {/* Image Navigation */}
                  {allImages.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Zoom Toggle */}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-0"
                    onClick={() => setIsZoomed(!isZoomed)}
                  >
                    {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                  </Button>

                  {/* Image Counter */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-lg">Image not available</p>
                    <p className="text-sm text-gray-300 mt-2">
                      File: {currentImage}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Details Panel */}
            <div className="w-80 bg-background border-l overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Details</h3>
                  
                  {artwork.medium && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Medium</dt>
                      <dd className="text-sm">{artwork.medium}</dd>
                    </div>
                  )}
                  
                  {artwork.dimension && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Dimensions</dt>
                      <dd className="text-sm">{artwork.dimension}</dd>
                    </div>
                  )}
                  
                  {artwork.time && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Year</dt>
                      <dd className="text-sm">{artwork.time}</dd>
                    </div>
                  )}
                </div>

                {/* Description */}
                {artwork.description && artwork.description.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Description</h3>
                    <div className="space-y-2">
                      {artwork.description.map((paragraph, index) => (
                        <p key={index} className="text-sm text-muted-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Thumbnails */}
                {allImages.length > 1 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">All Images</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setIsZoomed(false);
                          }}
                          className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                            index === currentImageIndex
                              ? "border-primary"
                              : "border-transparent hover:border-muted-foreground"
                          }`}
                        >
                          <Image
                            src={`/api/files/${image}`}
                            alt={`${artwork.title} - Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
                              Main
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}