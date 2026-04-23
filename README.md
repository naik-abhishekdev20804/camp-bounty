# CampusHub — Bug bounty challenge

This is a small **student portal demo** used for a bug‑bounty style exercise. **Only the bugs listed below are intentional.** Everything else should behave normally.

**Production app (what you ship):** a **Vite + React** build in `dist/`, served by a **small Node server** (`server/prod.mjs`) that only exposes static files from `dist/`. There is no server-side rendering of the UI and the bug behavior still lives in the **browser bundle** (see *Security / fairness* below).

**Organizer-only (do not host for participants):** a readable, single-file reference copy lives in **`organizer/index-vanilla.html`**. It is not part of the Vite build and is **excluded** from the Docker image. Do not put it (or the `src/` tree) on a public file host if you want to avoid “open file → paste into AI” for full source.

---

## The seven bugs (describe these in simple words for participants)

1. **Profile does not really update**  
   On **My Profile**, after you change your name, email, phone, or address and click **Save Changes**, the app may show a success message, but your changes are **not actually applied** to what you see on the screen (the header and profile still show the old details).

2. **Breadcrumb keeps growing**  
   The line under the top bar (Home › …) **stacks up** as you open different pages. It does not stay as a short “where you are now” path; it can get **longer and longer** the more you navigate (until you go back to **Home** / Dashboard, which clears it).

3. **Search routes to the wrong section**  
   The **search box** at the top shows sensible results, but when you **pick one**, the app sends you to the **wrong area** of the site on purpose. For example, a building or **Campus Map**–related result may open **Fees**, and a **Pay Fees** result may open the **map**; similar **swapped** routing applies to other result types (courses, timetable, results, library, profile, etc.).

4. **Notifications**  
   The **notification panel** does not follow what users usually expect. For example, **clicking outside the panel does not close it** (you have to use the bell again), and the overall behaviour may feel off compared to a normal app.

5. **Map navigation / route**  
   On the **Campus Map**, for all the places it is not showing the direction from currnt location to destination , but each time it is considering gate as current location

6. **Back button**  
   The **← Back** button in the bar below the top navigation is **not a real back**: it always sends you to **My Profile** instead of the **previous** page you were on.

7. **“View schedule” goes to the wrong page**  
   On the **Dashboard**, the line **“Exam Schedule Released … View schedule →”** looks like it should open an **exam timetable** or exam dates. Instead, it takes you to **Results & Grades**, which is **not** a dedicated end‑semester **exam schedule** view.

---

## Security / fairness (important)

- This is still a **single-page app**. The browser must download and run **JavaScript**. You **cannot** make the bug logic “server-only” without redesigning the product (e.g. the profile form would be validated on a server, search would be API-driven, etc.). That is a different app than this demo.
- What we **do** in production: **no source maps**, **minified** bundle, and a server that serves **only** the contents of `dist/` (so participants do not get a nice **`.jsx` tree** or **`index-vanilla.html`** from the same origin).
- A motivated person can still open DevTools → Sources/Network, load the minified `assets/*.js`, and feed it to a tool. **Hiding the repo from the public web** (only deploy `dist` + the server, never upload `src/` or `organizer/`) is the practical limit for this stack—without right-click blocking or obfuscation games.

---

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server (local development; includes `src/`) |
| `npm run build` | Production build → `dist/` (minify, **no** sourcemap) |
| `npm start` | **`NODE_ENV=production`**: run `server/prod.mjs` and serve `dist/` on **`PORT`** (default **3000**) |
| `npm run start:dev` | Same server without forcing `production` in `NODE_ENV` (useful for quick checks) |
| `npm run preview` | Vite’s own preview of `dist/` (port 4173) — optional; **`npm start` is the intended production path** |

Build before starting: `npm run build && npm start`

**Environment:** `PORT` (optional, default `3000`), `NODE_ENV=production` for stricter static caching and `trust proxy`.

**Health check:** `GET /health` → JSON `{"ok":true,"service":"campus-hub"}` (for load balancers / containers).

---

## Production deployment (Node)

1. On the build machine: `npm ci` and `npm run build`.
2. On the **runtime** host, copy: `dist/`, `server/`, `package.json`, and lockfile; run `npm ci --omit=dev` (or use Docker below).
3. **Do not** deploy `src/` or the **`organizer/`** folder (including the vanilla HTML) to public servers if you want to limit easy source recovery.

## Docker

```bash
docker build -t campus-hub .
docker run --rm -p 3000:3000 campus-hub
```

The image contains **only** the built `dist` output, the `server` folder, and production `node_modules` (no `src/`, no `organizer/`).

---

## For organizers

- Submissions that report issues **other than the seven above** should be **discarded** or marked invalid, to keep scoring fair.
- If you need a “clean room” for judging, use only the **deployed URL** to the `npm start` / Docker app—not a checkout of the full git repo in front of participants.
