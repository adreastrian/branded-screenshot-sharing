# Branded Screenshot Sharing

A branded screenshot viewer for [ss.sarkarripon.com](https://ss.sarkarripon.com), hosted on Netlify. Macshot uploads screenshots to a private Backblaze B2 bucket. Netlify Functions serve shared images using a read-only application key scoped to `shared-screenshots/`.

## Build

```sh
npm ci
npm run build
```

The Netlify configuration builds the landing page into `dist/` and bundles the viewer and image functions. Set `B2_KEY_ID` and `B2_APPLICATION_KEY` as runtime environment variables in Netlify. `B2_REGION` and `B2_BUCKET` can override the defaults in the source. Legacy short links use the original site's `screenshot-links` Netlify Blobs store.
