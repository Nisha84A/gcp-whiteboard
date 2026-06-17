/**
 * ClinBoard Demo Data — Study ABC-2024-001
 * Efficacy & Safety of Drug ABC/XYZ in Type 2 Diabetes · Phase 3 · 8 Subjects
 *
 * Usage (HTML): <script src="data/study-data.js"></script>
 * Variables are exposed globally and via window.CLINBOARD namespace.
 *
 * Study design:
 *   Arms:      Treatment A (Drug ABC, 50 mg QD) · Treatment B (Drug XYZ, 75 mg BID) · Placebo
 *   Sites:     Site 01 (Boston) · Site 02 (Chicago) · Site 03 (Houston)
 *   Schedule:  Screening · Day 1 · Week 2 · Week 4 · Week 8 · Week 12 (Day 85)
 *   Reference: DB Lock target Jun 30, 2026 · Study start: ~Oct 2025
 */

/* ── Subject Demographics (DM) ─────────────────────────────────────────── */
const SUBJECTS = [
  { id:'SUBJ-001', arm:'Treatment A', age:45, sex:'M', site:'Site 01', status:'Completed',    enrol:-21, vital:'ALIVE' },
  { id:'SUBJ-002', arm:'Treatment B', age:52, sex:'F', site:'Site 01', status:'Completed',    enrol:-18, vital:'ALIVE' },
  { id:'SUBJ-003', arm:'Treatment A', age:38, sex:'F', site:'Site 02', status:'Discontinued', enrol:-14, vital:'DEAD',  dthdy:32, dthcaus:'Treatment-Related AE' },
  { id:'SUBJ-004', arm:'Placebo',     age:61, sex:'M', site:'Site 02', status:'Completed',    enrol:-30, vital:'ALIVE' },
  { id:'SUBJ-005', arm:'Treatment B', age:47, sex:'F', site:'Site 03', status:'Completed',    enrol:-12, vital:'ALIVE' },
  { id:'SUBJ-006', arm:'Treatment A', age:55, sex:'M', site:'Site 03', status:'Completed',    enrol:-28, vital:'ALIVE' },
  { id:'SUBJ-007', arm:'Placebo',     age:43, sex:'F', site:'Site 01', status:'Discontinued', enrol: -9, vital:'DEAD',  dthdy:45, dthcaus:'Disease Progression' },
  { id:'SUBJ-008', arm:'Treatment B', age:59, sex:'M', site:'Site 02', status:'Completed',    enrol:-25, vital:'ALIVE' },
];

/* ── Subject Colours (for consistent chart colouring across demos) ───────── */
const SUBJ_COLORS = {
  'SUBJ-001': '#71D8C5', // teal
  'SUBJ-002': '#79AAFF', // blue
  'SUBJ-003': '#FFB347', // orange
  'SUBJ-004': '#C97DFF', // purple
  'SUBJ-005': '#FF7EB3', // pink
  'SUBJ-006': '#75D084', // green
  'SUBJ-007': '#60B8E0', // sky blue
  'SUBJ-008': '#F4A261', // amber
};

