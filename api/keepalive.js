// Vercel Cron target → keeps the Supabase project from auto-pausing.
//
// Supabase's free plan pauses a project after 7 consecutive days with no
// activity, and there is no setting to turn that off — only the Pro plan
// removes it. A real query once a day counts as activity, so the project
// never reaches 7 idle days.
//
// Scheduled by "crons" in vercel.json. You can also open /api/keepalive in a
// browser any time to ping it by hand and see the result.

// Same cleanup as api/config.js: pasted env values often carry a stray space,
// newline, or wrapping quotes. Kept inline so each function stands alone.
function clean(v) {
  return String(v == null ? "" : v).trim().replace(/^['"]|['"]$/g, "").replace(/\s+/g, "");
}

module.exports = async (req, res) => {
  const url = clean(process.env.SUPABASE_URL).replace(/\/+$/, "");
  const key = clean(process.env.SUPABASE_ANON_KEY);
  const send = (code, body) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.statusCode = code;
    res.end(JSON.stringify(body));
  };

  if (!url || !key) {
    return send(503, { ok: false, reason: "SUPABASE_URL / SUPABASE_ANON_KEY are not set in Vercel" });
  }

  // A genuine database read. Row-level security hands back an empty list to an
  // anonymous caller, which is fine — Postgres still did the work, and that is
  // what the inactivity timer measures.
  const target = url + "/rest/v1/workspace?select=id&limit=1";
  const started = Date.now();
  try {
    const r = await fetch(target, {
      headers: { apikey: key, Authorization: "Bearer " + key },
      signal: AbortSignal.timeout(10000)
    });
    const ms = Date.now() - started;
    if (r.ok) return send(200, { ok: true, project: new URL(url).hostname, status: r.status, ms });
    // An answer of any kind means the project is awake; a 4xx here is usually
    // just RLS or a stale key, which is not what this job is guarding against.
    return send(200, {
      ok: true, awake: true, project: new URL(url).hostname, status: r.status, ms,
      note: "project answered but the query was refused — check the anon key and that supabase-setup.sql has been run"
    });
  } catch (e) {
    return send(502, {
      ok: false, project: new URL(url).hostname, ms: Date.now() - started,
      reason: "no answer from the project — it is probably paused; restore it at supabase.com",
      detail: String((e && e.message) || e)
    });
  }
};
