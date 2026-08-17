# Follow-Up Machine 🦷💬

A dead-simple tool for sending **personalized follow-up texts to patients** in
seconds — right from your own phone (or computer), as normal iMessages/texts.

Built for the "it takes me 20 minutes of copy-pasting to text 5–6 patients"
problem. With this, that same batch takes about a minute.

- ✅ Save patients once: **name, phone, and whether you text the patient, a parent, or either**
- ✅ Save reusable **message templates** with fill-in-the-blank spots like `Hi {name}`
- ✅ Pick a message, check off who gets it, and fire them off **one tap each** — every text is **individual** (no group thread)
- ✅ Import your patient list from a **spreadsheet (CSV)**
- ✅ Works on **iPhone and computer**; add it to your Home Screen so it opens like an app
- ✅ **Private:** all your patient info stays on your device — nothing is uploaded anywhere

---

## First, the one honest limitation 📵➡️📱

Apple does **not** let a website (or any app) silently send texts from your
iPhone — that's their anti-spam rule, and there's no way around it on the phone
itself. So on an iPhone the flow is:

> Tap **Send** in the app → the Messages app pops open **already filled in with
> the right person and message** → you tap the blue arrow → swipe back → next
> person is ready.

That's **one tap per person** instead of copy → switch apps → paste → find the
contact → type the name → repeat. Six patients goes from ~20 minutes to ~1 minute.

**Want truly zero taps?** If you have a **Mac**, there's an optional add-on that
sends the whole batch completely hands-free. See
[Zero-tap on a Mac](#optional-zero-tap-on-a-mac) below.

---

## Set it up in ~5 minutes

You'll put the app online (free, via GitHub Pages) so you can open it on your
phone. **No patient information is stored in this project** — only the app
itself — so this step never exposes any patient data.

### 1. Turn on the free web page

1. On a computer, go to your repository on GitHub:
   **`github.com/williamhodgesiii-bit/followupmachine`**
2. Click **Settings** (top of the repo) → **Pages** (left sidebar).
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Set **Branch** to `claude/patient-followup-texts-86361s` and the folder to
   **`/ (root)`**, then click **Save**.
   *(Prefer it on your `main` branch? Merge this branch into `main` first, then
   pick `main` here instead.)*
5. Wait about a minute, then refresh. GitHub shows your live link — it will be:

   ### 👉 `https://williamhodgesiii-bit.github.io/followupmachine/`

> **Note:** Free GitHub Pages requires the repository to be **public**. That's
> safe here — the repo contains only the app's code, never any patient info.
> If you'd rather keep it private, GitHub Pages is included with GitHub Pro, or
> you can host the same files on any free static host (Netlify, Cloudflare Pages).

### 2. Put it on your Home Screen (iPhone)

1. Open that link in **Safari** on your iPhone.
2. Tap the **Share** button (the square with the up-arrow).
3. Tap **Add to Home Screen** → **Add**.
4. Now it opens full-screen like a real app. Do the same on your Mac/PC browser
   if you'd like it there too.

That's it — you're ready to use it.

---

## How to use it

**① Add your patients** (the *Patients* tab)

- Tap **+ Add** and enter the patient's first name.
- Choose who you usually text: **a parent** (for kids), **the patient** (adults),
  or **either / both**.
- Enter the phone number(s). You can always change who gets the text at send time.
- Got a list already? Tap **Import CSV** and use **Get import template** to see
  the exact column layout (a sample file is also in this repo:
  [`patient-import-template.csv`](patient-import-template.csv)).

**② Write your messages once** (the *Messages* tab)

- Tap **+ Add** and type a message. Drop in these fill-in-the-blank tags and they
  fill automatically for each person:
  | Tag | Becomes |
  |-----|---------|
  | `{name}` | the first name of whoever you're texting (patient *or* parent) |
  | `{patient}` | the patient's first name (handy when texting a parent) |
  | `{office}` | your name / office, set once in **Settings** |
- Three starter messages are already included — edit or delete them freely.
- Example: `Hi {name}, {office} checking in on {patient} after the recent visit — how are things feeling?`
  → *"Hi Susan, Dr. Hodges' office checking in on Jimmy after the recent visit — how are things feeling?"*

**③ Send** (the *Send* tab)

1. Pick a message at the top.
2. Check off the patients to text (or **Select all**). For "either/both"
   patients you can choose the patient, the parent, or both.
3. Tap **Start sending**.
4. For each person: tap **Open Messages & send** → tap the blue arrow in Messages
   → swipe back. The app auto-advances to the next person and tracks your progress.

> Set your name/office once under **Settings** so `{office}` fills in, and pick
> your country code there if you're outside the US.

---

## Optional: zero-tap on a Mac

If you have a Mac and want the whole batch to go out with **no taps at all**:

1. Sign in to iMessage in the **Messages** app on your Mac
   (Messages → Settings → iMessage).
2. In Follow-Up Machine, build your batch and, on the send screen, tap
   **"Have a Mac? Download a file to auto-send them all."** — this saves
   `followup-macsend.txt`.
3. Open [`tools/send-imessages.applescript`](tools/send-imessages.applescript)
   in the **Script Editor** app (already on every Mac) and press ▶ **Run**.
4. Pick the `followup-macsend.txt` file when asked. The first time, macOS will
   ask permission to control Messages — click **OK**.

Every message sends individually, with a short pause between each. Full
instructions are in the comments at the top of that script.

*(This is a power-user extra. Most people are perfectly happy with the one-tap
iPhone flow and never need it.)*

---

## Your data & privacy

- Everything you enter (patients, messages, settings) is saved **only in your
  browser on that device**. It is never sent to GitHub or any server.
- Because it's stored per-device, use **Settings → Back up all data** to save a
  file you can move to another device with **Restore from backup**.
- **Settings → Erase everything** wipes it from that device.

### A few sensible texting habits
Follow-up "checking in" texts are generally fine, but since these are patients:

- Keep it general — avoid specific medical/treatment details in a text.
- Only text people who expect to hear from your office.
- If someone replies **STOP** (or asks you to), stop texting them.
- Your office should follow the usual rules for patient communication (e.g.
  HIPAA and texting-consent/TCPA). This tool just helps you send faster; it
  doesn't change those responsibilities.

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
in `index.html`. Edit, commit, and (if you're using GitHub Pages) it updates
automatically a minute after you push.