/* ── Adverse Events (AE) ───────────────────────────────────────────────── */
// Fields: s=subjid, term=AE term, sev=severity, st/en=study day onset/end, rel=relatedness
const AE = [
  { s:'SUBJ-001', term:'Headache',  sev:'MILD',     st:5,  en:12, rel:'RELATED'  },
  { s:'SUBJ-001', term:'Nausea',    sev:'MILD',     st:8,  en:15, rel:'RELATED'  },
  { s:'SUBJ-001', term:'Fatigue',   sev:'MODERATE', st:20, en:38, rel:'POSSIBLE' },
  { s:'SUBJ-002', term:'Dizziness', sev:'MILD',     st:3,  en:8,  rel:'RELATED'  },
  { s:'SUBJ-002', term:'Rash',      sev:'MODERATE', st:14, en:29, rel:'RELATED'  },
  { s:'SUBJ-002', term:'Insomnia',  sev:'MILD',     st:22, en:55, rel:'POSSIBLE' },
  { s:'SUBJ-003', term:'Headache',  sev:'SEVERE',   st:7,  en:21, rel:'RELATED'  }, // SAE
  { s:'SUBJ-003', term:'Vomiting',  sev:'SEVERE',   st:9,  en:16, rel:'RELATED'  }, // SAE
  { s:'SUBJ-004', term:'Fatigue',   sev:'MILD',     st:30, en:48, rel:'UNLIKELY' },
  { s:'SUBJ-004', term:'Headache',  sev:'MILD',     st:45, en:55, rel:'UNLIKELY' },
  { s:'SUBJ-005', term:'Nausea',    sev:'MODERATE', st:6,  en:18, rel:'RELATED'  },
  { s:'SUBJ-005', term:'Dizziness', sev:'MILD',     st:10, en:22, rel:'POSSIBLE' },
  { s:'SUBJ-006', term:'Rash',      sev:'MILD',     st:15, en:26, rel:'RELATED'  },
  { s:'SUBJ-006', term:'Headache',  sev:'MILD',     st:2,  en:9,  rel:'POSSIBLE' },
  { s:'SUBJ-007', term:'Headache',  sev:'MODERATE', st:4,  en:12, rel:'RELATED'  },
  { s:'SUBJ-007', term:'Fatigue',   sev:'SEVERE',   st:12, en:32, rel:'RELATED'  }, // SAE
  { s:'SUBJ-007', term:'Nausea',    sev:'MODERATE', st:15, en:28, rel:'RELATED'  },
  { s:'SUBJ-008', term:'Nausea',    sev:'MILD',     st:8,  en:15, rel:'POSSIBLE' },
  { s:'SUBJ-008', term:'Dizziness', sev:'MODERATE', st:18, en:36, rel:'RELATED'  },
];

/* ── Concomitant Medications (CM) ─────────────────────────────────────── */
const CM = [
  { s:'SUBJ-001', med:'Aspirin',       cat:'ANALGESIC',        st:-30,  en:90 },
  { s:'SUBJ-001', med:'Metformin',     cat:'ANTIDIABETIC',     st:-60,  en:90 },
  { s:'SUBJ-002', med:'Ibuprofen',     cat:'ANALGESIC',        st:10,   en:25 },
  { s:'SUBJ-002', med:'Lisinopril',    cat:'ANTIHYPERTENSIVE', st:-90,  en:90 },
  { s:'SUBJ-003', med:'Acetaminophen', cat:'ANALGESIC',        st:5,    en:22 },
  { s:'SUBJ-003', med:'Sertraline',    cat:'ANTIDEPRESSANT',   st:-45,  en:30 },
  { s:'SUBJ-004', med:'Atorvastatin',  cat:'ANTILIPEMIC',      st:-120, en:90 },
  { s:'SUBJ-004', med:'Aspirin',       cat:'ANALGESIC',        st:-30,  en:90 },
  { s:'SUBJ-005', med:'Metformin',     cat:'ANTIDIABETIC',     st:-45,  en:90 },
  { s:'SUBJ-005', med:'Omeprazole',    cat:'ANTACID',          st:5,    en:20 },
  { s:'SUBJ-006', med:'Lisinopril',    cat:'ANTIHYPERTENSIVE', st:-60,  en:90 },
  { s:'SUBJ-007', med:'Ibuprofen',     cat:'ANALGESIC',        st:2,    en:16 },
  { s:'SUBJ-007', med:'Sertraline',    cat:'ANTIDEPRESSANT',   st:-30,  en:35 },
  { s:'SUBJ-008', med:'Atorvastatin',  cat:'ANTILIPEMIC',      st:-90,  en:90 },
  { s:'SUBJ-008', med:'Metformin',     cat:'ANTIDIABETIC',     st:-45,  en:90 },
];

