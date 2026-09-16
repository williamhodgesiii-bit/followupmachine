// Vercel serverless function → served at /api/config
// Reads your Supabase details from Vercel Environment Variables and hands them
// to the page as window globals, so they never live in the repo.
//
// Set these in Vercel → Project → Settings → Environment Variables:
//   SUPABASE_URL        = https://YOURPROJECT.supabase.co
//   SUPABASE_ANON_KEY   = your anon public key  (NOT the service_role key)
//
// The anon key is designed to be public (it ends up in the browser either way);
// this just keeps it out of your source code.

// Pasting into a dashboard field very often drags along a stray space, a line
// break, or wrapping quotes. Any one of those makes the browser's request fail
// with a useless "Load failed", so we clean them up here.
function clean(v) {
  return String(v == null ? "" : v)
    .trim()
    .replace(/^['"]|['"]$/g, "")   // stray wrapping quotes
    .replace(/\s+/g, "")           // spaces / newlines inside the value
    .trim();
}

module.exports = (req, res) => {
  const url = clean(process.env.SUPABASE_URL).replace(/\/+$/, "");   // no trailing slash
  const key = clean(process.env.SUPABASE_ANON_KEY);
  const ready = !!url && !!key;

  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  // If either value is missing, never cache the answer — otherwise the admin
  // sets the variables, redeploys, and the app keeps serving the empty copy.
  res.setHeader("Cache-Control", ready ? "public, max-age=60" : "no-store");
  res.statusCode = 200;
  res.end(
    "window.SUPABASE_URL=" + JSON.stringify(url) + ";" +
    "window.SUPABASE_ANON_KEY=" + JSON.stringify(key) + ";" +
    "window.SUPABASE_CONFIG_META=" + JSON.stringify({
      source: "Vercel environment variables",
      hasUrl: !!url,
      hasKey: !!key
    }) + ";"
  );
};
