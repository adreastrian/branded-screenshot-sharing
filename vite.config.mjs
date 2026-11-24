import { defineConfig } from "vite";
import { escapeHTML, site } from "./lib/site.mjs";

const placeholders = {
  SITE_NAME: site.name,
  SITE_URL: site.url,
  SITE_LOGO: site.logo,
};

export default defineConfig({
  plugins: [{
    name: "site-branding",
    // Runs before Vite resolves asset URLs, so the logo path is real by then.
    transformIndexHtml: {
      order: "pre",
      handler: (html) =>
        html.replace(/\{\{(\w+)\}\}/g, (match, key) => key in placeholders ? escapeHTML(placeholders[key]) : match),
    },
  }],
});