/* ── Laboratory Values — ALT (primary hepatic marker) ─────────────────── */
// ULN = 40 U/L. Flagged: SUBJ-002 Day30=72(1.8×), SUBJ-003 Day30=128(3.2×), SUBJ-007 Day45=115(2.9×)
const LABS = [
  { s:'SUBJ-001', v:28,  dy:1  }, { s:'SUBJ-001', v:35,  dy:15 }, { s:'SUBJ-001', v:42,  dy:30 }, { s:'SUBJ-001', v:38,  dy:60 }, { s:'SUBJ-001', v:31,  dy:84 },
  { s:'SUBJ-002', v:22,  dy:1  }, { s:'SUBJ-002', v:26,  dy:15 }, { s:'SUBJ-002', v:72,  dy:30 }, { s:'SUBJ-002', v:48,  dy:60 }, { s:'SUBJ-002', v:33,  dy:84 },
  { s:'SUBJ-003', v:45,  dy:1  }, { s:'SUBJ-003', v:92,  dy:15 }, { s:'SUBJ-003', v:128, dy:30 },
  { s:'SUBJ-004', v:18,  dy:1  }, { s:'SUBJ-004', v:20,  dy:15 }, { s:'SUBJ-004', v:22,  dy:30 }, { s:'SUBJ-004', v:20,  dy:60 }, { s:'SUBJ-004', v:19,  dy:84 },
  { s:'SUBJ-005', v:31,  dy:1  }, { s:'SUBJ-005', v:39,  dy:15 }, { s:'SUBJ-005', v:58,  dy:30 }, { s:'SUBJ-005', v:42,  dy:60 }, { s:'SUBJ-005', v:34,  dy:84 },
  { s:'SUBJ-006', v:26,  dy:1  }, { s:'SUBJ-006', v:29,  dy:15 }, { s:'SUBJ-006', v:33,  dy:30 }, { s:'SUBJ-006', v:27,  dy:60 }, { s:'SUBJ-006', v:25,  dy:84 },
  { s:'SUBJ-007', v:40,  dy:1  }, { s:'SUBJ-007', v:55,  dy:15 }, { s:'SUBJ-007', v:98,  dy:30 }, { s:'SUBJ-007', v:115, dy:45 },
  { s:'SUBJ-008', v:33,  dy:1  }, { s:'SUBJ-008', v:37,  dy:15 }, { s:'SUBJ-008', v:44,  dy:30 }, { s:'SUBJ-008', v:38,  dy:60 }, { s:'SUBJ-008', v:35,  dy:84 },
];

/* ── Medical History (MH) ──────────────────────────────────────────────── */
const MH = [
  { s:'SUBJ-001', term:'Type 2 Diabetes',       cat:'ENDOCRINE',        ongoing:true  },
  { s:'SUBJ-001', term:'Hypertension',           cat:'CARDIOVASCULAR',   ongoing:true  },
  { s:'SUBJ-002', term:'Hypertension',           cat:'CARDIOVASCULAR',   ongoing:true  },
  { s:'SUBJ-002', term:'Osteoarthritis',         cat:'MUSCULOSKELETAL',  ongoing:true  },
  { s:'SUBJ-003', term:'Depression',             cat:'PSYCHIATRIC',      ongoing:true  },
  { s:'SUBJ-003', term:'Migraine',               cat:'NEUROLOGICAL',     ongoing:false },
  { s:'SUBJ-004', term:'Hyperlipidemia',         cat:'ENDOCRINE',        ongoing:true  },
  { s:'SUBJ-004', term:'Coronary Artery Disease',cat:'CARDIOVASCULAR',   ongoing:true  },
  { s:'SUBJ-005', term:'Type 2 Diabetes',       cat:'ENDOCRINE',        ongoing:true  },
  { s:'SUBJ-005', term:'GERD',                   cat:'GASTROINTESTINAL', ongoing:true  },
  { s:'SUBJ-006', term:'Hypertension',           cat:'CARDIOVASCULAR',   ongoing:true  },
  { s:'SUBJ-007', term:'Depression',             cat:'PSYCHIATRIC',      ongoing:true  },
  { s:'SUBJ-007', term:'Insomnia',               cat:'PSYCHIATRIC',      ongoing:true  },
  { s:'SUBJ-008', term:'Hyperlipidemia',         cat:'ENDOCRINE',        ongoing:true  },
  { s:'SUBJ-008', term:'Type 2 Diabetes',       cat:'ENDOCRINE',        ongoing:true  },
];

