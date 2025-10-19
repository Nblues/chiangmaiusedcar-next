# API Authentication (Programmatic Access)

To raise the security score and protect state-changing APIs, we added API-key + HMAC authentication for programmatic
clients. Admin dashboard continues to use session + CSRF.

- X-API-Key: your API key
- X-Timestamp: ISO string or Unix epoch (ms or s)
- X-Signature: HMAC-SHA256 of canonical string using API secret

- API_KEY: strong random key (no CR/LF; trailing spaces trimmed)
- API_SECRET: strong random secret for HMAC

METHOD + "\n" + URL_PATH_AND_QUERY + "\n" + X-Timestamp + "\n" + SHA256(body)

Protected endpoints (session OR API auth):

Session vs API rules:

Rotation tips:

Example signature (Node.js):

1. payloadHash = sha256(JSON.stringify(body))
2. canonical = `${method}\n${pathWithQuery}\n${timestamp}\n${payloadHash}`
3. signature = HMAC_SHA256(canonical, API_SECRET)

Troubleshooting:
