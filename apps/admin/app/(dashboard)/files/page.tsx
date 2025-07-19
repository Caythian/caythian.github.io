"use client"

import { useState, useEffect } from "react";
import { PageHeader } from "@/app/components/page-header";
import { FilesBrowser } from "@/app/components/files/files-browser";
import { getFiles } from "@/lib/actions/files";

export interface FileItem {
  key: string;
  size: number;
  lastModified: Date;
  type: 'image' | 'other';
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFiles() {
      try {
        const data = await getFiles();
        setFiles(data);
      } catch (error) {
        console.error("Failed to load files:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadFiles();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title="Files" 
        description="Browse artwork and blog assets stored in R2"
      />
      
      {isLoading ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Loading files...</p>
        </div>
      ) : (
        <FilesBrowser files={files} />
      )}
    </div>
  );
}