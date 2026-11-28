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

- **Room catalog (`app/src/rooms.ts`):** Added `Room`, `Booking`, and `EQUIPMENT_OPTIONS` along with `ROOMS`, an 8-room fictional campus catalog (`r-001` through `r-008`), each having `id`, `name`, `building`, `floor`, `capacity`, `type`, `equipment`, `blocked`, and `bookings`.
- **Filtering (`app/src/filter.ts`):** Added `filterRooms(rooms, { attendees, equipment })`, keeping rooms whose `capacity >= attendees` (`F1`) and whose `equipment` contains every selected required item (`F2`, case-insensitive check via `Set` and `every()`).
- **Room-scoped availability (`app/src/booking.ts`):** Added `checkRoom(rooms, roomId, { start, end, now })`, which looks up the selected room by `roomId` and delegates to `canBook()` with that room's own `blocked` flag and `bookings` (`F3`, `F5`, `AC1`–`AC5`).
- **Page controls and states (`app/src/components/FilterBar.tsx`, `app/src/components/RoomSelector.tsx`, `app/src/App.tsx`):** Added an attendees number input, equipment toggle chips, and a reset filters button. Blocked rooms stay visible with a `Blocked` label while `checkRoom()` reports them unavailable (`F3`). When no rooms match, `RoomSelector` renders an empty state with `Reset filters` and the right panel shows a matching empty message (`F4`). Selecting another room keeps the entered times and recomputes `result` immediately via `useMemo` (`F5`).

### 4.2 Demonstration

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees set to `30` with `Projector` and `Whiteboard` selected; `Showing 2 of 8 rooms` (`Engineering Hall A` cap 120 and `Robotics Lab` cap 35), with `Engineering Hall A` selected. |
| `evidence/filter-empty.png` | Attendees set to `400` with `Projector` and `Whiteboard` selected; `Showing 0 of 8 rooms` and the empty-state message `No rooms match your requirements` (`F4`) with `Reset filters`. |
| `evidence/switch-a.png` | Filters reset (`Attendees = 1`), `Engineering Hall A` selected, `Current time` `09:00`, `Start` `10:00`, `End` `11:00`; result shows `Available` (`Interval 10:00–11:00 is available (60 min).`). |
| `evidence/switch-b.png` | Same times (`09:00`, `10:00`–`11:00`) after clicking `Newton Auditorium`; result refreshes immediately to `Unavailable` (`Overlaps an existing booking (10:00–12:00). Touching endpoints are allowed.`) (`F5`). |
| `evidence/narrow.png` | Page rendered at portrait phone width (`390x844`), stacking the filter and room selector above the schedule and check panel without horizontal overflow (`AC6`). |

## 5. Refactoring (Task 3)

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Defines `Booking`, `Room`, `EQUIPMENT_OPTIONS`, and the 8-room fictional `ROOMS` catalog. |
| `src/booking.ts` | Implements `canBook()` (`AC1`–`AC5`), `getBookingIssue()` (detailed rejection reason), and `checkRoom()` (`F3`, `F5`). |
| `src/filter.ts` | Implements `filterRooms(rooms, criteria)` for capacity (`F1`) and all-required-equipment (`F2`) filtering. |
| `src/lib/checkAvailability.ts` | Delegates boolean availability to `checkRoom()` and formats human-readable `CheckResult` feedback using `getBookingIssue()` and `fmtTime()`. |
| `src/lib/time.ts` | Provides pure `HH:MM` parsing and formatting helpers (`fmtTime`, `parseTime`, `nowHHMM`). |
| `src/App.tsx` & `src/components/` | `App.tsx`, `FilterBar.tsx`, `RoomSelector.tsx`, `BookingForm.tsx`, `RoomTimeline.tsx`, and `DecisionPanel.tsx` manage UI state and presentation without holding room data or duplicating domain rules. |

