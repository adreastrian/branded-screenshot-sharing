# Branded Screenshot Sharing

A branded screenshot-sharing site at [ss.sarkarripon.com](https://ss.sarkarripon.com).

I use [macshot](https://github.com/sw33tLie/macshot) to capture screenshots on macOS and upload them to Backblaze B2.

## Hosting

- **Backblaze B2** stores the screenshots in a private bucket.
- **Netlify** hosts the landing page and screenshot viewer. Netlify Functions serve shared images from Backblaze B2 using a read-only application key scoped to `shared-screenshots/`.

## Build

```sh
npm ci
npm run build
```

The Netlify configuration builds the landing page into `dist/` and bundles the viewer and image functions. Set `B2_KEY_ID` and `B2_APPLICATION_KEY` as runtime environment variables in Netlify. `B2_REGION` and `B2_BUCKET` can override the defaults in the source. Legacy short links use the original site's `screenshot-links` Netlify Blobs store.

## Run your own copy

To serve screenshots under your own name, deploy a copy of this repository to Netlify and set these environment variables. Without them, the site uses the defaults in `lib/site.mjs`.

| Variable | Value |
| --- | --- |
| `SITE_NAME` | The name in the header, page titles, and link previews. |
| `SITE_URL` | The page the header name links to. |
| `SITE_LOGO` | The logo path, for example `/logo.svg` for a file in `public/`. |
| `SITE_LEGACY_LINKS` | `false`. Other sites have none of the original site's old short links. |
| `B2_KEY_ID`, `B2_APPLICATION_KEY` | A read-only Backblaze B2 key scoped to `shared-screenshots/`. |
| `B2_BUCKET`, `B2_REGION` | Your bucket name and its region. |

The landing page reads the `SITE_*` variables at build time. After you change one, redeploy the site.
