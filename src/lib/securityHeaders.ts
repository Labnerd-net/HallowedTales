// Response headers for every page. Keep in sync with public/_headers, which
// applies the same values to static assets and prerendered pages (the Worker,
// and so src/middleware.ts, only sees on-demand responses). The rest of the
// CSP (script/style hashes, source lists) is the <meta> tag Astro emits from
// `security.csp` in astro.config.mjs; frame-ancestors can't be set from a
// <meta>, so it lives here.
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "frame-ancestors 'none'",
};
