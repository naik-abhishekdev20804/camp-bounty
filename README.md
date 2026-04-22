# CampusHub — Bug bounty challenge

This is a small **student portal demo** used for a bug‑bounty style exercise. **Only the bugs listed below are intentional.** Everything else should behave normally.

The main app for `npm run build` / `npm start` is the **Vite + React** app (`src/`). A single-file copy lives at `index-vanilla.html` if you want to open the same UI without a build.

---

## The six bugs (describe these in simple words for participants)

1. **Profile does not really update**  
   On **My Profile**, after you change your name, email, phone, or address and click **Save Changes**, the app may show a success message, but your changes are **not actually applied** to what you see on the screen (the header and profile still show the old details).

2. **Breadcrumb keeps growing**  
   The line under the top bar (Home › …) **stacks up** as you open different pages. It does not stay as a short “where you are now” path; it can get **longer and longer** the more you navigate (until you go back to **Home** / Dashboard, which clears it).

3. **Search opens the wrong place**  
   The **search box** at the top filters results, but when you **click a result**, the app uses the **wrong item** from the list. So you may pick one course or page and land on **something else**.

4. **Notifications**  
   The **notification panel** does not follow what users usually expect. For example, **clicking outside the panel does not close it** (you have to use the bell again), and the overall behaviour may feel off compared to a normal app.

5. **Map navigation / route**  
   On the **Campus Map**, the **highlighted “gold” route** from the main gate to a building does **not** follow the same path as the **dashed walking paths** on the map, so the drawn directions can be **wrong or odd** (the UI even hints that the in‑app line may “detour”).

6. **Back button**  
   The **← Back** button in the bar below the top navigation is **not a real back**: it always sends you to **My Profile** instead of the **previous** page you were on.

---

## Scripts

- `npm run dev` — development server (hot reload)  
- `npm run build` — production build into `dist/`  
- `npm start` — serves the **built** app (run `build` first) with Vite preview on port **4173**

---

## For organizers

- Submissions that report issues **other than the six above** should be **discarded** or marked invalid, to keep scoring fair.
