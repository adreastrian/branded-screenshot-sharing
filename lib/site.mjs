// Branding for the landing page and screenshot viewer. Environment variables
// override these defaults, so another site can rebrand without editing code.
const env = process.env;

export const site = {
  name: env.SITE_NAME || "adreastrian",
  url: env.SITE_URL || "https://github.com/adreastrian",
  logo: env.SITE_LOGO || "/logo.svg",
  // Resolves links shared from the original site (ss.sarkarripon.com) before it
  // moved to Backblaze B2. This site has none, so they stay off by default.
  legacyLinks: env.SITE_LEGACY_LINKS === "true",
};

export function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}
