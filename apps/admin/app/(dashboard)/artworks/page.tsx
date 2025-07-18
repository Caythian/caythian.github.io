import { PageHeader } from "@/app/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ArtworksPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title="Artworks" 
        description="Manage your artwork collection"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Artwork
        </Button>
      </PageHeader>
      
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">
          Artwork management interface will be implemented here.
        </p>
      </div>
    </div>
  );
}