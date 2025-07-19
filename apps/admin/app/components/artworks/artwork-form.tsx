"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createArtwork, updateArtwork } from "@/lib/actions/artworks";
import { toast } from "sonner";
import { type Artwork } from "@/lib/db";

interface ArtworkFormProps {
  artwork?: Artwork;
  onClose?: () => void;
  onSuccess?: (artwork: Artwork) => void;
}

export function ArtworkForm({ artwork, onClose, onSuccess }: ArtworkFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!artwork;

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      let result;
      if (isEditing && artwork) {
        result = await updateArtwork(artwork.id, formData);
        toast.success("Artwork updated successfully");
      } else {
        result = await createArtwork(formData);
        toast.success("Artwork created successfully");
      }
      
      if (result?.success && result.artwork && onSuccess) {
        onSuccess(result.artwork);
      }
      onClose?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Artwork" : "Create New Artwork"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Update the artwork details" : "Add a new artwork to your collection"}
        </DialogDescription>
      </DialogHeader>
      <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={artwork?.title}
                required
                placeholder="Enter artwork title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select name="category" defaultValue={artwork?.category} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="sculpture">Sculpture</SelectItem>
                  <SelectItem value="installation">Installation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                defaultValue={artwork?.time || ""}
                placeholder="e.g., 2023"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medium">Medium</Label>
              <Input
                id="medium"
                name="medium"
                defaultValue={artwork?.medium || ""}
                placeholder="e.g., Oil on canvas"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dimension">Dimension</Label>
              <Input
                id="dimension"
                name="dimension"
                defaultValue={artwork?.dimension || ""}
                placeholder="e.g., 24 x 36 inches"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={artwork?.description?.join('\n') || ""}
              placeholder="Enter artwork description (use new lines for multiple paragraphs)"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image">Main Image {!isEditing && "*"}</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                required={!isEditing}
              />
              {isEditing && (
                <p className="text-sm text-muted-foreground">
                  Leave empty to keep current image
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="details">Detail Images</Label>
              <Input
                id="details"
                name="details"
                type="file"
                accept="image/*"
                multiple
              />
              {isEditing && (
                <p className="text-sm text-muted-foreground">
                  Leave empty to keep current detail images
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (isEditing ? "Update Artwork" : "Create Artwork")}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </form>
    </>
  );
}