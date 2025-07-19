"use client"

import { useState } from "react";
import { PageHeader } from "@/app/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { initializeDatabase, checkDatabaseTables } from "@/lib/actions/db-init";
import { toast } from "sonner";
import { Database, RefreshCw } from "lucide-react";

export default function DatabasePage() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [tableStatus, setTableStatus] = useState<{
    artworksExists: boolean;
    postsExists: boolean;
    tables: string[];
    error?: string;
  } | null>(null);

  async function handleInitialize() {
    setIsInitializing(true);
    try {
      await initializeDatabase();
      toast.success("Database initialized successfully");
      await handleCheck();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to initialize database");
    } finally {
      setIsInitializing(false);
    }
  }

  async function handleCheck() {
    setIsChecking(true);
    try {
      const status = await checkDatabaseTables();
      setTableStatus(status);
      if (status.error) {
        toast.error(`Database check failed: ${status.error}`);
      } else {
        toast.success("Database status checked");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to check database");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title="Database Management" 
        description="Initialize and manage your D1 database tables"
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Initialization
            </CardTitle>
            <CardDescription>
              Create the required tables for artworks and blog posts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will create the following tables in your D1 database:
            </p>
            <ul className="text-sm space-y-1">
              <li>• <code>artworks</code> - Store artwork information and metadata</li>
              <li>• <code>posts</code> - Store blog posts and content</li>
            </ul>
            <Button 
              onClick={handleInitialize} 
              disabled={isInitializing}
              className="w-full"
            >
              {isInitializing ? "Initializing..." : "Initialize Database"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Database Status
            </CardTitle>
            <CardDescription>
              Check the current status of your database tables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleCheck} 
              disabled={isChecking}
              variant="outline"
              className="w-full"
            >
              {isChecking ? "Checking..." : "Check Database Status"}
            </Button>

            {tableStatus && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Artworks Table:</span>
                  <Badge variant={tableStatus.artworksExists ? "default" : "secondary"}>
                    {tableStatus.artworksExists ? "Exists" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Posts Table:</span>
                  <Badge variant={tableStatus.postsExists ? "default" : "secondary"}>
                    {tableStatus.postsExists ? "Exists" : "Missing"}
                  </Badge>
                </div>
                {tableStatus.tables.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">All Tables:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tableStatus.tables.map((table) => (
                        <Badge key={table} variant="outline" className="text-xs">
                          {table}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {tableStatus.error && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    Error: {tableStatus.error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>After initializing the database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>1. Click "Initialize Database" to create the required tables</p>
            <p>2. Use "Check Database Status" to verify tables were created</p>
            <p>3. Navigate to Artworks or Blog sections to start adding content</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}