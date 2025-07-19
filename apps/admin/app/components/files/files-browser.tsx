"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Image as ImageIcon, 
  File, 
  Download,
  Eye,
  Calendar,
  HardDrive
} from "lucide-react";
import { type FileItem } from "@/app/(dashboard)/files/page";

interface FilesBrowserProps {
  files: FileItem[];
}

export function FilesBrowser({ files }: FilesBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [viewingFile, setViewingFile] = useState<FileItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.key.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === "all" || 
                      (selectedTab === "images" && file.type === "image") ||
                      (selectedTab === "other" && file.type === "other");
    return matchesSearch && matchesTab;
  });

  const imageFiles = files.filter(file => file.type === "image");
  const otherFiles = files.filter(file => file.type === "other");

  const handleView = (file: FileItem) => {
    setViewingFile(file);
    setIsViewDialogOpen(true);
  };

  const handleDownload = (file: FileItem) => {
    const link = document.createElement('a');
    link.href = `/api/files/${file.key}`;
    link.download = file.key;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (files.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <HardDrive className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No files found</h3>
        <p className="text-muted-foreground">
          Upload some artwork or blog images to see them here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Search and Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">
                All ({files.length})
              </TabsTrigger>
              <TabsTrigger value="images">
                <ImageIcon className="mr-1 h-3 w-3" />
                Images ({imageFiles.length})
              </TabsTrigger>
              <TabsTrigger value="other">
                <File className="mr-1 h-3 w-3" />
                Other ({otherFiles.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Files Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.key}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {file.type === "image" ? (
                        <ImageIcon className="h-4 w-4 text-blue-500" />
                      ) : (
                        <File className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium truncate max-w-[200px]">
                        {file.key}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={file.type === "image" ? "default" : "secondary"}>
                      {file.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(file.lastModified)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {file.type === "image" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(file)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredFiles.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No files found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Image Viewer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          {viewingFile && (
            <div className="space-y-4">
              <DialogTitle className="sr-only">View Image: {viewingFile.key}</DialogTitle>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{viewingFile.key}</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{formatFileSize(viewingFile.size)}</span>
                  <span>•</span>
                  <span>{formatDate(viewingFile.lastModified)}</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <img
                  src={`/api/files/${viewingFile.key}`}
                  alt={viewingFile.key}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';
                  }}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleDownload(viewingFile)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}