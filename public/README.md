# ClinBoard Demo Data — Study ABC-2024-001

Synthetic clinical trial dataset used across all three ClinBoard interactive demos.
**All data is fictitious and for demonstration purposes only.**

## Study Context

| Field | Value |
|---|---|
| Study ID | ABC-2024-001 |
| Title | Efficacy & Safety of Drug ABC/XYZ in Type 2 Diabetes |
| Phase | Phase 3, Randomized, Double-Blind, Placebo-Controlled |
| Arms | Treatment A (Drug ABC 50 mg QD) · Treatment B (Drug XYZ 75 mg BID) · Placebo |
| Sites | Site 01 (Boston) · Site 02 (Chicago) · Site 03 (Houston) |
| Subjects | 8 (6 completed, 2 discontinued) |
| DB Lock | Jun 30, 2026 |

---

## How to Use

### Option A — Include the combined JS module (recommended for HTML demos)

```html
<script src="data/study-data.js"></script>
<script>
  // All datasets are available as globals: SUBJECTS, AE, CM, LABS, etc.
  // Also accessible via window.CLINBOARD.SUBJECTS, window.CLINBOARD.AE, etc.
  console.log(SUBJECTS);
</script>
```

### Option B — Import individual JSON files (for frameworks / Node)

```javascript
import subjects from './data/subjects.json';
import ae       from './data/ae.json';
import cm       from './data/cm.json';
// etc.
```

### Option C — Fetch at runtime

```javascript
const [subjects, ae, cm] = await Promise.all([
  fetch('data/subjects.json').then(r => r.json()),
  fetch('data/ae.json').then(r => r.json()),
  fetch('data/cm.json').then(r => r.json()),
]);
```

---

## Files

| File | Description | Records |
|---|---|---|
| `study-data.js` | **All datasets in one file** — drop in with `<script>` | All |
| `subjects.json` | Subject demographics | 8 |
| `ae.json` | Adverse events | 19 |
| `cm.json` | Concomitant medications | 15 |
| `labs.json` | Lab results — ALT, AST, Creatinine | 55 |
| `mh.json` | Medical history / prior conditions | 15 |
| `visits.json` | Visit schedule & completion | 44 |
| `ex.json` | Exposure / dosing | 8 |
| `queries.json` | Open data queries / discrepancies | 3 |
| `review-status.json` | Per-subject review status | 8 |
| `data-updates.json` | Records updated since last review | 8 keys |

---

## Data Dictionary

### subjects.json

| Field | Type | Description |
|---|---|---|
| `id` | string | Subject identifier (SUBJ-001 … SUBJ-008) |
| `arm` | string | Treatment arm: `Treatment A` / `Treatment B` / `Placebo` |
| `age` | number | Age at baseline (years) |
| `sex` | string | `M` or `F` |
| `site` | string | Enrolling site (`Site 01` / `Site 02` / `Site 03`) |
| `status` | string | Study status: `Completed` or `Discontinued` |
| `enrol` | number | Study day of enrollment (negative = pre-Day 1) |
| `vital` | string | Vital status: `ALIVE` or `DEAD` |
| `dthdy` | number | Study day of death (only if `vital = DEAD`) |
| `dthcaus` | string | Cause of death (only if `vital = DEAD`) |

### ae.json (CDISC AE domain field naming)

| Field | Type | Description |
|---|---|---|
| `subjid` | string | Subject ID |
| `aeterm` | string | AE verbatim term |
| `aesev` | string | Severity: `MILD` / `MODERATE` / `SEVERE` |
| `aestdy` | number | AE start day (study day) |
| `aeendy` | number | AE end day (study day) |
| `aerel` | string | Relatedness: `RELATED` / `POSSIBLE` / `UNLIKELY` |

**Safety flags:** SUBJ-003 (SEVERE Headache + Vomiting, both RELATED → SAE, led to discontinuation Day 32). SUBJ-007 (SEVERE Fatigue, RELATED → SAE).

### cm.json (CDISC CM domain)

| Field | Type | Description |
|---|---|---|
| `subjid` | string | Subject ID |
| `cmdecod` | string | Standardised medication name |
| `cmcat` | string | Medication category (e.g. `ANALGESIC`, `ANTIDIABETIC`) |
| `cmstdy` | number | Medication start day (negative = pre-study) |
| `cmendy` | number | Medication end day |

### labs.json (CDISC LB domain)

| Field | Type | Description |
|---|---|---|
| `subjid` | string | Subject ID |
| `lbtest` | string | Lab test name: `ALT` / `AST` / `Creatinine` |
| `lbstresn` | number | Numeric result |
| `lbstresu` | string | Unit (`U/L` or `mg/dL`) |
| `lbdy` | number | Study day of collection |
| `lbnrlo` | number | Normal range lower limit |
| `lbnrhi` | number | Normal range upper limit (ALT ULN = 40 U/L) |

