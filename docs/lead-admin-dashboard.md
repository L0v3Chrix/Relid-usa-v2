# Re:Lid Lead Admin Dashboard

Private admin dashboard routes live inside the existing Vite + React app and use Vercel serverless API routes for authentication and server-side Google Sheets reads.

## Architecture

Basin -> Google Sheet -> local Hermes enrichment job -> Google Sheet -> private website admin dashboard.

The website does not redeploy when lead data changes. Routine lead updates stay in the Google Sheet. The admin UI reads the Sheet at runtime after login.

## Responsibilities

Hermes/local agent:
- runs 2-3 times per business day, for example 9:00 AM, 1:00 PM, and 4:30 PM America/Chicago
- reads NEW rows from the Sheet
- enriches/researches leads
- writes priority, fit score, routing, draft subject/body, and status back to the Sheet
- sends no email
- creates no Gmail draft
- produces a run report

Website admin dashboard:
- authenticates an admin user with server-validated cookie auth
- reads the Leads tab server-side through `/api/admin/leads`
- presents lead list/detail screens
- provides copy buttons for draft subject/body/full email
- sends no email
- creates no Gmail draft
- does not commit or statically bake lead data into the app

## Routes

- `/admin/login` — private admin login
- `/admin/leads` — lead command center list
- `/admin/leads/:id` — lead detail and draft response copy box
- `/api/admin/login` — server login endpoint
- `/api/admin/logout` — clears session cookie
- `/api/admin/me` — session check
- `/api/admin/leads` — authenticated server-side Sheet read
- `/api/admin/leads/:id` — authenticated server-side Sheet read for one lead

## Required production environment variables

Auth:
- `ADMIN_AUTH_SECRET` — long random signing secret
- `ADMIN_USERNAME` — admin username
- `ADMIN_PASSWORD` — admin password

Google Sheets:
- `GOOGLE_SHEET_ID` — Re:Lid Sheet ID
- `GOOGLE_SHEETS_CLIENT_EMAIL` — service account client email
- `GOOGLE_SHEETS_PRIVATE_KEY` — service account private key. Newlines may be stored as `\n`.
- `GOOGLE_SHEETS_LEADS_TAB` — optional, defaults to `Leads`

Local mock UI development:
- `USE_MOCK_LEADS=true`
- `VITE_ENABLE_MOCK_ADMIN=true`
- `VITE_MOCK_ADMIN_USERNAME` — local browser-only mock username
- `VITE_MOCK_ADMIN_PASSWORD` — local browser-only mock password

Never expose Google credential variables with a `VITE_` prefix. They are server-only.

## Google Sheets credential setup

1. Create or use a Google Cloud project under the correct Re:Lid/The One AI account.
2. Enable Google Sheets API.
3. Create a service account.
4. Create a JSON key for the service account.
5. Share the Re:Lid Google Sheet with the service account `client_email` as Viewer.
6. Put `GOOGLE_SHEETS_CLIENT_EMAIL` and `GOOGLE_SHEETS_PRIVATE_KEY` into Vercel Project Environment Variables.

The dashboard only needs read access. Sheet writes remain the responsibility of the local Hermes runner.

## Local verification with mock data

Use Vercel dev so `/api/*` functions run locally. For mock UI verification, set explicit browser-only mock credentials. Production ignores Vite development mode and requires the server-side admin environment variables above.

```bash
VITE_ENABLE_MOCK_ADMIN=true \
VITE_MOCK_ADMIN_USERNAME=local-admin \
VITE_MOCK_ADMIN_PASSWORD='local-dev-password' \
USE_MOCK_LEADS=true \
npx vercel dev --listen 3000
```

Open:

```text
http://localhost:3000/admin/login
```

Login with the mock credentials you set in `VITE_MOCK_ADMIN_USERNAME` / `VITE_MOCK_ADMIN_PASSWORD`, then verify:
- `/admin/leads` loads mock lead cards
- `/admin/leads/:id` loads detail view
- copy subject/body/full email buttons work
- logout blocks lead access again

## Local verification with real Sheet data

```bash
ADMIN_AUTH_SECRET=dev-secret \
ADMIN_USERNAME=admin \
ADMIN_PASSWORD=password \
GOOGLE_SHEET_ID=your_sheet_id \
GOOGLE_SHEETS_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com \
GOOGLE_SHEETS_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n' \
GOOGLE_SHEETS_LEADS_TAB=Leads \
npx vercel dev --listen 3000
```

## Security boundaries

- No lead data is committed to the repo.
- No Sheet data is written into static files.
- No Google credentials are exposed to client code.
- Admin routes call server APIs after login; API routes enforce the auth cookie.
- No email sending code exists.
- No Gmail draft creation code exists.
- Runtime refresh is page/API based; new leads do not require website deployments.
