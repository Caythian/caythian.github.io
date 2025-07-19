"use client"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, Calendar } from "lucide-react";
import { type Post } from "@/lib/db";

interface BlogViewerProps {
  post: Post;
  onClose?: () => void;
  onEdit?: () => void;
}

export function BlogViewer({ post, onClose, onEdit }: BlogViewerProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">{post.title}</DialogTitle>
        <DialogDescription className="flex items-center gap-4">
          <div className="flex items-center space-x-1 text-sm">
            <Calendar className="h-3 w-3" />
            <span>Published {formatDate(post.publishedAt)}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Banner Image */}
        {post.bannerImage && (
          <div className="relative aspect-video overflow-hidden rounded-lg border">
            <img
              src={`/api/files/${post.bannerImage}`}
              alt={post.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          {onEdit && (
            <Button onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Post
            </Button>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </>
  );
}