/* ── Visit Schedule (SV/VS) ────────────────────────────────────────────── */
const VISITS = [
  { s:'SUBJ-001', visit:'Screening', dy:-7, complete:true  }, { s:'SUBJ-001', visit:'Day 1',   dy:1,  complete:true  },
  { s:'SUBJ-001', visit:'Week 2',    dy:15, complete:true  }, { s:'SUBJ-001', visit:'Week 4',  dy:29, complete:true  },
  { s:'SUBJ-001', visit:'Week 8',    dy:57, complete:true  }, { s:'SUBJ-001', visit:'Week 12', dy:85, complete:true  },
  { s:'SUBJ-002', visit:'Screening', dy:-7, complete:true  }, { s:'SUBJ-002', visit:'Day 1',   dy:1,  complete:true  },
  { s:'SUBJ-002', visit:'Week 2',    dy:15, complete:true  }, { s:'SUBJ-002', visit:'Week 4',  dy:29, complete:true  },
  { s:'SUBJ-002', visit:'Week 8',    dy:57, complete:true  }, { s:'SUBJ-002', visit:'Week 12', dy:85, complete:true  },
  { s:'SUBJ-003', visit:'Screening', dy:-7, complete:true  }, { s:'SUBJ-003', visit:'Day 1',   dy:1,  complete:true  },
  { s:'SUBJ-003', visit:'Week 2',    dy:15, complete:true  }, { s:'SUBJ-003', visit:'Week 4',  dy:29, complete:false },
  { s:'SUBJ-004', visit:'Screening', dy:-7, complete:true  }, { s:'SUBJ-004', visit:'Day 1',   dy:1,  complete:true  },
  { s:'SUBJ-004', visit:'Week 2',    dy:15, complete:true  }, { s:'SUBJ-004', visit:'Week 4',  dy:29, complete:true  },
  { s:'SUBJ-004', visit:'Week 8',    dy:57, complete:true  }, { s:'SUBJ-004', visit:'Week 12', dy:85, complete:true  },
  { s:'SUBJ-005', visit:'Screening', dy:-7, complete:true  }, { s:'SUBJ-005', visit:'Day 1',   dy:1,  complete:true  },
  { s:'SUBJ-005', visit:'Week 2',    dy:15, complete:true  }, { s:'SUBJ-005', visit:'Week 4',  dy:29, complete:true  },
  { s:'SUBJ-005', visit:'Week 8',    dy:57, complete:true  }, { s:'SUBJ-005', visit:'Week 12', dy:85, complete:true  },
  { s:'SUBJ-006', visit:'Screening', dy:-7, complete:true  }, { s:'SUBJ-006', visit:'Day 1',   dy:1,  complete:true  },
  { s:'SUBJ-006', visit:'Week 2',    dy:15, complete:true  }, { s:'SUBJ-006', visit:'Week 4',  dy:29, complete:true  },
  { s:'SUBJ-006', visit:'Week 8',    dy:57, complete:true  }, { s:'SUBJ-006', visit:'Week 12', dy:85, complete:true  },
  { s:'SUBJ-007', visit:'Screening', dy:-7, complete:true  }, { s:'SUBJ-007', visit:'Day 1',   dy:1,  complete:true  },
  { s:'SUBJ-007', visit:'Week 2',    dy:15, complete:true  }, { s:'SUBJ-007', visit:'Week 4',  dy:29, complete:true  },
  { s:'SUBJ-007', visit:'Week 8',    dy:57, complete:false },
  { s:'SUBJ-008', visit:'Screening', dy:-7, complete:true  }, { s:'SUBJ-008', visit:'Day 1',   dy:1,  complete:true  },
  { s:'SUBJ-008', visit:'Week 2',    dy:15, complete:true  }, { s:'SUBJ-008', visit:'Week 4',  dy:29, complete:true  },
  { s:'SUBJ-008', visit:'Week 8',    dy:57, complete:true  }, { s:'SUBJ-008', visit:'Week 12', dy:85, complete:true  },
];

/* ── Exposure / Dosing (EX) ────────────────────────────────────────────── */
const EX = [
  { s:'SUBJ-001', trt:'Drug ABC', dose:50, unit:'mg', route:'ORAL', freq:'QD',  st:1, en:84, comp:true  },
  { s:'SUBJ-002', trt:'Drug XYZ', dose:75, unit:'mg', route:'ORAL', freq:'BID', st:1, en:84, comp:true  },
  { s:'SUBJ-003', trt:'Drug ABC', dose:50, unit:'mg', route:'ORAL', freq:'QD',  st:1, en:32, comp:false },
  { s:'SUBJ-004', trt:'Placebo',  dose:0,  unit:'mg', route:'ORAL', freq:'QD',  st:1, en:84, comp:true  },
  { s:'SUBJ-005', trt:'Drug XYZ', dose:75, unit:'mg', route:'ORAL', freq:'BID', st:1, en:84, comp:true  },
  { s:'SUBJ-006', trt:'Drug ABC', dose:50, unit:'mg', route:'ORAL', freq:'QD',  st:1, en:84, comp:true  },
  { s:'SUBJ-007', trt:'Placebo',  dose:0,  unit:'mg', route:'ORAL', freq:'QD',  st:1, en:45, comp:false },
  { s:'SUBJ-008', trt:'Drug XYZ', dose:75, unit:'mg', route:'ORAL', freq:'BID', st:1, en:84, comp:true  },
];