### 5.2 Design decisions

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep blocked rooms in `filterRooms()` results with a `Blocked` badge in `RoomSelector.tsx` and let `checkRoom()` reject them. | Filter out `room.blocked === true` inside `filterRooms()` so blocked rooms never appear in the list. | `F1` and `F2` define `filterRooms()` by capacity and equipment only, while `F3` and `AC3` require `checkRoom()` (via `canBook()`) to report blocked rooms as unavailable and keep `F3` directly testable. |
| Derive `result` in `App.tsx` via `useMemo` from `submitted`, `room`, `filteredRooms`, and time inputs. | Store a separate `result` state and reset it to `null` inside `RoomSelector`'s `onSelect`. | `F5` requires the availability result to refresh when changing the selected room; deriving `result` from `checkAvailability()` guarantees it always reflects the chosen room's bookings without stale state. |
| Fall back to `null` (`filteredRooms.find(...) ?? filteredRooms[0] ?? null`) in `App.tsx` when no room matches. | Keep the baseline fallback `ROOMS[0]` whenever `selectedId` is absent from the list. | Falling back to `ROOMS[0]` on an empty filter result would mask the `F4` empty state and evaluate a room that failed the user's filter criteria (Risk #3). |

### 5.3 Duplication removed

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `project/src/booking.ts` (`getBookingIssue()`) and `project/src/App.tsx` (`handleSubmit()`) both evaluated AC1–AC5 rules alongside `canBook()` and merged two results on submit. | `src/booking.ts`: `canBook()` is the single availability gate used by `checkRoom()` and `getBookingIssue()`, and `App.tsx` calls `checkAvailability()` once. |
| `project/src/App.tsx` stored both `submitted` and `result` states and updated/cleared both across `handleSubmit` and `clearResult`. | `src/App.tsx` tracks `submitted` only and computes `result` with `useMemo` from the active room and inputs. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `AC1: rejects a start before minute zero independently of the current time` | `start=-1, end=60, now=-10, blocked=false, bookings=[]` → `false` |
| AC2 | `T06: accepts exactly 120 minutes` | `start=720, end=840, now=540, blocked=false, bookings=[600-660]` → `true` |
| AC3 | `T13: rejects an otherwise available request when room is blocked` | `start=660, end=720, now=540, blocked=true, bookings=[600-660]` → `false` |
| AC4 | `BUG-A: allows a 30-minute request touching two bookings at both endpoints (AC4)` | `start=660, end=690, now=540, bookings=[600-660, 690-750]` → `true` |
| AC5 | `BUG-B: an available non-touching request leaves booking data unchanged (AC5)` | `start=720, end=780, now=540, bookings=[600-660]` → `true`, input array unchanged |
| F1 | `F1: keeps only rooms whose capacity is at least the requested attendees` | `filterRooms(CATALOG, { attendees: 25, equipment: [] })` → `["room-b", "room-c"]` |
| F2 | `F2: keeps only rooms that contain ALL selected required equipment items` | `filterRooms(CATALOG, { attendees: 1, equipment: ["projector", "whiteboard"] })` → `["room-b"]` |
| F3 | `F3 AC3: rejects a blocked room as unavailable even with no bookings` | `checkRoom(CATALOG, "room-c", { start: 600, end: 660, now: 540 })` → `false`, catalog unchanged |
| F4 | `F4: returns an empty list when no rooms satisfy the criteria` | `filterRooms(CATALOG, { attendees: 100, equipment: ["whiteboard"] })` → `[]` |
| F5 | `F5: changing the selected room evaluates the chosen room's own bookings for the same times` | `600-660` on `"room-a"` → `false`; same request on `"room-b"` → `true` |
| B1 | `B1 AC2: exactly 120 minutes (720-840) on an open room is available` | `checkRoom(CATALOG, "room-a", { start: 720, end: 840, now: 540 })` → `true` |
| B2 | `B2 AC2: 121 minutes (720-841) is rejected` | `checkRoom(CATALOG, "room-a", { start: 720, end: 841, now: 540 })` → `false` |
| B3 | `B3 AC4: touching an existing booking at endpoint (660-720) is available` | `checkRoom(CATALOG, "room-a", { start: 660, end: 720, now: 540 })` → `true` |
| B4 | `B4 AC4: overlapping an existing booking (630-690) is rejected` | `checkRoom(CATALOG, "room-a", { start: 630, end: 690, now: 540 })` → `false` |
| B5 | `B5: capacity exactly equal to requested attendees keeps the room included` | `filterRooms(CATALOG, { attendees: 12, equipment: [] })` → includes `"room-a"` (`cap=12`) |
| B6 | `B6: capacity one below requested attendees excludes the room` | `filterRooms(CATALOG, { attendees: 13, equipment: [] })` → excludes `"room-a"` (`cap=12`) |
| INT | `INT: filtering rooms and then checking the selected room uses that room's bookings without mutating data` | `filterRooms(20, ["projector"])` → `["room-b", "room-c"]`; `checkRoom` `720-780` → `false`/`false`, `780-840` on `"room-b"` → `true` |

