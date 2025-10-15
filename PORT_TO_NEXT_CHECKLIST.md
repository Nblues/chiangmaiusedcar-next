# Port to chiangmaiusedcar-next (Plan A)

Files to copy/update in the live project:

- lib/carStatusStore.js
- pages/api/analytics.js
- pages/api/admin/cars/list.js
- pages/api/admin/cars/toggle-status.js
- pages/all-cars.jsx (status merge via readCarStatuses())
- pages/car/[handle].jsx (status merge + image optimizations)
- middleware.ts (ensure /api/admin is matched and public APIs unaffected)
- next.config.js (headers/CORS/images allow Shopify + analytics; keep redirects)

Acceptance checks after deploy:

- GET https://www.chiangmaiusedcar.com/api/ping => 200 "pong"
- GET https://www.chiangmaiusedcar.com/api/runtime-check => { ok: true }
- Admin login works; /api/admin/verify => 200
- Toggle reserved writes to Shopify metafield if token present; otherwise falls back to /tmp store (no 500)
- POST /api/analytics with string body => 200
