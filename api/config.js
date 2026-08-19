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

module.exports = (req, res) => {
  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_ANON_KEY || "";
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.statusCode = 200;
  res.end(
    "window.SUPABASE_URL=" + JSON.stringify(url) + ";" +
    "window.SUPABASE_ANON_KEY=" + JSON.stringify(key) + ";"
  );
};
