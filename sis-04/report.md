# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | Antigravity CLI |
| Assistant model | Gemini 4 Hydrogen (High) |
| Starting point | week-08 |
| Baseline commit | `10ec6a3` |
| Language (ts or js) | ts |
| Vitest version | 3.2.4 |
| Where I ran the tests | Local Windows PowerShell (sis-04/app) |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
 RUN  v3.2.4 D:/MyFiles/Study/SE/practices/SE-practice/sis-04/app

 ✓ project/src/booking.test.ts (23 tests) 6ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  23:35:20
   Duration  777ms (transform 100ms, setup 0ms, collect 132ms, tests 6ms, environment 0ms, prepare 239ms)
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
sis-04/app/
  package.json                        — Vitest test runner manifest (vitest ^3.2.4)
  project/package.json                — Vite + React + TypeScript manifest (has syntax error in dependencies)
  project/index.html                  — HTML shell for the Vite app
  project/src/main.tsx                — React entrypoint mounting App
  project/src/App.tsx                 — Main page state, calls canBook() and checkAvailability(), renders panels
  project/src/booking.ts              — canBook() and getBookingIssue() implementing AC1-AC5
  project/src/booking.test.ts         — 23 Vitest unit tests covering BUG-A, BUG-B, and AC1-AC5
  project/src/types.ts                — TypeScript interfaces (Booking, Room, Decision, CheckInput, CheckResult)
  project/src/data/rooms.ts           — SAMPLE_ROOMS (8 fictional rooms, missing equipment field)
  project/src/lib/checkAvailability.ts — Maps getBookingIssue() into UI Decision + reason text
  project/src/lib/time.ts             — fmtTime(), parseTime(), nowHHMM() helpers
  project/src/components/RoomSelector.tsx — Room dropdown selector
  project/src/components/BookingForm.tsx  — Time inputs and Check/Reset buttons
  project/src/components/RoomTimeline.tsx — 24h visual bar of bookings and candidate interval
  project/src/components/DecisionPanel.tsx — Displays Available / Unavailable / Invalid decision and reason
  project/src/index.css               — Layout and responsive styles
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
I am extending our Smart Campus Room Availability Checker (starting from week-08 in sis-04/app/).
Here is the repository map of the starting code:
- sis-04/app/package.json: Vitest runner; sis-04/app/project/package.json: React + Vite + TS app
- project/src/App.tsx: page state and submit handler calling canBook() and checkAvailability()
- project/src/booking.ts: canBook() and getBookingIssue() for AC1-AC5
- project/src/booking.test.ts: 23 existing Vitest tests (AC1-AC5, BUG-A, BUG-B)
- project/src/types.ts & project/src/data/rooms.ts: Room type and SAMPLE_ROOMS (8 rooms, no equipment field)
- project/src/lib/checkAvailability.ts & project/src/lib/time.ts: detailed messages and HH:MM helpers
- project/src/components/: RoomSelector, BookingForm, RoomTimeline, DecisionPanel

Requirements to preserve (AC1-AC6):
- AC1: Reject start >= end and requests in the past.
- AC2: Enforce maximum allowed duration (120 minutes).
- AC3: Reject a blocked room.
- AC4: Reject overlaps; allow bookings that only touch at endpoints.
- AC5: Return Available / Unavailable without changing booking data.
- AC6: Clear, responsive feedback on desktop and mobile.

New requirements (F1-F5) and module contract:
- At least 4 fictional rooms in src/rooms.ts (Room type + ROOMS with id, name, capacity, equipment, blocked, bookings).
- F1: Capacity filter (room.capacity >= requested attendees) in src/filter.ts filterRooms().
- F2: Equipment filter (room contains ALL selected required items) in filterRooms().
- F3: A blocked room cannot be reported as available (checkRoom() in src/booking.ts calling canBook()).
- F4: Show a clear empty state when no rooms match.
- F5: Changing the selected room must refresh the availability result appropriately.

