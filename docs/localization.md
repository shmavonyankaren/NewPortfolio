# English/German localization

## Architecture and routes

`next-intl` is pinned to 4.8.3 (its declared peers include Next.js 16 and React 19).
`i18n/routing.ts`, `request.ts` and `navigation.ts` configure always-prefixed public
routes. Legacy public URLs redirect permanently to `/en`, retaining the query.
Admin, login, APIs, assets, monitoring and diagnostics stay unprefixed.

The root HTML gets its language server-side. `LocaleShell` owns the per-locale
provider and navigation; `LocaleDocument` updates the persistent root HTML during
client navigation. Theme state stays in the root provider. Public message catalogs
are in `messages/en.json` and `de.json`; `keys.json` maps readable source phrases to
stable keys. Navigation and feedback have separate namespaces. Static messages use
formal German. Rich headings allow German word order without fragment assembly.

Public pages fetch multilingual records under the existing cache policy, then
resolve text with `lib/content/localization.ts`. No locale-specific response is
cached under a shared key. Mutations invalidate the portfolio tag and both locale
layouts. Project details use a server lookup for metadata and `notFound()`.
Loading boundaries are scoped to listing/static pages so project lookups can send
an actual 404 before headers are streamed. Metadata is blocking for predictable
HTTP status and SEO behavior.

## Content and editor workflow

All ten content types keep their existing English fields. Optional German values
live in `translations.de`, including on shared nested items. IDs, ordering, dates,
files, URLs, company/institution identity and logos stay shared. German does not
create another entity. Blank German fields fall back to English. Features and
challenge/solution pairs fall back together until both translated fields exist.
Conceptual skill labels have a small shared mapping; technology names remain intact.

Each English-language admin form has English and Deutsch tabs. English stays
mounted for validation and unsaved values survive switching. German fields show
their English fallback and missing-translation status. Shared fields and structural
operations (add/delete/reorder) are edited in the English tab. Save record in either
tab saves the same record. Upload/draft guards are retained.

Education retains `learningOutcomes: string[]`. Its `outcomeItems` companion stores
stable item IDs, English `name`, and optional German `name`. New editors update both
representations together. Old clients are matched by exact English content, never
by array position. Ambiguous structural changes to translated content are rejected
with a refresh instruction. APIs preserve omitted translations and merge partial
German objects. GeneralInfo updates preserve the singleton instead of deleting it.

CMS translation text is editorial content: no translation API runs, and no German
translations have been written to the connected database. English fallback is not
counted as completed German. Existing static sample/fallback copy is translated;
its factual content and proper names were retained, not endorsed or replaced.

## Authentication and deployment configuration

Set `ADMIN_NAME`, `ADMIN_PASSWORD`, and preferably a high-entropy
`ADMIN_SESSION_SECRET` (at least 32 random bytes) in deployment secrets. The existing
password is used as signing-key fallback for compatibility. Sessions are HMAC-SHA256
signed, expiring, HTTP-only, SameSite Lax, path `/`, and Secure in production.
Old `isAdmin=true` cookies no longer grant access; sign in again after deployment.
Rotate the signing secret to invalidate all sessions. This remains a single-admin
authentication system, not a multi-user identity provider.

Each CMS mutation independently verifies the session and rejects cross-origin
browser writes. Public GET requests remain open. All three UploadThing routes
verify the session before initiating uploads. Upload callbacks remain managed by
UploadThing. Sentry and contact delivery retain their existing integrations.

Set `NEXT_PUBLIC_BASE_URL` to the canonical origin for the deployment; it is used
for self-fetches and SEO URLs. MongoDB must support transactions (Atlas/replica set).
Keep UploadThing, Resend and Sentry configuration as before. Do not point a preview
deployment at a production write database accidentally.

## Migration: review, back up, apply

The additive migration only fills missing nested IDs and learning-outcome companion
items. It never translates content or changes existing English text, IDs, order,
dates, timestamps or assets. Translation fields need no blanket backfill.

1. Deploy compatible read/write code and ensure the older ordering/logo migrations
   have already been applied.
2. Run `npm run migrate:localization:check` against the intended environment. This
   is read-only and reports counts rather than private content.
3. Inspect reported legacy-shape errors and resolve them deliberately. Do not
   guess how to normalize malformed historical content.
4. Schedule a short editing pause and take a provider snapshot/full database backup
   with a tested restore process.
5. Run `npm run migrate:localization -- --backup .local-backups/localization-YYYYMMDD.json`.
   The command additionally writes an exclusive Extended JSON content backup before
   starting its transaction. Keep that file private; never commit it. A pre-existing
   backup path causes failure, not overwrite.
6. Repeat the dry run; `recordsToUpdate` should be zero. Compare English fields,
   record IDs/counts, dates, ordering, nested associations and asset URLs to the backup.
7. Re-enable editing, enter reviewed German text, and verify both public locales.

The read-only preview during implementation found 1 project, 3 jobs, 4 education
records, 8 skillsets, 1 general-info record, 3 certificates, 5 insights, 0 testimonials,
3 posts and 1 contact. Four education records need companion items; none had top-level
German translations. These counts are a point-in-time observation, not a deployment
guarantee. No connected-database migration was applied.

### Rollback

Prefer rolling back the renderer while retaining translation-aware writes and the
additive data. Do not run older write handlers that reconstruct arrays and discard
translations. Pause editing before rollback. If restoration is required, restore
the verified snapshot into a separate database first and compare it before switching
traffic. An old backup can overwrite newer edits, so do not blindly replay it into
the active database. No automated destructive rollback is provided.

## Verification

Implementation verification completed: 54 database/API tests passed; both existing
admin browser suites, the experience browser suite (including English/German date
ordering), and the new localization browser suite passed. All 227 catalog entries
have German counterparts. Type checking and the production build passed. ESLint
reports warnings only. Robots, bilingual sitemap and unchanged asset URLs were also
checked against the local app.

- `npm run test:ordering`: isolated temporary MongoDB replica set, original ordering
  regressions plus all ten CMS translation round trips, signed sessions, unauthorized
  writes, cross-origin writes, upload authorization, nested identity and migration.
- `npm run test:localization:browser`: actual public routes, metadata, navigation,
  language switching, theme, small viewports, project 404 and mocked CMS editing.
- Existing admin browser tests intercept content APIs; they never write live data.
  Their short-lived local test session is generated without logging credentials.
- `npm run test:experience:browser`: isolated component fixtures in both themes.
- `npx next typegen`, `npx tsc --noEmit --incremental false`, `npm run lint`,
  `npm run build` verify route types, compilation and production bundling.

Run browser tests with a local app on port 3000. Dependency installation reported
existing/transitive audit findings; no automatic force-upgrade was applied as part
of localization. Live email delivery, actual file uploads and deployment are not
performed by these tests.
