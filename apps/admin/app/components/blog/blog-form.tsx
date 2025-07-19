"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createPost, updatePost } from "@/lib/actions/blogs";
import { toast } from "sonner";
import { type Post } from "@/lib/db";
import { RichTextEditor } from "@/app/components/editor/rich-text-editor";

interface BlogFormProps {
  post?: Post;
  onClose?: () => void;
  onSuccess?: (post: Post) => void;
}

export function BlogForm({ post, onClose, onSuccess }: BlogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState(post?.content || "");
  const isEditing = !!post;

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    
    // Add the rich text content to the form data
    formData.set("content", content);
    
    try {
      let result;
      if (isEditing && post) {
        result = await updatePost(post.id, formData);
        toast.success("Post updated successfully");
      } else {
        result = await createPost(formData);
        toast.success("Post created successfully");
      }
      
      if (result?.success && result.post && onSuccess) {
        onSuccess(result.post);
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
        <DialogTitle>{isEditing ? "Edit Post" : "Create New Post"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Update the blog post" : "Create a new blog post"}
        </DialogDescription>
      </DialogHeader>
      
      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={post?.title}
              required
              placeholder="Enter post title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="publishedAt">Publish Date *</Label>
            <Input
              id="publishedAt"
              name="publishedAt"
              type="date"
              defaultValue={
                post?.publishedAt 
                  ? new Date(post.publishedAt).toISOString().split('T')[0] 
                  : new Date().toISOString().split('T')[0]
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            defaultValue={post?.tags?.join(", ") || ""}
            placeholder="Enter tags separated by commas"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bannerImage">Banner Image {!isEditing && "*"}</Label>
          <Input
            id="bannerImage"
            name="bannerImage"
            type="file"
            accept="image/*"
            required={!isEditing}
          />
          {isEditing && (
            <p className="text-sm text-muted-foreground">
              Leave empty to keep current banner image
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Content *</Label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Write your blog post content..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (isEditing ? "Update Post" : "Create Post")}
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