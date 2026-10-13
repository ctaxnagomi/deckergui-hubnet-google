# DGUI HUB NET — 3-Minute Demo Video Script

**Theme:** Future of Work · **Stack:** Google Cloud (Cloud Run) + Gemini · **Hard limit: 2:55**

> Goal: show a real, *governed* agent job moving between two people, executed by Gemini,
> and proven by a three-layer evidence gate — on a live deployed URL.
> Record the terminal full-screen; keep a small architecture inset in the corner.

## Pre-roll (before you hit record)
- Service up: `PORT=8090 DGUI_HUBNET_I2I_LAN_ONLY=1 GEMINI_API_KEY=<key> node dist/index.js`
- Terminal font large (16–18pt), dark background, one window only.
- Have the public-dock **rejection** and the final **all-pass** output pre-scrolled into view.
- Sign in to Cloud Run console tab for the architecture cutaway.

## Storyboard

| Time | Visual (on screen) | Voice-over | Lower-third |
|------|--------------------|------------|-------------|
| **0:00–0:12** | Cold open: a person at a desk, a job pops up on their screen; cut to black with the line *"The work is real. The trust isn't."* | "Every day, skilled people hand real work to software they can't verify. Who ran it? On what? With whose permission?" | `Future of Work` |
| **0:12–0:30** | Title card: **DGUI HUB NET** — "an agent fabric where work is portable, gated, and proven." | "This is DGUI HUB NET. Individuals route real jobs to each other; Gemini executes them; and every job is sealed with evidence you can check." | Logo |
| **0:30–0:55** | Terminal: `curl .../health` → show `engine: gemini`, `store`, and the **transport policy** (`i2i: lan-only`). | "It runs on Google Cloud Run. The engine is Gemini. And it starts from a trust boundary, not an API key." | Cloud Run · Gemini |
| **0:55–1:20** | Terminal: `POST /connect` to a **public** dock → big **REJECTED** block. Then the same call to a **LAN** dock → `ok:true`. | "A private person-to-person job over the public internet is refused before anything moves. On the local network, it's accepted — the guard is real, not a checkbox." | Transport guard |
| **1:20–1:50** | `POST /approve` → `connected`. `POST /assign` → `REQUESTED`. `POST /advance` → `MATCHED` with the persona. | "Bella approves it on her side. Alex assigns the job. The match gate attaches the right agent blueprint — the same basis as our desktop stack, now on Google's runtime." | Approval → assignment |
| **1:50–2:20** | `POST /validate` **before** execution → highlight **L1 PASS · L2 PASS · L3 FAIL**. Then `POST /execute` → Gemini runs; show `engine: gemini`, tokens, latency. | "Here's the honesty part. Before execution, the evidence gate *fails* — there's no dock agent yet. We don't pretend." | Evidence gate |
| **2:20–2:40** | `POST /validate` **after** execution → **L1 · L2 · L3 all PASS**. Cutaway: Cloud Run topology (client → Cloud Run → Gemini, Firestore). | "Gemini mints the dock agent, so the gate closes — all three layers pass. A job you can prove, not just trust." | Mintable |
| **2:40–2:55** | Deployed URL + repo + QR. Team names + tagline. | "DGUI HUB NET: governed agent work, Gemini on Cloud Run. The future of work is portable — and provable." | Links · Team |

## Shot list (files to capture)
1. `demo/hubnet-google.sh` full run (the spine — record in one take, ~35s).
2. Close-up of the **rejection** message (`REJECTED: phase-1 i2i is LAN-only`).
3. Close-up of **L3 FAIL → all PASS** transition.
4. Cloud Run console cutaway (service + revision + the Gemini secret).
5. Title card + end card (make in the deck's style).

## Narration (clean read-through, ~2:50)
> Every day, skilled people hand real work to software they can't verify. Who ran it? On
> what? With whose permission? This is DGUI HUB NET — an agent fabric where work is
> portable, gated, and proven. It runs on Google Cloud Run, and its engine is Gemini. But
> it starts from a trust boundary, not an API key: a private job over the public internet
> is refused before anything moves, and accepted only on the local network. Bella approves.
> Alex assigns. The match gate attaches the right agent blueprint. Before execution, the
> evidence gate fails — there's no dock agent yet, and we don't pretend otherwise. Gemini
> runs the job and mints the dock agent, so the gate closes: all three layers pass. A job
> you can prove, not just trust. DGUI HUB NET — governed agent work, Gemini on Cloud Run.
> The future of work is portable, and provable.

## Do / Don't
- **Do** keep it under 2:55; leave 5s of tail before the end card.
- **Do** show the failure (L3 FAIL) — the rubric rewards honesty and robustness.
- **Don't** show any API key, project id, or email on screen.
- **Don't** narrate the architecture in prose — let the terminal carry it.
