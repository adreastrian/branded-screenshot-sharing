// Branding for the landing page and screenshot viewer. Environment variables
// override these defaults, so another site can rebrand without editing code.
const env = process.env;

export const site = {
  name: env.SITE_NAME || "Sarkar Ripon",
  url: env.SITE_URL || "https://sarkarripon.com/",
  logo: env.SITE_LOGO || "/sarkar-logo.svg",
  // Resolves links shared from the original site before it moved to Backblaze B2.
  // Other sites have no such links and can set SITE_LEGACY_LINKS=false.
  legacyLinks: env.SITE_LEGACY_LINKS !== "false",
};

export function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}
