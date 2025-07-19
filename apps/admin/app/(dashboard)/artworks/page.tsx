"use client"

import { useState, useEffect } from "react";
import { PageHeader } from "@/app/components/page-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ArtworkForm } from "@/app/components/artworks/artwork-form";
import { ArtworkTable } from "@/app/components/artworks/artwork-table";
import { getArtworks } from "@/lib/actions/artworks";
import { type Artwork } from "@/lib/db";

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadArtworks() {
      try {
        const data = await getArtworks();
        setArtworks(data);
      } catch (error) {
        console.error("Failed to load artworks:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadArtworks();
  }, []);

  const handleArtworkCreated = (newArtwork: Artwork) => {
    setArtworks(prev => [newArtwork, ...prev]);
    setIsCreateDialogOpen(false);
  };

  const handleArtworkUpdated = (updatedArtwork: Artwork) => {
    setArtworks(prev => prev.map(artwork => 
      artwork.id === updatedArtwork.id ? updatedArtwork : artwork
    ));
  };

  const handleArtworkDeleted = (artworkId: number) => {
    setArtworks(prev => prev.filter(artwork => artwork.id !== artworkId));
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title="Artworks" 
        description="Manage your artwork collection"
      >
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Artwork
        </Button>
      </PageHeader>
      
      {isLoading ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Loading artworks...</p>
        </div>
      ) : (
        <ArtworkTable 
          artworks={artworks}
          onArtworkUpdate={handleArtworkUpdated}
          onArtworkDelete={handleArtworkDeleted}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ArtworkForm 
            onClose={() => setIsCreateDialogOpen(false)}
            onSuccess={handleArtworkCreated}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}