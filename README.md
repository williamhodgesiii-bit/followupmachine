# Follow-Up Machine 🦷💬

A dead-simple tool for sending **personalized follow-up texts to patients** in
seconds — right from your own phone (or Mac), as normal iMessages/texts.

Built for the "it takes me 20 minutes of copy-pasting to text 5–6 patients"
problem. With this, that same batch takes about a minute — and you never retype
a name or paste text again.

- ✅ Save patients once: **first name, last initial, phone(s), and adult / child / both**
- ✅ Reusable **message templates** with fill-in-the-blanks that fill automatically per person
- ✅ Built-in blanks: `{first name}` · `{last initial}` · `{full name}` · `{patient}` · `{doctor}` · `{office}` — **plus your own custom variables**
- ✅ One-tap send: opens Messages pre-filled per person, **individually** (no group threads), with progress tracking
- ✅ **Cross-device sync** via your own Supabase project — **end-to-end encrypted** (see the big note below)
- ✅ **CSV import/export**, local backup/restore, and an optional **Mac auto-sender**
- ✅ Installable (PWA) with a built-in **?** walkthrough

We deliberately store only a **last initial**, never a full last name — less
identifying information to hold (the "minimum necessary" idea).

---

## The one honest limitation 📵➡️📱

Apple does **not** let a website (or any app) silently send texts from an
iPhone — that's their anti-spam rule, with no way around it on the phone itself.
So on iPhone: tap **Send** → Messages opens **already filled in** → tap the blue
arrow → swipe back → next person. **One tap per person**, no typing or pasting,
and it sends as **iMessage automatically** (blue). Want zero taps? See
[Zero-tap on a Mac](#optional-zero-tap-on-a-mac).

---

## Simple walkthrough (30 seconds)

There's also a **?** button at the top of the app with this same guide.

1. **Add patients** — *Patients* tab → **+ Add**. First name, **last initial**,
   who you text (parent / adult / either), phone number(s). Or **Import CSV**.
2. **Set names & make blanks** — *Settings* → fill in the **doctor** and
   **office** names, and add any **custom variables** (e.g. a booking link).
3. **Write messages** — *Messages* tab → **+ Add**. Type once, tap the blanks. A
   live preview shows exactly how it'll read.
4. **Send** — *Send* tab → pick a message → check who gets it → **Start sending**.

---

## Placeholders (the fill-in-the-blanks)

| Placeholder | Fills in with |
|---|---|
| `{first name}` (or `{name}`) | first name of whoever you're texting (patient **or** parent) |
| `{last initial}` | their last initial (e.g. `M`) |
| `{full name}` | first name + last initial (e.g. `Susan M`) |
| `{patient}` | the patient's first name (handy when texting a parent) |
| `{patient last initial}` | the patient's last initial |
| `{doctor}` | your doctor name — set once in **Settings** |
| `{office}` | your office name — set once in **Settings** |
| `{your own}` | any **custom variable** you create in Settings |

Example: `Hi {first name}, {doctor} at {office} checking in on {patient} — book anytime at {booking link}.`
→ *"Hi Susan, Dr. Hodges at Hodges Orthodontics checking in on Jimmy — book anytime at hodgesortho.com/book."*

---

## Cross-device sync (Supabase, end-to-end encrypted)

> ## ⚠️ TEST DATA ONLY (for now)
> This sync works today on a **free** Supabase project, but a free project is
> **not HIPAA-compliant**. Supabase only signs a **BAA** on its **Team + HIPAA
> add-on** plan (**~$950+/month**). **Use fake/test names until your project is
> on that plan and you've signed the BAA.** The app end-to-end encrypts your
> data (Supabase only ever stores ciphertext), but encryption alone is *not*
> "HIPAA compliant" without the BAA + eligible plan.

**How it works:** your whole dataset is encrypted **on your device** (AES-GCM,
key derived from your account password) and stored as one ciphertext row in
*your* Supabase project. Row-Level Security isolates it to your account, and a
realtime subscription keeps every signed-in device live-updated. It syncs
automatically on phone **and** computers — no file juggling.

### Set it up (~10 min)
1. Create a free project at **supabase.com**.
2. **SQL Editor → New query** → paste [`supabase-setup.sql`](supabase-setup.sql) → **Run**.
3. (For easy testing) **Authentication → Providers → Email** → turn **off**
   "Confirm email" so you can sign in immediately. (Turn it back on later.)
4. **Project Settings → API** → copy your **Project URL** and **anon public key**.
5. In the app: **Settings → Sync** → paste both → **Save connection**.
6. **Create account** with an email + password. Use the **same email + password
   on every device** — that password also unlocks your encrypted data, so write
   it down; it can't be recovered.

Now edits on one device appear on the others within a moment. Before entering
any *real* patient, upgrade to the Supabase HIPAA plan and sign the BAA.

> Prefer a genuinely free + compliant route? **Firebase** gives a BAA at no cost.
> Say the word and I'll switch the sync layer to it.

---

## Optional: zero-tap on a Mac

For no-taps-at-all sending on a Mac:
1. Sign in to iMessage in the **Messages** app.
2. In Follow-Up Machine, build your batch and tap **"Have a Mac? Download a file
   to auto-send them all"** — saves `followup-macsend.txt` to Downloads.
3. Open [`tools/send-imessages.applescript`](tools/send-imessages.applescript)
   in **Script Editor** and press ▶ **Run**. It finds the file automatically,
   shows the count, and on **Send** fires them all off as iMessage. (First run,
   macOS asks permission to control Messages — click **OK**. Tip: File → Export
   → **Application** makes it a double-click app.)

---

## Your data & privacy

- With sync **off**, everything stays **only in your browser on that device**.
- With sync **on**, data is **end-to-end encrypted on your device** before it
  reaches Supabase — the server only ever holds unreadable ciphertext.
- We store only a **last initial**, not a full last name (minimum necessary).
- **Settings → Your data** has a plain backup/restore; **Erase everything** wipes
  the device.

### A few sensible texting habits
- Keep it general — avoid specific medical/treatment details in a text.
- iMessage/SMS isn't a HIPAA-encrypted channel; text only patients who expect it,
  and stop if they ask (reply **STOP**).
- Follow your usual rules for patient communication (HIPAA, texting-consent/TCPA).

---

## What's in this project

| File | What it is |
|------|-----------|
| `index.html` | The whole app (works offline, no installs, no accounts) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Make it installable & app-like |
| `supabase-setup.sql` | One-time database setup for cross-device sync |
| `patient-import-template.csv` | Sample layout for importing your patient list |
| `tools/send-imessages.applescript` | Optional Mac "zero-tap" auto-sender |

The sync feature loads the Supabase client from a CDN at runtime; everything
else is a single self-contained HTML file with no build step.

## Hosting
Any static host works (relative paths, no config). On **Vercel**: import the
repo, no framework preset, deploy. Then open the URL in **Safari → Share → Add
to Home Screen**.

## Make changes
It's all plain HTML/CSS/JS in `index.html`. Edit, commit, and your host redeploys.
