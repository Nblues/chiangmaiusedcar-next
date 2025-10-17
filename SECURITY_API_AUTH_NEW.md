# API Authentication (Programmatic Access)

To raise the security score and protect state-changing APIs, we added API-key + HMAC authentication for programmatic
clients. Admin dashboard continues to use session + CSRF.

## Headers required

- X-API-Key: your API key
- X-Timestamp: ISO string or Unix epoch (ms or s)
- X-Signature: HMAC-SHA256 of canonical string using API secret

## Environment variables (Vercel)

- API_KEY: strong random key (no CR/LF; trailing spaces trimmed)
- API_SECRET: strong random secret for HMAC

## Canonical string

METHOD + "\n" + URL_PATH_AND_QUERY + "\n" + X-Timestamp + "\n" + SHA256(body)

Clock skew: ±5 minutes allowed.

Verification helper: GET /api/\_auth-check returns 200 when headers are correct.

## Protected endpoints (session OR API auth)

- POST /api/admin/cars/toggle-status
- POST /api/maintenance/enable
- POST /api/maintenance/disable
- POST /api/backup/create
- POST /api/backup/automated
- GET/POST /api/revalidate also accepts API auth

## Session vs API rules

- Session authenticated requests must include valid CSRF headers for unsafe methods.
- API authenticated requests skip CSRF.

## Key rotation tips

- Rotate keys by deploying with new API_KEY/API_SECRET, update clients, then revoke old keys.

## Example signature (Node.js)

1. payloadHash = sha256(JSON.stringify(body))
2. canonical = `${method}\n${pathWithQuery}\n${timestamp}\n${payloadHash}`
3. signature = HMAC_SHA256(canonical, API_SECRET)

## Troubleshooting

- 401 Invalid API key: ensure X-API-Key matches API_KEY exactly.
- 401 Stale timestamp: ensure X-Timestamp is within ±5 minutes and synchronized.
- 401 Invalid signature: recompute signature with the exact path+query and body.