### 6.2 Commands

```text
npm install
npx tsc --noEmit
npx vitest run
npm run build
```

### 6.3 Final run

```text
 RUN  v3.2.4 D:/MyFiles/Study/SE/practices/SE-practice/sis-04/app

 ✓ src/booking.test.ts (23 tests) 16ms
 ✓ src/catalog.test.ts (13 tests) 17ms

 Test Files  2 passed (2)
      Tests  36 passed (36)
   Start at  12:43:42
   Duration  1.88s (transform 253ms, setup 0ms, collect 363ms, tests 33ms, environment 1ms, prepare 664ms)
```

## 7. Quality evaluation (Task 5)

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 23/23 | 36/36 | 1.1 and 6.3 `npx vitest run` outputs (`booking.test.ts` 23 + `catalog.test.ts` 13) |
| Duplicated logic locations removed | 0 | 2 | Counted directly in 5.3 from git diff against baseline `10ec6a3` |
| Code structure: modules and their responsibilities | 12 files in `app/project/src` (split `package.json`, no `filter.ts` or `checkRoom()`) | 14 files in `app/src` (`rooms.ts`, `filter.ts`, `booking.ts`, `lib/`, `components/`, tests) | `git ls-files app/src` at baseline and listing `app/src` after refactoring against 5.1 |
| Remaining limitation | No equipment attribute, catalog filter, or `checkRoom()` | No `@testing-library/react` DOM tests for UI interactions; root `.gitignore` still ignores `booking.ts` | Inspected `app/src/*.test.ts` and root `.gitignore` |

## 8. AI evidence appendix

### 8.1 Exchange 1

**Tool and model:** Antigravity CLI · Gemini 4 Hydrogen (High)
**Date:** 2026-11-28
**Purpose:** Codebase analysis (Task 1) — locate maintainability risks in the baseline `week-08` app without writing code yet.

**Prompt:**

```text
I am extending our Smart Campus Room Availability Checker (starting from week-08 in sis-04/app/).
Here is the repository map of the starting code:
- sis-04/app/package.json: Vitest runner; sis-04/app/project/package.json: React + Vite + TS app
- project/src/App.tsx: page state and submit handler calling canBook() and checkAvailability()
- project/src/booking.ts: canBook() and getBookingIssue() for AC1-AC5
- project/src/booking.test.ts: 23 existing Vitest tests (AC1-AC5, BUG-A, BUG-B)
[...]
Please identify maintainability risks with exact file/function references and propose a small step-by-step improvement plan without a full rewrite or code yet.
```

**Output used:**

```text
Key risks located:
1. Duplicated AC1-AC5 rule evaluation across `project/src/booking.ts` (`canBook()` and `getBookingIssue()`) and `project/src/App.tsx` (`handleSubmit()` calling both `canBook()` and `checkAvailability()`).
2. Split manifests (`app/package.json` vs `app/project/package.json` with a missing comma after `"react-dom": "^18.3.1"` and a trailing comma) and `.gitignore` ignoring `booking.ts`.
3. Missing `equipment` field in `project/src/types.ts` and `project/src/data/rooms.ts`, plus `App.tsx` line 21 falling back to `SAMPLE_ROOMS[0]` when `selectedId` is missing.
4. Stale compiled `vite.config.js` / `*.tsbuildinfo` artifacts and template meta tags in `project/index.html`.
```

**Problems found:** None in the located facts, though each file reference had to be verified directly in the workspace before recording §3.1.
**Changes made:** Recorded the four verified risks in `report.md` §3.1 and committed the analysis before changing `app/src`.
**Verified by:** Direct inspection of `app/project/package.json`, `app/project/src/booking.ts`, `app/project/src/data/rooms.ts`, `app/project/src/App.tsx`, and `.gitignore`.

