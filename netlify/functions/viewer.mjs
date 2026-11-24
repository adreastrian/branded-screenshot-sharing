import { getStore } from "@netlify/blobs";
import { decodeKey, failure, getImageType, imageResponse } from "../../lib/screenshot-storage.mjs";
import { screenshotPage } from "../../lib/screenshot-page.mjs";

export const config = { path: ["/view/*", "/image/*", "/:slug"], preferStatic: true };

export default async function viewer(request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return failure(405, "Method not allowed", { Allow: "GET, HEAD" });
  }

  const { pathname, origin } = new URL(request.url);
  const raw = pathname.startsWith("/image/");
  const name = pathname.slice(raw ? 7 : 1);
  let key;
  try {
    if (pathname.startsWith("/view/")) {
      key = decodeKey(pathname.slice(6));
    } else if (name === "2g60m6i2g.png") {
      key = "shared-screenshots/2026/11/21/g60m6i2g.png";
    } else if (/^[a-z0-9]{8}\.png$/.test(name)) {
      key = "shared-screenshots/" + name;
    } else if (/^[a-z0-9]{10}$/.test(name)) {
      // Existing links still resolve from the old lookup table.
      key = await getStore({ name: "screenshot-links", consistency: "strong" }).get(name);
    }
    if (!key || !getImageType(key)) {
      return raw ? failure(404, "Image not found") : screenshotPage({ status: 404 });
    }
    if (raw) return imageResponse(key, request.method);
    const file = await imageResponse(key, "HEAD");
    if (!file.ok) return screenshotPage({ status: file.status });
    const imagePath = "/s/" + key.split("/").map(encodeURIComponent).join("/");
    return screenshotPage({ origin, imagePath });
  } catch (error) {
    console.error("Screenshot request failed", error.name);
    return raw ? failure(502, "Image storage is temporarily unavailable") : screenshotPage({ status: 502 });
  }
}
