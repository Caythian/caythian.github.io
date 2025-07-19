"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Calendar } from "lucide-react";
import { type Post } from "@/lib/db";

interface BlogViewerProps {
  post: Post;
  onClose?: () => void;
  onEdit?: () => void;
}

export function BlogViewer({ post, onClose, onEdit }: BlogViewerProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">{post.title}</DialogTitle>
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center space-x-1">
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
        </div>
      </DialogHeader>

      <div className="space-y-6">
        {/* Banner Image */}
        {post.bannerImage && (
          <div className="relative aspect-video overflow-hidden rounded-lg border">
            <img
              src={`/api/image/${post.bannerImage}`}
              alt={post.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-img:rounded-lg prose-a:text-blue-600 prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-gray-500 [&_.ql-font-noto-serif]:font-serif [&_.ql-font-noto-serif-sc]:font-serif [&_.ql-font-playfair]:font-serif [&_.ql-size-title]:text-4xl [&_.ql-size-title]:font-bold [&_.ql-size-subtitle]:text-5xl [&_.ql-size-subtitle]:font-bold [&_.ql-size-body]:text-base [&_.ql-size-caption]:text-xs [&_.ql-size-caption]:text-gray-500"
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