### 8.2 Exchange 2

**Tool and model:** Antigravity CLI · Gemini 4 Hydrogen (High)
**Date:** 2026-11-28
**Purpose:** Prioritised improvement plan and design decision review (Task 1 / §3.2–§3.3).

**Prompt:**

```text
Based on the verified risks and requirements AC1-AC6 and F1-F5, give a small 6-step improvement plan starting with the safest structural fix first, and call out any edge case around blocked rooms in the room selector.
```

**Output used:**

```text
Suggested 6-step plan:
1. Consolidate the Vite + Vitest project into `sis-04/app/`, fix `package.json`, and remove stale build artifacts.
2. Move the catalog into `src/rooms.ts` exporting `Room` and `ROOMS` with `equipment` on all 8 rooms.
3. Write tests first for F1, F2, B5, and B6, then implement `filterRooms()` in `src/filter.ts`.
4. Write tests first for F3, F5, B1-B4, and INT, then add `checkRoom()` in `src/booking.ts` delegating to `canBook()`.
5. Update `App.tsx`, `FilterBar.tsx`, and `RoomSelector.tsx` for capacity/equipment filters, F4 empty state, and F5 room switching.
6. Note: you could exclude `blocked === true` rooms inside `filterRooms()` so blocked rooms never appear in the selector.
```

**Problems found:** Step 6 suggested filtering out `blocked` rooms inside `filterRooms()`, which conflates `F1`/`F2` (capacity and equipment filtering) with `F3`/`AC3` (availability check on a blocked room).
**Changes made:** Modified the suggestion in §3.3 and `src/filter.ts` so `filterRooms()` filters only by `attendees` and `equipment`, while `RoomSelector.tsx` displays a `Blocked` tag and `checkRoom()` reports blocked rooms unavailable.
**Verified by:** `catalog.test.ts` (`F1`, `F2`, `F3 AC3`, `INT`) passing under `npx vitest run` and `evidence/switch-a.png` / `switch-b.png`.

### 8.3 Exchange 3

**Tool and model:** Antigravity CLI · Gemini 4 Hydrogen (High)
**Date:** 2026-11-28
**Purpose:** Verify tests, production build, UI evidence screenshots, and report accuracy (Tasks 2–5).

**Prompt:**

```text
Verify the refactored app in sis-04/app/ by running Vitest and Vite build, capture the five required UI screenshots in evidence/ from the running app, and complete report.md sections 4-9 strictly from real observed outputs without touching submission.yml or writing section 10 for me.
```

**Output used:**

```text
Ran `npx vitest run` (36 passed across `src/booking.test.ts` and `src/catalog.test.ts`) and `npm run build` (`tsc --noEmit && vite build`, 41 modules built).
Served the built app via `vite preview` and captured all five screenshots in `sis-04/evidence/` (`filter-match.png`, `filter-empty.png`, `switch-a.png`, `switch-b.png`, `narrow.png`) using headless Microsoft Edge, visually confirming F1-F5 and AC6 mobile portrait layout.
Updated `report.md` sections 4-9 from the verified code, baseline diff, and terminal runs, left section 10 and `submission.yml` for the student, and recorded `app/node_modules/` deletion as a pending action in `NOTES.md`.
```

**Problems found:** Running `npx vitest run` inside the sandbox hit `EPERM` when Vite wrote a temporary `.timestamp-*.mjs` config file, so test and build commands had to run outside the sandbox; `A7` also fails until `app/node_modules/` is deleted.
**Changes made:** Captured real UI screenshots, filled `report.md` §4–§9 with exact observed values, and documented user-only steps (including deleting `app/node_modules/`, writing §10, and updating `submission.yml`) in `NOTES.md`.
**Verified by:** `npx vitest run` (`36 passed (36)`), `npm run build`, visual inspection of all five `evidence/*.png` files, and `python tests/check_sis.py`.

## 9. Checker results and known fails

| Check | Why it still fails |
| --- | --- |
| `L10` | Intentionally left for the student to write 200–300 words in their own words without an AI assistant (`README.md` §11 and §15). |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
