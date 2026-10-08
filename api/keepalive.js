// Vercel Cron target → keeps the Supabase project from auto-pausing.
//
// Supabase's free plan pauses a project after 7 consecutive days with no
// activity, and there is no setting to turn that off — only the Pro plan
// removes it. A real query once a day counts as activity, so the project
// never reaches 7 idle days. (A GitHub Actions workflow runs the same check
// twice a day as a backup — see .github/workflows/supabase-keepalive.yml.)
//
// If SUPABASE_ACCESS_TOKEN is set in Vercel, a paused project is also restored
// automatically. The logic lives in lib/keepalive.js.
//
// Scheduled by "crons" in vercel.json. You can also open /api/keepalive in a
// browser any time to ping it by hand and see the result.

const { keepAlive } = require("../lib/keepalive");

module.exports = async (req, res) => {
  const r = await keepAlive(process.env);
  const code = r.code;
  delete r.code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.statusCode = code;
  res.end(JSON.stringify(r));
};
