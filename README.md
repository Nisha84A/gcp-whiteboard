# ClinBoard

Clinical Trial Data Review Platform — a drag-and-drop whiteboard for reviewing and visualizing clinical trial data with AI-powered agent workflows.

## What This App Does

- **Login/Register** with user accounts (JWT-based auth)
- **Demo Hub** — central landing page with live study stats, notifications, and module navigation
- **Study Selector** — switch between multiple clinical studies with isolated data per study
- **Whiteboard Module** — drag-and-drop canvas with data tables, charts, and resizable cards
- **AI Agents Module** — scripted agent orchestration demo for automated safety signal detection
- **Concierge Module** — natural-language AI chatbot for querying study data with multi-format responses (tables, anomaly findings, patient narratives with lab charts, action buttons)
- **Query Management** — raise, track, and resolve data queries with priority/status workflow
- **Global Page Filters** — filter by Subject ID, Treatment Arm, Site, Sex, Severity, etc. across all views
- **Clickable Subject IDs** — click any subject ID in charts/tables to filter or open patient profile
- **Dark/Light theme** toggle with persistence
- **Notifications** — real-time notification panel for study events

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, MUI (Material UI) v9, Emotion |
| UI Components | Material React Table v3, Recharts, Lucide Icons |
| State Management | Redux Toolkit, React-Redux, Redux Persist |
| Routing | React Router DOM v6 |
| Drag & Drop | react-dnd (HTML5 backend) |
| Utilities | date-fns, dayjs, Zod (validation) |
| HTTP Client | Axios |
| Backend | Node.js, Express, SQLite (better-sqlite3) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Deployment | Docker (multi-stage), Google Cloud Build |

---

## Modules

The application is organized into a modular architecture under `src/modules/`:

### 1. Whiteboard Module (`src/modules/whiteboard/`)

The core data review workspace — a drag-and-drop canvas for clinical data exploration.

**Features:**
- Drag items from the sidebar catalog onto a whiteboard canvas
- Resizable and movable cards with re-resizable
- Global page filters (Subject ID, Treatment Arm, Site, Sex, Severity)
- Query panel for raising and managing data queries
- Query modal for creating new queries from table context
- Clickable subject IDs across all tables and charts

**Tables** (Material React Table with column filters):
| Table | Domain | Description |
|-------|--------|-------------|
| SubjectTable | DM | Demographics — subject listing with arm, site, sex, age |
| AETable | AE | Adverse events with severity, causality, outcome |
| LabTable | LB | Lab results — ALT, AST, Creatinine with reference ranges |
| ExposureTable | EX | Drug exposure records — dose, route, dates |
| MedHistoryTable | MH | Medical history conditions |
| ConmedTable | CM | Concomitant medications |
| VisitGrid | SV | Visit schedule/compliance grid |

**Charts** (Recharts):
| Chart | Description |
|-------|-------------|
| AESummaryChart | Bar chart — AE count by system organ class |
| AETimelineChart | Timeline — AE events across study days per subject |
| LabTrendChart | Line chart — lab parameter trends over visits |

**Panels:**
- PatientProfile — detailed single-subject view

### 2. Agents Module (`src/modules/agents/`)

AI-powered agent orchestration for automated clinical data review.

**Features:**
- Agent cards showing orchestrated AI workers (Monitor, Analyst, Checker, etc.)
- Scripted conversational interface (ConciergeChat)
- Automated safety signal detection demo
- Findings panel with audit trail
- Study overview integration

### 3. Concierge Module (`src/modules/concierge/`)

Natural-language AI chatbot interface for querying clinical study data with rich, multi-format responses.

**Features:**
- Study Context sidebar (study info, subject count, DB lock countdown, capability list)
- Conversational chat interface with typing indicators and timestamped messages
- Free-text input + suggestion button prompts
- Multiple response formats:
  - **Anomaly findings** — grouped by severity (CRITICAL/HIGH/NOTABLE) with color-coded indicators
  - **AE tables** — full adverse event listing with severity and relatedness badges
  - **Data changes** — tabular diff showing what changed since last review
  - **Patient narratives** — structured cards with demographics, lab trend charts (Recharts), alert banners, DRAFT status
  - **Query confirmations** — EDC sync status with checkmarks and audit trail
  - **Study status** — overview stats with milestone readiness assessment
