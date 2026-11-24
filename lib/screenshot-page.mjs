import { escapeHTML, site } from "./site.mjs";

export function screenshotPage({ status = 200, imagePath, origin }) {
  const name = escapeHTML(site.name);
  const logo = escapeHTML(site.logo);
  const exists = status === 200;
  const title = exists ? "Screenshot" : status === 404 ? "Screenshot unavailable" : "Screenshot service unavailable";
  const publicImage = exists ? escapeHTML(origin + imagePath) : "";
  const contents = exists ? `
    <figure class="image-stage">
      <a href="${escapeHTML(imagePath)}" aria-label="Open full-size image"><img id="shared-image" src="${escapeHTML(imagePath)}" alt="Shared screenshot"></a>
      <p id="image-error" role="status" hidden>The image is unavailable.</p>
    </figure>` : `
    <section class="empty">
      <h1>${title}</h1>
      <p>${status === 404 ? "Check the link or ask the sender for a new one." : "Try opening the link again in a moment."}</p>
      <a class="secondary" href="/">Home</a>
    </section>`;

  return new Response(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#ffffff">
  <title>${title} · ${name}</title>
  <link rel="icon" href="${logo}" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">
  <script src="/share.js" defer></script>
  ${exists ? `<meta property="og:title" content="Screenshot · ${name}"><meta property="og:image" content="${publicImage}">` : ""}
</head>
<body class="screenshot-view">
  <header class="logo-bar">
    <a href="${escapeHTML(site.url)}" class="brand" aria-label="Visit ${name}’s website">
      <span class="brand-mark"><img src="${logo}" alt=""></span>
      <span>${name}</span>
    </a>
  </header>
  <main class="viewer">${contents}</main>
</body>
</html>`, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'self'; script-src 'self'; img-src 'self'; frame-ancestors 'none'; base-uri 'none'",
    },
  });
}
