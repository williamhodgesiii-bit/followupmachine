# Follow-Up Machine 🦷💬

A dead-simple tool for sending **personalized follow-up texts to patients** in
seconds — right from your own phone (or Mac), as normal iMessages/texts.

Built for the "it takes me 20 minutes of copy-pasting to text 5–6 patients"
problem. With this, that same batch takes about a minute — and you never retype
a name or paste text again.

- ✅ Save patients once: **first & last name, phone(s), and adult / child / both**, so you can text the patient, a parent, or either
- ✅ Reusable **message templates** with fill-in-the-blanks that fill automatically per person
- ✅ Built-in blanks: `{first name}` · `{last name}` · `{full name}` · `{patient}` · `{doctor}` · `{office}` — **plus your own custom variables**
- ✅ One-tap send: opens Messages pre-filled per person, **individually** (no group threads), with progress tracking
- ✅ **CSV import/export** of patients
- ✅ **Local-only** storage (no server, no accounts) with backup/restore
- ✅ Installable (PWA) with a built-in **?** walkthrough
- ✅ Optional **Mac auto-sender** for fully hands-free batches

---

## The one honest limitation 📵➡️📱

Apple does **not** let a website (or any app) silently send texts from an
iPhone — that's their anti-spam rule, with no way around it on the phone itself.
So on iPhone the flow is:

> Tap **Send** → Messages opens **already filled in with the right person and
> message** → you tap the blue arrow → swipe back → next person is ready.

**One tap per person**, no typing or pasting. Six patients drops from ~20
minutes to ~1 minute, and it sends as **iMessage automatically** (blue).

**Want truly zero taps?** On a **Mac**, the included script sends the whole
batch hands-free — see [Zero-tap on a Mac](#optional-zero-tap-on-a-mac).

---

## Simple walkthrough (30 seconds)

There's also a **?** button at the top of the app with this same guide.

1. **Add patients** — *Patients* tab → **+ Add**. Name, who you text (parent /
   adult / either), phone number(s). Or **Import CSV** for a whole list.
2. **Set names & make blanks** — *Settings* → fill in the **doctor** and
   **office** names, and add any **custom variables** you want (e.g. a booking
   link). These power `{doctor}`, `{office}`, and `{your own}` blanks.
3. **Write messages** — *Messages* tab → **+ Add**. Type it once and tap the
   blanks to drop them in. A live preview shows exactly how it'll read.
4. **Send** — *Send* tab → pick a message → check who gets it → **Start
   sending**. Tap through on iPhone, or auto-send on a Mac.

---

## Placeholders (the fill-in-the-blanks)

Type these in any message and they fill in automatically for each recipient:

| Placeholder | Fills in with |
|---|---|
| `{first name}` (or `{name}`) | first name of whoever you're texting (patient **or** parent) |
| `{last name}` | their last name |
| `{full name}` | their first + last name |
| `{patient}` | the patient's first name (handy when texting a parent) |
| `{patient last name}` | the patient's last name |
| `{doctor}` | your doctor name — set once in **Settings** |
| `{office}` | your office name — set once in **Settings** |
| `{your own}` | any **custom variable** you create in Settings |

**Custom variables:** In *Settings → Your own blanks*, add something like
`booking link` = `hodgesortho.com/book`, then use `{booking link}` in any
message. Great for links, phone numbers, or a standard sign-off.

Example message:
`Hi {first name}, {doctor} at {office} checking in on {patient} after the recent visit — book anytime at {booking link}.`
→ *"Hi Susan, Dr. Hodges at Hodges Orthodontics checking in on Jimmy after the recent visit — book anytime at hodgesortho.com/book."*

*(Typo a blank, like `{frist name}`? It stays visible as-is in the preview so
you can catch it before sending.)*

---

## Hosting it (so you can open it on your phone)

The app is plain static files, so **any static host works** — and it uses only
relative paths, so it serves correctly from a domain root with zero config.

- **Vercel:** import the repo, no framework preset needed, deploy. Done.
- **GitHub Pages:** repo **Settings → Pages → Deploy from a branch →** pick the
  branch and `/ (root)`. (Free Pages needs a **public** repo — safe here, since
  the repo holds only app code, never patient data.)

Then open your URL in **Safari on iPhone → Share → Add to Home Screen** so it
opens like an app. Do the same in any desktop browser.

> **No patient information is ever stored in this project** — only the app's
> code. Patient data lives only in the browser on each device you use.

---

## Optional: zero-tap on a Mac

For no-taps-at-all sending on a Mac:

1. Sign in to iMessage in the **Messages** app (Messages → Settings → iMessage).
2. In Follow-Up Machine, build your batch and tap **"Have a Mac? Download a file
   to auto-send them all"** — this saves `followup-macsend.txt` to Downloads.
3. Open [`tools/send-imessages.applescript`](tools/send-imessages.applescript)
   in the **Script Editor** app (already on every Mac) and press ▶ **Run**.
   - It finds the file in Downloads automatically, shows you the count, and on
     **Send** fires them all off as iMessage. First run, macOS asks permission
     to control Messages — click **OK**.
   - Tip: in Script Editor, **File → Export → Application** turns it into a
     double-click app you can keep in your Dock.

*(This is a power-user extra — most people are happy with the one-tap iPhone
flow and never need it.)*

---

## Your data & privacy

- Everything you enter (patients, messages, custom variables, settings) is saved
  **only in your browser on that device**. Nothing is uploaded anywhere.
- To move between devices: **Settings → Back up all data**, then **Restore from
  backup** on the other device. (Since sending is easiest from your Mac/iPhone,
  keeping the master list there keeps things simple.)
- **Settings → Erase everything** wipes it from that device.

### A few sensible texting habits
- Keep it general — avoid specific medical/treatment details in a text.
- Only text people who expect to hear from your office.
- If someone replies **STOP** (or asks you to), stop texting them.
- Your office should follow the usual rules for patient communication (e.g.
  HIPAA and texting-consent/TCPA). This tool just helps you send faster.

---

## What's in this project

| File | What it is |
|------|-----------|
| `index.html` | The whole app (works offline, no installs, no accounts) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Make it installable & app-like |
| `patient-import-template.csv` | Sample layout for importing your patient list |
| `tools/send-imessages.applescript` | Optional Mac "zero-tap" auto-sender |

The app is a single self-contained HTML file with no external dependencies, so
it keeps working even with no internet and never phones home.

## Make changes
Want different starter messages, colors, or wording? It's all plain HTML/CSS/JS
in `index.html`. Edit, commit, and your host redeploys automatically.