/* ── Review Status (mutable — copy before use if demo needs clean state) ── */
const REVIEW_STATUS_INITIAL = {
  'SUBJ-001': { status:'REVIEWED',     reviewer:'Dr. M. Reyes', date:'2026-05-15' },
  'SUBJ-002': { status:'DATA_CHANGED', reviewer:'Dr. M. Reyes', date:'2026-05-14' },
  'SUBJ-003': { status:'QUERIED',      reviewer:'Dr. M. Reyes', date:'2026-05-12' },
  'SUBJ-004': { status:'NOT_REVIEWED', reviewer:null,            date:null },
  'SUBJ-005': { status:'NOT_REVIEWED', reviewer:null,            date:null },
  'SUBJ-006': { status:'REVIEWED',     reviewer:'Dr. M. Reyes', date:'2026-05-15' },
  'SUBJ-007': { status:'QUERIED',      reviewer:'Dr. M. Reyes', date:'2026-05-11' },
  'SUBJ-008': { status:'NOT_REVIEWED', reviewer:null,            date:null },
};

/* ── Open Queries / Discrepancies ─────────────────────────────────────── */
const QUERIES_INITIAL = [
  { id:'Q001', s:'SUBJ-002', domain:'LB', variable:'ALT',            priority:'HIGH',     status:'OPEN', by:'Dr. M. Reyes', date:'2026-05-14', issue:'ALT 72 U/L (1.8× ULN) at Day 30. Confirm result and assess for potential drug-induced hepatotoxicity.' },
  { id:'Q002', s:'SUBJ-003', domain:'AE', variable:'Headache (SEVERE)',priority:'CRITICAL', status:'OPEN', by:'Dr. M. Reyes', date:'2026-05-12', issue:'SEVERE headache RELATED to study drug (Day 7–21). Concurrent SEVERE vomiting (Day 9–15). Subject discontinued Day 32. SAE narrative and causality documentation required.' },
  { id:'Q003', s:'SUBJ-007', domain:'LB', variable:'ALT / AST',      priority:'CRITICAL', status:'OPEN', by:'Dr. M. Reyes', date:'2026-05-11', issue:"ALT 115 U/L + AST 105 U/L at Day 45 (final obs). Subject DECEASED. Hy's Law assessment and causality review required." },
];

/* ── Data Updates (for "New/Updated since last review" filter) ────────── */
const DATA_UPDATES = {
  'AE:SUBJ-002:Insomnia':   '2026-06-02',
  'AE:SUBJ-007:Nausea':     '2026-06-01',
  'AE:SUBJ-004:Headache':   '2026-06-03',
  'AE:SUBJ-003:Vomiting':   '2026-05-31',
  'LB:SUBJ-002:30':         '2026-06-02',
  'LB:SUBJ-007:45':         '2026-05-31',
  'LB:SUBJ-003:30':         '2026-05-31',
  'CM:SUBJ-003:Sertraline': '2026-05-31',
};

/* ── Global namespace export ──────────────────────────────────────────── */
if (typeof window !== 'undefined') {
  window.CLINBOARD = {
    SUBJECTS, SUBJ_COLORS, AE, CM, LABS, MH, VISITS, EX,
    REVIEW_STATUS_INITIAL, QUERIES_INITIAL, DATA_UPDATES,
    STUDY: {
      id: 'ABC-2024-001',
      title: 'Efficacy & Safety of Drug ABC/XYZ in T2D',
      phase: 'Phase 3',
      design: 'Randomized, Double-Blind, Placebo-Controlled',
      arms: ['Treatment A (Drug ABC 50 mg QD)', 'Treatment B (Drug XYZ 75 mg BID)', 'Placebo'],
      sites: ['Site 01 — Boston', 'Site 02 — Chicago', 'Site 03 — Houston'],
      dbLockTarget: '2026-06-30',
      altULN: 40,
    },
  };
}