Constraints: fictional data only, fixed current time input, no login, no payments, no live APIs, no browser storage, no database.
Please identify maintainability risks with exact file/function references and propose a small step-by-step improvement plan without a full rewrite or code yet.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Duplicated rule evaluation and double check on submit | `project/src/booking.ts` (`canBook()`, `getBookingIssue()`) and `project/src/App.tsx` (`handleSubmit()`) | `canBook` and `getBookingIssue` both implement the same five AC1-AC5 checks independently, and `handleSubmit()` calls both `canBook()` and `checkAvailability()` then merges their results; `canBook` also retains a misleading comment (`// keep the room's list current...`). | High |
| 2 | Split manifests, broken JSON in `project/package.json`, and nested `project/` root | `sis-04/app/package.json` and `sis-04/app/project/package.json` | `app/package.json` only declares `vitest`, while the React/Vite app lives in `app/project/` whose `package.json` lines 12-13 miss a comma after `"react-dom": "^18.3.1"` and have a trailing comma on line 13, breaking `npm install`/`vite` inside `app/project/`; `.gitignore` also ignores `booking.ts`. | High |
| 3 | Missing `equipment` field, missing `filterRooms` / `checkRoom`, and silent fallback to room 0 | `project/src/types.ts`, `project/src/data/rooms.ts`, `project/src/App.tsx` | `Room` and `SAMPLE_ROOMS` have no `equipment: string[]` property for F2; `App.tsx` line 21 falls back to `SAMPLE_ROOMS[0]` when `selectedId` is missing, which would silently check the wrong room when filters yield no match (F4). | High |
| 4 | Stale generated build files and stray template markup | `project/vite.config.js`, `project/*.tsbuildinfo`, `project/index.html` | Compiled JS/d.ts artifacts (`vite.config.js`, `vite.config.d.ts`, `tsconfig*.tsbuildinfo`) are tracked alongside `.ts` sources, and `index.html` contains empty `<div>` wrappers and external `bolt.new` OpenGraph meta tags. | Low |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Consolidate the Vite + Vitest project into `sis-04/app/` (`package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/`), fix the invalid JSON comma in `dependencies`, remove stale build artifacts (`vite.config.js`, `vite.config.d.ts`, `*.tsbuildinfo`), and verify the baseline 23 Vitest tests and Vite build pass.
2. Move and extend the room catalog into `src/rooms.ts` exporting `Room` and `ROOMS` (8 fictional rooms with `id`, `name`, `capacity`, `equipment`, `blocked`, `bookings`, plus display metadata), and align `src/types.ts` without breaking existing tests.
3. Write unit tests first for `F1`, `F2`, `B5`, and `B6`, then implement `filterRooms(rooms, { attendees, equipment })` in `src/filter.ts` so capacity uses `>=` and equipment checks all selected items (`every`).
4. Write unit tests first for `F3`, `F5`, `B1–B4`, and `INT`, then add `checkRoom(rooms, roomId, request)` in `src/booking.ts` (reusing `canBook`) and unify `canBook` / `getBookingIssue` so rule checks live in one place while preserving AC1–AC5.
5. Add capacity and equipment filter controls, empty-state UI (`F4`), and immediate availability refresh / cleared stale state when changing rooms (`F5`) in `src/App.tsx` and components, keeping all rules imported from `rooms.ts`, `filter.ts`, and `booking.ts` and preserving mobile responsiveness (`AC6`).
6. Write `app/README.md`, create `diagrams/before.puml` and `diagrams/after.puml`, capture the five screenshots in `evidence/`, and complete `report.md` §4–§10 and `AI_USAGE.md`.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Exclude `blocked === true` rooms inside `filterRooms()` in `src/filter.ts` so blocked rooms never appear in the room selector. | Modified | `F1` and `F2` define `filterRooms()` by capacity and equipment only, while `F3` and `AC3` require `checkRoom()` in `src/booking.ts` (via `canBook()`) to report blocked rooms as unavailable. Keeping blocked rooms visible with a `(Blocked)` tag preserves `F3` testing on `checkRoom()`. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
