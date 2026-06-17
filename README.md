# ClinBoard

Clinical Trial Data Review Platform — a drag-and-drop whiteboard for reviewing and visualizing clinical trial data.

## What This App Does

- **Login/Register** with user accounts (JWT-based auth)
- **Dashboard** with a sidebar catalog of clinical data views
- **Drag and drop** listings (tables) and visualizations (charts) onto a whiteboard canvas
- **Material React Table** with working column filters (select, range, text) for all clinical domains
- **Charts** (Recharts) — AE Summary, AE Timeline, Lab Trend
- **Global Page Filters** — filter by Subject ID, Treatment Arm, Site, Sex, Severity, etc. All whiteboard items update simultaneously
- **Dark/Light theme** toggle
- **Resizable and movable cards** on the whiteboard

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| UI Components | Material React Table, MUI, Recharts, Lucide Icons |
| State Management | Zustand (auth, theme, data, filters) |
| Drag & Drop | react-dnd |
| Backend | Node.js, Express, SQLite (better-sqlite3) |
| Auth | JWT (jsonwebtoken), bcryptjs |

---

## Prerequisites

Make sure you have these installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** — [Download](https://git-scm.com/)

Check with:
```bash
node --version   # should show v18+
npm --version
git --version
```

---

## Getting Started (Step by Step)

### 1. Clone the repository

```bash
git clone git@github.com:Nisha84A/gcp-whiteboard.git
cd gcp-whiteboard
```

### 2. Install dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### 3. Start the backend server

```bash
cd backend
npm run dev
```

You should see:
```
Database initialized
ClinBoard API running on http://localhost:3001
```

### 4. Start the frontend (in a new terminal)

```bash
# From the project root (not backend/)
npm run dev
```

You should see:
```
VITE ready at http://localhost:5173/
```

### 5. Open the app

Go to http://localhost:5173 in your browser.

**Default login credentials:**
- Email: `maria.reyes@trial.com`
- Password: `ClinBoard2024!`

Or register a new account.

---

## Project Structure

```
gcp-whiteboard/
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── server.ts        # Express entry point (port 3001)
│   │   ├── db.ts            # SQLite database setup + seed
│   │   ├── middleware/
│   │   │   └── auth.ts      # JWT verification middleware
│   │   └── routes/
│   │       └── auth.ts      # Login, Register, Me endpoints
│   └── package.json
├── public/                   # Static clinical data (JSON files)
│   ├── subjects.json         # 8 subjects across 3 treatment arms
│   ├── labs.json             # Lab test results (ALT, AST, Creatinine)
│   ├── ae.json              # Adverse events
│   ├── ex.json              # Drug exposure records
│   ├── mh.json             # Medical history
│   ├── cm.json             # Concomitant medications
│   └── visits.json          # Visit schedule
├── src/                      # React frontend
│   ├── App.tsx              # Router + Theme + DnD providers
│   ├── main.tsx             # Entry point
│   ├── theme.ts             # MUI dark/light themes
│   ├── types.ts             # All TypeScript interfaces
│   ├── pages/
│   │   ├── Login.tsx        # Login form
│   │   ├── Register.tsx     # Registration form
│   │   └── Dashboard.tsx    # Main app page
│   ├── components/
│   │   ├── Header.tsx       # Top bar (logo, user info, theme toggle)
│   │   ├── PageFilters.tsx  # Global filter bar (Subject, Arm, Site, etc.)
│   │   ├── Navigation.tsx   # Left sidebar catalog
│   │   ├── NavItem.tsx      # Draggable catalog item
│   │   ├── Whiteboard.tsx   # Drop zone canvas
│   │   ├── WhiteboardItem.tsx # Resizable card on whiteboard
│   │   ├── Visualization.tsx  # Routes to correct table/chart
│   │   ├── tables/          # Material React Table components
│   │   │   ├── SubjectTable.tsx
│   │   │   ├── LabTable.tsx
│   │   │   ├── AETable.tsx
│   │   │   ├── ExposureTable.tsx
│   │   │   ├── MedHistoryTable.tsx
│   │   │   └── ConmedTable.tsx
│   │   └── charts/          # Recharts visualization components
│   │       ├── AESummaryChart.tsx
│   │       ├── AETimelineChart.tsx
│   │       └── LabTrendChart.tsx
│   ├── stores/              # Zustand state management
│   │   ├── authStore.ts     # User authentication state
│   │   ├── dataStore.ts     # Clinical data (fetched from JSON)
│   │   ├── filterStore.ts   # Global page filter selections
│   │   └── themeStore.ts    # Dark/light preference
│   ├── hooks/
│   │   └── useFilteredData.ts  # Applies page filters to all data
│   ├── services/api/
│   │   ├── client.ts        # Axios instance with auth interceptor
│   │   └── authApi.ts       # Login/register/verify API calls
│   └── utils/
│       └── dataLoader.ts    # Builds the catalog item list
├── package.json
├── vite.config.ts           # Vite config (path alias, API proxy)
├── tailwind.config.js
└── tsconfig.json
```

---

## Git Workflow (Branching Strategy)

We use a **main + develop** branching model:

```
main        ← production-ready code (deployed)
  └── develop    ← integration branch for active work
        ├── feature/xyz    ← new features
        └── fix/abc        ← bug fixes
```

### Rules

- **Never push directly to `main`** — always merge from `develop`
- **Never push directly to `develop`** — always merge from a feature/fix branch
- `main` = what's deployed
- `develop` = latest working code ready for next release

### Day-to-day workflow

#### Starting new work

```bash
# Make sure you're on develop and up to date
git checkout develop
git pull origin develop

# Create your feature branch
git checkout -b feature/add-vital-signs-chart
```

#### Working and committing

```bash
# Check what you changed
git status

# Stage specific files
git add src/components/charts/VitalSignsChart.tsx
git add src/components/Visualization.tsx

# Commit with a clear message
git commit -m "Add vital signs chart component"

# Push your branch to remote
git push origin feature/add-vital-signs-chart
```

#### Merging into develop (when feature is complete)

```bash
# Switch to develop
git checkout develop
git pull origin develop

# Merge your feature
git merge feature/add-vital-signs-chart

# Push updated develop
git push origin develop

# Delete the feature branch (cleanup)
git branch -d feature/add-vital-signs-chart
git push origin --delete feature/add-vital-signs-chart
```

#### Deploying to main (when develop is stable)

```bash
# Switch to main
git checkout main
git pull origin main

# Merge develop into main
git merge develop

# Push to main (triggers deploy)
git push origin main

# Go back to develop for next work
git checkout develop
```

### Branch naming conventions

| Type | Pattern | Example |
|------|---------|---------|
| New feature | `feature/description` | `feature/add-query-panel` |
| Bug fix | `fix/description` | `fix/filter-not-applying` |
| Hotfix (urgent prod fix) | `hotfix/description` | `hotfix/login-crash` |

---

## Common Commands Reference

| What you want to do | Command |
|---------------------|---------|
| Start frontend | `npm run dev` |
| Start backend | `cd backend && npm run dev` |
| Build for production | `npm run build` |
| Type check | `npx tsc --noEmit` |
| See current branch | `git branch` |
| See all branches | `git branch -a` |
| Check what's changed | `git status` |
| See commit history | `git log --oneline -10` |
| Undo uncommitted changes to a file | `git checkout -- filename` |
| Pull latest from remote | `git pull origin <branch-name>` |

---

## Environment Details

- Frontend runs on: `http://localhost:5173`
- Backend runs on: `http://localhost:3001`
- Vite proxies `/api` calls to the backend automatically
- SQLite database is created at `backend/data/clinboard.db` on first run
- Default user is seeded automatically (Dr. Maria Reyes)

---

## Troubleshooting

**"Module not found" errors:**
```bash
npm install   # run from project root
```

**Backend won't start (port in use):**
```bash
lsof -ti:3001 | xargs kill -9
cd backend && npm run dev
```

**Frontend won't start (port in use):**
```bash
lsof -ti:5173 | xargs kill -9
npm run dev
```

**Login not working:**
Make sure the backend is running in a separate terminal before opening the frontend.
