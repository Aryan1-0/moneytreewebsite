# 🌳 TreeGrow

**Plant a tree. Build a greener future.** TreeGrow connects crypto with real-world
impact — plant verified trees, earn on-chain rewards, and track your impact in
real time.

This repo contains the marketing site **and** an investor-facing admin dashboard.

---

## ✨ Features

### Marketing site (`/`)
- Cinematic hero with the floating-island tree **blended into the ambient scene**
  (soft radial mask + matching gradient + glow — no visible image "box").
- Animated stat counters, feature grid, "how it works", tokenomics donut, and CTA.
- Smooth scroll-reveal motion throughout (Framer Motion).
- Footer with newsletter, link columns, and community — matching the brand design.

### Admin panel (`/admin`)
- Demo login gate (`admin@treegrow.io` / `greener`, pre-filled).
- **Overview** — KPI cards with sparklines, user/tree growth area chart, revenue
  bars, tree-species donut, acquisition breakdown, retention meter.
- **Live activity feed** — simulated real-time network events.
- **Live world map** — dependency-free SVG map with lat/lng-projected user hubs,
  pulsing markers, connection arcs, and hover tooltips.
- **Users** — searchable, filterable, sortable, paginated users table.

---

## 🧰 Tech stack

| Area        | Choice                              |
| ----------- | ----------------------------------- |
| Build       | Vite + React 18 + TypeScript        |
| Styling     | Tailwind CSS (custom brand palette) |
| Motion      | Framer Motion                       |
| Charts      | Recharts                            |
| Icons       | lucide-react                        |
| Routing     | React Router                        |

---

## 🚀 Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
```

---

## 📁 Structure

```
src/
├─ components/
│  ├─ layout/     Navbar, Footer, Logo
│  ├─ ui/         Button, Reveal
│  ├─ home/       Hero, Features, HowItWorks, Tokenomics, CTA, Fireflies
│  └─ admin/      AdminLayout, StatCard, Panel, Charts, WorldMap, UsersTable, ActivityFeed
├─ pages/         Home, AdminLogin, AdminDashboard, AdminUsers, AdminMap
├─ lib/           auth, mockData, projection
└─ hooks/         useCountUp
```

## 🔌 Wiring real data

All admin figures live in [`src/lib/mockData.ts`](src/lib/mockData.ts) and auth in
[`src/lib/auth.ts`](src/lib/auth.ts). Replace those two modules with your API calls
to go live — every component reads from them, so nothing else needs to change.

> The tree artwork lives at `public/tree.png`.
