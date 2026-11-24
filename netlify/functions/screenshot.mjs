import { decodeKey, failure, imageResponse } from "../../lib/screenshot-storage.mjs";

export const config = { path: "/s/*" };

export default function screenshot(request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return failure(405, "Method not allowed", { Allow: "GET, HEAD" });
  }

  const pathname = new URL(request.url).pathname;
  if (!pathname.startsWith("/s/")) return failure(404, "Image not found");
  return imageResponse(decodeKey(pathname.slice(3)), request.method);
}