- Clickable subject IDs and action buttons that trigger follow-up queries
- Scripted demo flows driven by `concierge-script.json`

**Components:**
| Component | Description |
|-----------|-------------|
| ConciergePage | Main page with sidebar + chat + input |
| ChatMessage | Renders messages by type (findings, tables, narratives, etc.) |
| StudyContextSidebar | Left panel with study metadata and capabilities |
| NarrativeCard | Patient narrative card with demographics + lab chart |
| LabTrendMini | Small Recharts line chart for ALT trends with ULN reference |

---

## Shared Infrastructure (`src/shared/`)

### Store (Redux Toolkit)

| Slice | Purpose |
|-------|---------|
| `authSlice` | User authentication state (login, logout, token, session restore) |
| `themeSlice` | Dark/light mode preference (persisted) |
| `studySlice` | Study selector — list studies, active study (persisted, defaults to "Select Study" until chosen) |
| `dataSlice` | Clinical data loading from JSON (subjects, AEs, labs, exposure, etc.) |
| `filterSlice` | Global page filter selections (Subject ID, Arm, Site, Sex, Severity) |

### Components

| Component | Description |
|-----------|-------------|
| Header | Top bar with logo, user info, study selector, theme toggle |
| StudySelector | Dropdown to switch between studies — shows "Select Study" by default, persists selection across app |
| StatsBar | Real-time stats display (subjects, sites, AEs, queries) |
| NotificationPanel | Slide-out notification list with event types |
| DemoCard | Module cards for the Demo Hub landing page |
| ProtectedRoute | Auth guard — redirects unauthenticated users to login |

### Hooks

| Hook | Description |
|------|-------------|
| `useFilteredData` | Applies global page filters to all domain data |
| `useSyncFilters` | Syncs filter state when study changes |

### Services

- `client.ts` — Axios instance with auth token interceptor
- `authApi.ts` — Login, register, verify API calls

---

## Clinical Data (Static JSON)

Study data is served from `public/` as static JSON files:

| File | Domain | Description |
|------|--------|-------------|
| `subjects.json` | DM | 8 subjects across 3 treatment arms |
| `ae.json` | AE | Adverse events |
| `labs.json` | LB | Lab test results (ALT, AST, Creatinine) |
| `ex.json` | EX | Drug exposure records |
| `mh.json` | MH | Medical history |
| `cm.json` | CM | Concomitant medications |
| `visits.json` | SV | Visit schedule |
| `queries.json` | — | Data queries (raised/resolved) |
| `notifications.json` | — | Study event notifications |
| `demo-hub.json` | — | Demo Hub page content |
| `agents-script.json` | — | Agent orchestration script |
| `concierge-script.json` | — | Concierge chatbot conversation flows |
| `review-status.json` | — | Review workflow status |
| `studies/index.json` | — | Study registry (multi-study support) |
| `studies/*.json` | — | Per-study configuration and metadata |

