import { PageHeader } from "@/app/components/page-header";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function FilesPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title="Files" 
        description="Manage your media files"
      >
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </PageHeader>
      
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">
          File management interface will be implemented here.
        </p>
      </div>
    </div>
  );
}