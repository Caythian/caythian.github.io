import { PageHeader } from "@/app/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title="Blog" 
        description="Manage your blog posts"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </PageHeader>
      
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">
          Blog management interface will be implemented here.
        </p>
      </div>
    </div>
  );
}