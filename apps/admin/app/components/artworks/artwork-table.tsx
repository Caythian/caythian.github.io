"use client"

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { type Artwork } from "@/lib/db";
import { deleteArtwork } from "@/lib/actions/artworks";
import { toast } from "sonner";
import { ArtworkForm } from "./artwork-form";
import { ArtworkViewer } from "./artwork-viewer";
import Image from "next/image";

interface ArtworkTableProps {
  artworks: Artwork[];
  onArtworkUpdate?: (artwork: Artwork) => void;
  onArtworkDelete?: (artworkId: number) => void;
}

export function ArtworkTable({ artworks, onArtworkUpdate, onArtworkDelete }: ArtworkTableProps) {
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [viewingArtwork, setViewingArtwork] = useState<Artwork | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  async function handleDelete(artwork: Artwork) {
    if (!confirm(`Are you sure you want to delete "${artwork.title}"?`)) {
      return;
    }

    setIsDeleting(artwork.id);
    try {
      const result = await deleteArtwork(artwork.id);
      if (result?.success) {
        toast.success("Artwork deleted successfully");
        onArtworkDelete?.(artwork.id);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete artwork");
    } finally {
      setIsDeleting(null);
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "painting": return "bg-blue-100 text-blue-800";
      case "sculpture": return "bg-green-100 text-green-800";
      case "installation": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Medium</TableHead>
              <TableHead>Dimension</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artworks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No artworks found. Create your first artwork!
                </TableCell>
              </TableRow>
            ) : (
              artworks.map((artwork) => (
                <TableRow key={artwork.id}>
                  <TableCell>
                    <button
                      onClick={() => setViewingArtwork(artwork)}
                      className="w-16 h-16 bg-muted rounded-md overflow-hidden hover:opacity-80 transition-opacity relative flex items-center justify-center"
                    >
                      <Image
                        src={`/api/files/${artwork.image}`}
                        alt={artwork.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = '<span class="text-xs text-muted-foreground">IMG</span>';
                          }
                        }}
                      />
                    </button>
                  </TableCell>
                  <TableCell className="font-medium">{artwork.title}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(artwork.category)}>
                      {artwork.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{artwork.time || "-"}</TableCell>
                  <TableCell>{artwork.medium || "-"}</TableCell>
                  <TableCell>{artwork.dimension || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewingArtwork(artwork)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingArtwork(artwork)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(artwork)}
                          disabled={isDeleting === artwork.id}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {isDeleting === artwork.id ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingArtwork} onOpenChange={() => setEditingArtwork(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editingArtwork && (
            <ArtworkForm 
              artwork={editingArtwork} 
              onClose={() => setEditingArtwork(null)}
              onSuccess={(updatedArtwork) => {
                onArtworkUpdate?.(updatedArtwork);
                setEditingArtwork(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Artwork Viewer */}
      <ArtworkViewer
        artwork={viewingArtwork}
        open={!!viewingArtwork}
        onClose={() => setViewingArtwork(null)}
      />
    </>
  );
}