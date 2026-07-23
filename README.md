# Tomo 7 Sushi — Riverside, CA

A single-page website for **Tomo 7 Japanese Restaurant** (5519 Van Buren Blvd, Riverside, CA 92503).
Black / dark-red / white theme with smooth transitions. Built as static files — no build step.

## Files
- `index.html` — the whole site (hero, all-you-can-eat, about, full menu, hours, location, ordering)
- `styles.css` — theme + layout + animations
- `script.js` — sticky header, mobile menu, scroll reveals, menu tabs, live "open now" status
- `assets/` — logo, hero and food photos (extracted from the menu PDF)
- `favicon.svg`

## Ordering
- **Pick-up:** links call `(951) 343-5991`
- **Delivery:** DoorDash button → https://www.doordash.com/en/store/tomo-7-riverside-814011/

## Preview locally
```bash
cd tomo7
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy with GitHub Pages
1. Commit and push these files to a GitHub repo (root of the repo).
2. On GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/(root)**, then **Save**.
5. Your site goes live at `https://<username>.github.io/<repo>/` in a minute or two.

## Updating the menu / details
Everything is editable in `index.html`:
- **Hours** — the `<ul class="hours-list">` block. Also update the `schedule` object in `script.js` so the live "Open now" badge stays accurate.
- **Menu items** — each item is one `<div class="mi">…</div>` row inside its category panel.
- **Phone / address / DoorDash** — search `index.html` for `9513435991`, `Van Buren`, or `doordash`.