---

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/` | Demo Hub | Protected |
| `/whiteboard` | Whiteboard | Protected |
| `/agents` | AI Agents | Protected |
| `/concierge` | Concierge | Protected |

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
├── backend/                           # Node.js API server
│   ├── src/
│   │   ├── server.ts                  # Express entry point (port 3001)
│   │   ├── db.ts                      # SQLite database setup + seed
│   │   ├── middleware/
│   │   │   └── auth.ts                # JWT verification middleware
│   │   └── routes/
│   │       └── auth.ts                # Login, Register, Me endpoints
│   └── package.json
├── public/                            # Static clinical data (JSON files)
│   ├── studies/                       # Multi-study data directory
│   │   ├── index.json                 # Study registry
│   │   └── *.json                     # Per-study config
│   ├── subjects.json                  # Demographics
│   ├── ae.json                        # Adverse events
│   ├── labs.json                      # Lab results
│   ├── ex.json                        # Drug exposure
│   ├── mh.json                        # Medical history
│   ├── cm.json                        # Concomitant medications
│   ├── visits.json                    # Visit schedule
│   ├── queries.json                   # Data queries
│   ├── notifications.json             # Study notifications
│   ├── demo-hub.json                  # Demo Hub content
│   ├── agents-script.json             # Agent orchestration script
│   ├── concierge-script.json          # Concierge chatbot flows
│   └── review-status.json             # Review workflow status
├── src/                               # React frontend
│   ├── App.tsx                        # Router + Theme + DnD providers
│   ├── main.tsx                       # Entry point
│   ├── pages/
│   │   ├── Login.tsx                  # Login form
│   │   ├── Register.tsx               # Registration form
│   │   └── DemoHub.tsx                # Landing page with modules
│   ├── modules/
│   │   ├── whiteboard/                # Whiteboard Module
│   │   │   ├── pages/
│   │   │   │   └── WhiteboardPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── Whiteboard.tsx     # Drop zone canvas
│   │   │   │   ├── WhiteboardItem.tsx # Resizable card
│   │   │   │   ├── Navigation.tsx     # Left sidebar catalog
│   │   │   │   ├── NavItem.tsx        # Draggable catalog item
│   │   │   │   ├── PageFilters.tsx    # Global filter bar
│   │   │   │   ├── FilterBar.tsx      # Filter chip bar
│   │   │   │   ├── QueryPanel.tsx     # Query management panel
│   │   │   │   ├── QueryModal.tsx     # New query form
│   │   │   │   ├── Visualization.tsx  # Routes to table/chart
│   │   │   │   ├── tables/            # Clinical data tables
│   │   │   │   │   ├── SubjectTable.tsx
│   │   │   │   │   ├── AETable.tsx
│   │   │   │   │   ├── LabTable.tsx
│   │   │   │   │   ├── ExposureTable.tsx
│   │   │   │   │   ├── MedHistoryTable.tsx
│   │   │   │   │   ├── ConmedTable.tsx
│   │   │   │   │   ├── VisitGrid.tsx
│   │   │   │   │   ├── ClickableSubjectCell.tsx
│   │   │   │   │   └── tableConfig.tsx
│   │   │   │   ├── charts/            # Recharts visualizations
│   │   │   │   │   ├── AESummaryChart.tsx
│   │   │   │   │   ├── AETimelineChart.tsx
│   │   │   │   │   └── LabTrendChart.tsx
│   │   │   │   └── panels/
│   │   │   │       └── PatientProfile.tsx
│   │   │   └── utils/
│   │   │       └── dataLoader.ts      # Catalog item builder
│   │   ├── agents/                    # AI Agents Module
│   │   │   ├── pages/
│   │   │   │   └── AgentsPage.tsx
│   │   │   └── components/
│   │   │       ├── AgentCard.tsx
│   │   │       └── ConciergeChat.tsx
│   │   └── concierge/                 # Concierge Module
│   │       ├── pages/
│   │       │   └── ConciergePage.tsx   # Main chat interface
│   │       └── components/
│   │           ├── ChatMessage.tsx     # Multi-format message renderer
│   │           ├── StudyContextSidebar.tsx
│   │           ├── NarrativeCard.tsx   # Patient narrative card
│   │           └── LabTrendMini.tsx    # Mini lab trend chart
│   └── shared/                        # Shared infrastructure
│       ├── types.ts                   # TypeScript interfaces
│       ├── theme.ts                   # MUI dark/light themes
│       ├── store/                     # Redux store
│       │   ├── index.ts              # Store config + typed hooks
│       │   ├── authSlice.ts
│       │   ├── themeSlice.ts
│       │   ├── studySlice.ts
│       │   ├── dataSlice.ts
│       │   └── filterSlice.ts
│       ├── components/                # Shared UI components
│       │   ├── Header.tsx
│       │   ├── StudySelector.tsx
│       │   ├── StatsBar.tsx
│       │   ├── NotificationPanel.tsx
│       │   ├── DemoCard.tsx
│       │   └── ProtectedRoute.tsx
│       ├── hooks/
│       │   ├── useFilteredData.ts
│       │   └── useSyncFilters.ts
│       └── services/api/
│           ├── client.ts              # Axios + auth interceptor
│           └── authApi.ts
├── Dockerfile                         # Multi-stage Docker build
├── cloudbuild.yaml                    # Google Cloud Build config
├── package.json
├── vite.config.ts                     # Vite config (path alias, API proxy)
├── tailwind.config.js
└── tsconfig.json
```

---

## Deployment

The app is containerized with a multi-stage Docker build and deploys to Google Cloud Platform via Cloud Build:

- **Stage 1:** Builds the Vite/TypeScript frontend
- **Stage 2:** Runs the Node.js backend serving the built static files
- **CI/CD:** `cloudbuild.yaml` triggers on push to deploy to GCP

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
