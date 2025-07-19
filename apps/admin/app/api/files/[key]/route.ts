import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { env } = getCloudflareContext();
    const { key } = await params;
    
    const object = await env.BUCKET.get(key);
    
    if (!object) {
      return new NextResponse("File not found", { status: 404 });
    }
    
    // Get the content type from the object
    const contentType = object.httpMetadata?.contentType || "application/octet-stream";
    
    const headers = new Headers();
    headers.set("content-type", contentType);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    
    // Add CORS headers for cross-origin requests
    headers.set("access-control-allow-origin", "*");
    headers.set("access-control-allow-methods", "GET");
    
    return new NextResponse(object.body, {
      headers,
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}