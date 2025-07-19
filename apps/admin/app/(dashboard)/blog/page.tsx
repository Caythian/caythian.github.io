"use client"

import { useState, useEffect } from "react";
import { PageHeader } from "@/app/components/page-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { BlogForm } from "@/app/components/blog/blog-form";
import { BlogTable } from "@/app/components/blog/blog-table";
import { getPosts } from "@/lib/actions/blogs";
import { type Post } from "@/lib/db";

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPosts();
  }, []);

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setIsCreateDialogOpen(false);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handlePostDeleted = (postId: number) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title="Blog Posts" 
        description="Manage your blog content"
      >
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </PageHeader>
      
      {isLoading ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      ) : (
        <BlogTable 
          posts={posts}
          onPostUpdate={handlePostUpdated}
          onPostDelete={handlePostDeleted}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <BlogForm 
            onClose={() => setIsCreateDialogOpen(false)}
            onSuccess={handlePostCreated}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}