# Follow-Up Machine 🦷💬

A dead-simple tool for sending **personalized follow-up texts to patients** in
seconds — right from your own phone (or Mac), as normal iMessages/texts.

Built for the "it takes me 20 minutes of copy-pasting to text 5–6 patients"
problem. With this, that same batch takes about a minute — and you never retype
a name or paste text again.

- ✅ Save patients once: **first name, last initial, phone(s), and adult / child / both**
- ✅ Reusable **message templates** with fill-in-the-blanks: `{first name}` · `{last initial}` · `{full name}` · `{patient}` · `{doctor}` · `{office}` — plus your own custom variables
- ✅ One-tap send: opens Messages pre-filled per person, **individually** (no group threads)
- ✅ **Shared team accounts** — every staff login sees the same live patient list, on any phone or computer
- ✅ **Auto sign-out at midnight Central** for security
- ✅ **CSV import/export**, local backup/restore, and an optional **Mac auto-sender**

We deliberately store only a **last initial**, never a full last name.

---

## The one honest limitation 📵➡️📱

Apple does **not** let a website (or any app) silently send texts from an
iPhone — that's their anti-spam rule. So on iPhone: tap **Send** → Messages opens
**already filled in** → tap the blue arrow → swipe back → next person. **One tap
per person**, no typing or pasting, and it sends as **iMessage automatically**
(blue). Want zero taps? See [Zero-tap on a Mac](#optional-zero-tap-on-a-mac).

---

## Simple walkthrough (30 seconds)

1. **Sign in** with your staff email + password (your admin creates these).
2. **Add patients** — *Patients* tab → **+ Add**. First name, **last initial**,
   who you text (parent / adult / either), phone number(s). Or **Import CSV**.
3. **Set names & make blanks** — *Settings* → doctor and office names, plus any
   **custom variables** (e.g. a booking link).
4. **Write messages** — *Messages* tab → **+ Add**. Type once, tap the blanks.
5. **Send** — *Send* tab → pick a message → check who gets it → **Start sending**.

Everyone on the team shares the same patients & messages, live.

---

## Placeholders (the fill-in-the-blanks)

| Placeholder | Fills in with |
|---|---|
| `{first name}` (or `{name}`) | first name of whoever you're texting (patient **or** parent) |
| `{last initial}` | their last initial (e.g. `M`) |
| `{full name}` | first name + last initial (e.g. `Susan M`) |
| `{patient}` | the patient's first name |
| `{patient last initial}` | the patient's last initial |
| `{doctor}` / `{office}` | set once in **Settings** |
| `{your own}` | any **custom variable** you make in Settings |

---

## Team accounts & sync (Supabase)

> ## ⚠️ TEST DATA ONLY (for now)
> This runs on a **free** Supabase project, which is **not HIPAA-compliant** —
> Supabase only signs a **BAA** on its **Team + HIPAA add-on** plan
> (**~$950+/month**). **Use fake/test names until you're on that plan with a
> signed BAA.** (Free forever + compliant? **Firebase** gives a BAA at no cost —
> ask and I'll switch to it.)

**How it works:** everyone signs in with their own staff email/password, and all
accounts share **one workspace** — the same patients, templates, and settings,
kept live across every device by Supabase realtime. For security, **all accounts
sign out automatically at midnight Central time**. Because the data is shared
across the team, it's protected by **staff login + Supabase's own encryption at
rest** (not per-user encryption); real compliance still requires the BAA + plan.

### Set it up (~10 min, admin does this once)
1. Create a free project at **supabase.com**.
2. **SQL Editor → New query** → paste [`supabase-setup.sql`](supabase-setup.sql) → **Run**.
3. **Lock down sign-ups** (important — otherwise anyone could register and read
   your data): **Authentication → Sign In / Providers → Email** → turn **off**
   "Allow new users to sign up".
4. **Create each staff login:** **Authentication → Users → Add user** (email +
   password) for each person.
5. **Connect the app:** open `index.html` and set these two lines near the top of
   the `<script>` (search for `SUPABASE_URL`):
   ```js
   const SUPABASE_URL = "https://YOURPROJECT.supabase.co";
   const SUPABASE_ANON_KEY = "your-anon-public-key";
   ```
   Both come from **Supabase → Project Settings → API** (the **anon public** key —
   never the `service_role` key). The anon key is designed to be public, so it's
   safe to commit. Redeploy.

Now every device just opens the app and signs in — no other setup. Before any
*real* patient goes in, upgrade to the Supabase HIPAA plan and sign the BAA.

---

## Optional: zero-tap on a Mac

1. Sign in to iMessage in the **Messages** app.
2. Build your batch and tap **"Have a Mac? Download a file to auto-send them
   all"** — saves `followup-macsend.txt` to Downloads.
3. Open [`tools/send-imessages.applescript`](tools/send-imessages.applescript) in
   **Script Editor** → ▶ **Run**. It finds the file, shows the count, and on
   **Send** fires them off as iMessage. (First run, allow it to control Messages.
   Tip: File → Export → **Application** makes it a double-click app.)

---

## Your data & privacy

- Signed **out**, the app shows nothing and holds no patient data on the device
  (it's cleared on sign-out, and nightly at midnight Central).
- Signed **in**, the shared data lives in your Supabase project (encrypted at
  rest by Supabase) and is cached on the device for the session.
- We store only a **last initial**, not a full last name.
- **Settings → Your data** has a plain backup/restore.

### Sensible texting habits
- Keep it general — avoid specific medical details in a text.
- iMessage/SMS isn't a HIPAA-encrypted channel; text only patients who expect it,
  and stop if they ask (reply **STOP**). Follow HIPAA / texting-consent rules.

---

## What's in this project

| File | What it is |
|------|-----------|
| `index.html` | The whole app (set your Supabase URL/key near the top of the script) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Installable / app-like |
| `supabase-setup.sql` | One-time database setup for shared team sync |
| `patient-import-template.csv` | Sample layout for importing patients |
| `tools/send-imessages.applescript` | Optional Mac "zero-tap" auto-sender |

## Hosting
Any static host works. On **Vercel**: import the repo, no framework preset,
deploy. Open the URL in **Safari → Share → Add to Home Screen**.

## Make changes
It's all plain HTML/CSS/JS in `index.html`. Edit, commit, redeploy.
