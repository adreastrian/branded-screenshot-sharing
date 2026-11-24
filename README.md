# Branded Screenshot Sharing

A branded screenshot-sharing site at [ss.sarkarripon.com](https://ss.sarkarripon.com).

## Hosting

- **Backblaze B2** stores the screenshots in a private bucket. Macshot uploads the files there.
- **Netlify** hosts the landing page and screenshot viewer. Netlify Functions serve shared images from Backblaze B2 using a read-only application key scoped to `shared-screenshots/`.

## Build

```sh
npm ci
npm run build
```

The Netlify configuration builds the landing page into `dist/` and bundles the viewer and image functions. Set `B2_KEY_ID` and `B2_APPLICATION_KEY` as runtime environment variables in Netlify. `B2_REGION` and `B2_BUCKET` can override the defaults in the source. Legacy short links use the original site's `screenshot-links` Netlify Blobs store.