**Safety flags (Hy's Law candidates):**
- SUBJ-002: ALT 72 U/L at Day 30 (1.8× ULN)
- SUBJ-003: ALT 128 U/L at Day 30 (3.2× ULN) + AST 102 U/L
- SUBJ-007: ALT 115 U/L at Day 45 (2.9× ULN) + AST 105 U/L (subject deceased)

### mh.json (CDISC MH domain)

| Field | Type | Description |
|---|---|---|
| `subjid` | string | Subject ID |
| `mhdecod` | string | Standardised condition name |
| `mhcat` | string | Condition category |
| `mhoccur` | string | Always `Y` (condition occurred) |
| `mhstat` | string | `ONGOING` or `RESOLVED` |

### visits.json

| Field | Type | Description |
|---|---|---|
| `subjid` | string | Subject ID |
| `visit` | string | Visit name (`Screening` / `Day 1` / `Week 2` / `Week 4` / `Week 8` / `Week 12`) |
| `visitdy` | number | Scheduled study day |
| `complete` | boolean | Whether the visit was completed |

**Missed visits:** SUBJ-003 Week 4 (discontinued), SUBJ-007 Week 8 (discontinued).

### ex.json (CDISC EX domain)

| Field | Type | Description |
|---|---|---|
| `subjid` | string | Subject ID |
| `extrt` | string | Treatment: `Drug ABC` / `Drug XYZ` / `Placebo` |
| `exdose` | number | Dose amount (0 = placebo) |
| `exdosu` | string | Dose unit (`mg`) |
| `exroute` | string | Route of administration (`ORAL`) |
| `exdosfrq` | string | Dosing frequency (`QD` = once daily, `BID` = twice daily) |
| `exstdy` | number | First dose day |
| `exendy` | number | Last dose day |
| `excomp` | boolean | Whether full course was completed |

### queries.json

| Field | Type | Description |
|---|---|---|
| `id` | string | Query ID (Q001, Q002, …) |
| `subjid` | string | Subject ID |
| `domain` | string | CDISC domain (LB, AE, CM, …) |
| `variable` | string | Specific variable or data point |
| `issue` | string | Query description |
| `priority` | string | `CRITICAL` / `HIGH` / `MEDIUM` / `LOW` |
| `status` | string | `OPEN` / `CLOSED` / `ANSWERED` |
| `raisedBy` | string | Reviewer name |
| `raisedDate` | string | ISO date |

### review-status.json

| Field | Type | Description |
|---|---|---|
| `SUBJ-XXX` | object | Per-subject review state |
| `.status` | string | `NOT_REVIEWED` / `REVIEWED` / `DATA_CHANGED` / `QUERIED` |
| `.reviewer` | string\|null | Reviewer name (null if not yet reviewed) |
| `.reviewedDate` | string\|null | ISO date of last review action |

### data-updates.json

Maps data record keys to the date those records were last updated in the source system.
Used by the "New / Updated since last review" filter in the whiteboard demo.

Key format: `DOMAIN:SUBJID:IDENTIFIER`

Example: `"AE:SUBJ-002:Insomnia": "2026-06-02"` means the Insomnia AE for SUBJ-002 was added/updated on Jun 2, 2026.

---

## Subject Summary

| Subject | Arm | Key Safety Notes |
|---|---|---|
| SUBJ-001 | Treatment A | ALT mildly elevated at Day 30 (42 U/L, at ULN). Review complete. |
| SUBJ-002 | Treatment B | ALT 72 U/L (1.8× ULN) at Day 30. Open query Q001. Data changed flag. |
| SUBJ-003 | Treatment A | SEVERE AEs (Headache + Vomiting, both RELATED). Discontinued Day 32. DECEASED. Open query Q002. |
| SUBJ-004 | Placebo | No significant safety signals. Not yet reviewed. |
| SUBJ-005 | Treatment B | ALT 58 U/L at Day 30 (1.45× ULN). Not yet reviewed. |
| SUBJ-006 | Treatment A | Minor AEs. Review complete. |
| SUBJ-007 | Placebo | SEVERE Fatigue (RELATED). ALT/AST elevated at Day 45. DECEASED (Day 45, Disease Progression). Open query Q003. |
| SUBJ-008 | Treatment B | ALT mildly elevated at Day 30. Not yet reviewed. |

---

## Demo Files

| Demo | File | Uses |
|---|---|---|
| Whiteboard | `output/whiteboard-demo.html` | All datasets + review status + queries + data-updates |
| DM Concierge | `output/dm-concierge.html` | SUBJECTS, AE, CM, LABS, MH + QUERIES (for narrative context) |
| AI Agents | `output/agents-demo.html` | Scripted scenario (inline data, no external files needed) |

## Colour Palette

Each subject has a consistent colour used across all visualisations:

| Subject | Hex | Colour |
|---|---|---|
| SUBJ-001 | `#71D8C5` | Teal |
| SUBJ-002 | `#79AAFF` | Blue |
| SUBJ-003 | `#FFB347` | Orange |
| SUBJ-004 | `#C97DFF` | Purple |
| SUBJ-005 | `#FF7EB3` | Pink |
| SUBJ-006 | `#75D084` | Green |
| SUBJ-007 | `#60B8E0` | Sky Blue |
| SUBJ-008 | `#F4A261` | Amber |
