// Shared keep-alive logic for the free Supabase project.
//
// Used by two independent schedulers so one failing doesn't let the project
// pause:
//   • api/keepalive.js            — Vercel Cron, once a day
//   • .github/workflows/supabase-keepalive.yml — GitHub Actions, twice a day
//
// Each run does a real database read (that's what Supabase's 7-day inactivity
// timer measures). If SUPABASE_ACCESS_TOKEN is also set, it first asks the
// Supabase Management API whether the project is paused and, if so, restores
// it automatically — so even if every ping were missed, it comes back on its
// own instead of waiting for someone to press "Restore" in the dashboard.

// Pasted env values often carry a stray space, newline, or wrapping quotes.
function clean(v) {
  return String(v == null ? "" : v).trim().replace(/^['"]|['"]$/g, "").replace(/\s+/g, "");
}

// https://abcd1234.supabase.co → "abcd1234" (null for custom domains)
function projectRef(url) {
  try {
    const m = new URL(url).hostname.match(/^([a-z0-9]+)\.supabase\.(co|in)$/i);
    return m ? m[1] : null;
  } catch (e) {
    return null;
  }
}

const MGMT = "https://api.supabase.com/v1/projects/";

// Returns { status, restored } or { error }. Only runs when a token is given.
async function ensureNotPaused(ref, token) {
  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  try {
    const r = await fetch(MGMT + ref, { headers, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return { error: "management API answered " + r.status + " (check SUPABASE_ACCESS_TOKEN)" };
    const p = await r.json();
    const status = p && p.status;
    if (status === "INACTIVE" || status === "PAUSED") {
      const rr = await fetch(MGMT + ref + "/restore", { method: "POST", headers, signal: AbortSignal.timeout(15000) });
      return {
        status, restored: rr.ok,
        error: rr.ok ? undefined : "restore request answered " + rr.status + ": " + (await rr.text()).slice(0, 300)
      };
    }
    return { status, restored: false };
  } catch (e) {
    return { error: String((e && e.message) || e) };
  }
}

// The actual keep-alive. Never throws; always resolves to a plain result.
async function keepAlive(env) {
  env = env || process.env;
  const url = clean(env.SUPABASE_URL).replace(/\/+$/, "");
  const key = clean(env.SUPABASE_ANON_KEY);
  const token = clean(env.SUPABASE_ACCESS_TOKEN);

  if (!url || !key) {
    return { ok: false, code: 503, reason: "SUPABASE_URL / SUPABASE_ANON_KEY are not set" };
  }

  let project;
  try { project = new URL(url).hostname; } catch (e) {
    return { ok: false, code: 503, reason: "SUPABASE_URL is not a valid URL" };
  }

  const out = { project };
  const ref = projectRef(url);
  if (token && ref) {
    out.management = await ensureNotPaused(ref, token);
    if (out.management.restored) {
      // A restore takes a few minutes; the read below will likely fail this
      // time, and the next scheduled run will find it awake again.
      out.note = "project was paused — restore requested automatically";
    }
  }

  // A genuine database read. Row-level security hands back an empty list to an
  // anonymous caller, which is fine — Postgres still did the work, and that is
  // what the inactivity timer measures.
  const started = Date.now();
  try {
    const r = await fetch(url + "/rest/v1/workspace?select=id&limit=1", {
      headers: { apikey: key, Authorization: "Bearer " + key },
      signal: AbortSignal.timeout(15000)
    });
    out.ms = Date.now() - started;
    out.status = r.status;
    if (r.ok) return Object.assign({ ok: true, code: 200 }, out);
    if (r.status >= 500) {
      // 5xx from Supabase's gateway is what a paused / waking project returns.
      return Object.assign({ ok: false, code: 502,
        reason: "project answered " + r.status + " — it is probably paused or still waking up" }, out);
    }
    // A 4xx means the project is awake; usually RLS or a stale key, which is
    // not what this job is guarding against.
    return Object.assign({ ok: true, awake: true, code: 200,
      note: out.note || "project answered but the query was refused — check the anon key and that supabase-setup.sql has been run" }, out);
  } catch (e) {
    out.ms = Date.now() - started;
    return Object.assign({ ok: false, code: 502,
      reason: "no answer from the project — it is probably paused; restore it at supabase.com",
      detail: String((e && e.message) || e) }, out);
  }
}

module.exports = { keepAlive, clean, projectRef };

// `node lib/keepalive.js` — used by the GitHub Actions workflow. Exits non-zero
// when the project didn't answer, so GitHub emails the repo owner.
if (require.main === module) {
  keepAlive().then((r) => {
    console.log(JSON.stringify(r, null, 2));
    process.exit(r.ok ? 0 : 1);
  });
}
