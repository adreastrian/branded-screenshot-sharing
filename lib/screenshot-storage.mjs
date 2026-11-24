import { GetObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";

const sharedPrefix = "shared-screenshots/";
const imageTypes = new Map([
  ["avif", "image/avif"],
  ["bmp", "image/bmp"],
  ["gif", "image/gif"],
  ["heic", "image/heic"],
  ["jpeg", "image/jpeg"],
  ["jpg", "image/jpeg"],
  ["png", "image/png"],
  ["tif", "image/tiff"],
  ["tiff", "image/tiff"],
  ["webp", "image/webp"],
]);

const region = process.env.B2_REGION || "us-east-005";
const bucket = process.env.B2_BUCKET || "macshotss";
const accessKeyId = process.env.B2_KEY_ID;
const secretAccessKey = process.env.B2_APPLICATION_KEY;
const storage = accessKeyId && secretAccessKey ? new S3Client({
  endpoint: 'https://s3.' + region + '.backblazeb2.com',
  region,
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
  responseChecksumValidation: "WHEN_REQUIRED",
  maxAttempts: 2,
}) : null;

export function failure(status, text, headers = {}) {
  return new Response(text, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export function decodeKey(path) {
  try {
    return decodeURIComponent(path);
  } catch {
    return "";
  }
}

export function getImageType(key) {
  if (!key.startsWith(sharedPrefix) || /[\\\x00-\x1f\x7f]|(?:^|\/)\.{1,2}(?:\/|$)/.test(key)) return;
  return imageTypes.get(/\.([a-z0-9]+)$/i.exec(key)?.[1].toLowerCase());
}

export async function imageResponse(key, method) {
  const contentType = getImageType(key);
  if (!contentType) return failure(404, "Image not found");
  if (!storage) return failure(503, "Image sharing is not configured");

  try {
    const isHead = method === "HEAD";
    const Command = isHead ? HeadObjectCommand : GetObjectCommand;
    const object = await storage.send(new Command({ Bucket: bucket, Key: key }));
    const headers = new Headers({
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=60",
      "Netlify-CDN-Cache-Control": "public, s-maxage=300",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    });
    if (object.ContentLength !== undefined) headers.set("Content-Length", String(object.ContentLength));
    return new Response(isHead ? null : object.Body.transformToWebStream(), { headers });
  } catch (error) {
    if (error.name === "NoSuchKey" || error.name === "AccessDenied" || error.$metadata?.httpStatusCode === 404) {
      return failure(404, "Image not found");
    }
    console.error("Backblaze image request failed", error.name, error.$metadata?.httpStatusCode);
    return failure(502, "Image storage is temporarily unavailable");
  }
}
