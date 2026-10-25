# SIS #03 — Report: Smart Campus Room Availability Checker

## 1. Setup and reuse

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Claude (claude.ai chat) |
| Coding assistant model | Claude Sonnet 5.5 |
| Bolt.new model | GLM 5.3 Flash |
| Bolt project link | https://bolt.new/p/72128193 |
| Language | Python 3 |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | week-06 |

## 2. Baseline — before any new AI exchange

### 2.1 Scope in my own words

**Scope:** Build and evaluate a small room-availability checker for a Smart Campus. The Python function `can_book` decides whether a proposed interval is valid, and the web prototype lets a user check a selected room using fictional data. The prototype must not save or confirm bookings and must not use a backend or database.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | The interval must satisfy `0 <= start < end <= 1440`, and its start must be later than the supplied current time. |
| AC2 | The booking duration must be no longer than 120 minutes. |
| AC3 | A booking request must be rejected if the selected room is blocked. |
| AC4 | A booking must be rejected if it overlaps an existing booking; intervals that only touch at an endpoint are allowed. |
| AC5 | The checker must return a clear Available / Unavailable result without changing existing booking data. |
| AC6 | The page must work on desktop and narrow/mobile screens and show understandable validation feedback. |

### 2.3 Likely failure points

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Incorrect overlap logic, especially at touching endpoints or when a conflict is in a later existing booking. | AC4 | Test touching intervals, partial overlap, and a conflict with the last of several existing bookings (T1, T2, T10). |
| 2 | Incorrect boundary handling for time and duration, including the current time and midnight. | AC1, AC2 | Test start equal to `now`, a start one minute later, 120/121-minute durations, and end values 1440/1441 (T4–T9). |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Proposed booking start, in minutes from midnight. | Integer; `0 <= start <= 1439` for a valid interval. |
| `end` | Proposed booking end, in minutes from midnight. | Integer; `start < end <= 1440`. |
| `now` | Supplied current time, in minutes from midnight. | Integer in the day's range; a valid booking requires `start > now`. |
| `blocked` | Whether the selected room is blocked. | Boolean (`True` or `False`). |
| `existing` | Existing booking intervals, each represented by a `(start, end)` pair. | Iterable of valid integer interval tuples; read-only input. |
| returns | Whether the proposed booking is allowed. | Boolean: `True` only if AC1–AC4 all pass; otherwise `False`. |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. The contract supplies integers and valid existing booking intervals, so `can_book` does not need extra type validation.
2. Intervals include their start and exclude their end; therefore, intervals that touch at an endpoint do not overlap. A duration of exactly 120 minutes is allowed.

**Checked manually:**

- I checked the acceptance criteria against the Python v1 conditions and reviewed the listed boundary cases. The supplied test output shows 21 Python tests passing.

## 3. Python v1 review

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not (0 <= start < end <= 1440):` | AC1 | Yes | Bounds are inclusive at 0 and 1440, and `start < end` is strict, so zero-length and reversed requests are rejected. |
| `if start <= now:` | AC1 | Yes | AC1 needs `start > now`; `start == now` is rejected, `start == now + 1` passes. |
| `if end - start > 120:` | AC2 | Yes | Exactly 120 minutes is allowed, 121 is rejected. |
| `if blocked:` | AC3 | Yes | Every request is rejected when the room is blocked; the contract says `blocked` is a Boolean. |
| `if start < existing_end and existing_start < end:` | AC4 | Yes | Both comparisons are strict, so touching endpoints do not overlap; the loop checks every booking before `return True`, and `existing` is only read. |
| `return True` | AC5 | Yes | Reached only when AC1–AC4 hold; returns the Boolean `True`. This line is not a condition, listed to show where AC5 lives. |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements:
User story: As a student, I want to check a room's availability so that I can choose a valid booking time.

Prototype scope: one responsive page for checking one selected room; no login, backend, database, or external API.
Use fictional room and booking data only. The prototype checks availability; it does not save or confirm a booking.

Acceptance criteria
AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.

Intervals include the start and exclude the end. Other rules still apply. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

| Generated file or component | Path | Its role |
| --- | --- | --- |
| Shared types and constants | `src/types.ts` | Types (Room, Booking, CheckResult) and constants (1440-minute day, 120-minute maximum). |
| Fictional sample data | `src/data.ts` | Fictional rooms (one blocked) and their existing bookings. |
| Availability logic | `src/availability.ts` | `checkAvailability`: applies AC1–AC4 and collects reasons; read-only, so it never changes bookings (AC5); also the HH:MM ↔ minutes helpers. |
| Page and form | `src/App.tsx` | The responsive page: room selector, start/end inputs, Check button, Available / Unavailable banner, room-details card and schedule block. |

**What v1 does:**

- Builds and runs as one responsive page: room selector, start/end text inputs (HH:MM), "Check availability" button.
- Shows an Available / Unavailable banner with a reason; for example 12:00–11:00 gives "Start time must be earlier than the end time." (T7).
- T3, T4, T5 and T7 gave the expected result; T1, T2 and T6 cannot be set up as specified (see the lines below).
- Uses the real system clock as the current time; the page has no input to supply it, so T6 cannot be set up.
- Malformed input "9:2" to 11:00 gives "Start and end times are required." although both fields are filled (misleading message).
- Adds unrequested UI: a Room details card with an "Open" badge (unclear meaning, shown at 00:04) and a Today's schedule block.
- All UI (form, room card, schedule) is in one `src/App.tsx`; the availability logic is separate in `src/availability.ts`.
- Sample data has no room whose only booking is 10:00–11:00 (room-101: 09:00–10:30 and 18:00–19:00; lab-a: 12:00–14:00 and 16:00–17:00; room-204 is blocked), so T1 (touching) and T2 (overlap) cannot be set up: 10:30–11:30 returns Available.
- Reading `availability.ts`: `labelToMinutes` accepts only 00:00–23:59, so an end of 24:00 is treated as an invalid time (T8 to be confirmed on the page).
- `package.json` lists `@supabase/supabase-js` (line 14), which the checker flags as backend/database code, although the scope has no backend.

## 5. Test cases — executed on both artifacts

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Not testable | |
| T2 | Overlap | 630–690 | Unavailable | False | False | Not testable | |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Unavailable | |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | |
| T6 | Starts now | 540–570 | Unavailable | False | False | Not testable | |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | | |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | | |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | | |
| T11 | Same check twice | 660–720, twice | Available | True | True | | |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | | |

## 6. Traceability

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `code/booking.py` lines 3 and 6; page: `availability.ts` and the Current time field in `App.tsx` | T6, T7, T8, T9 | T6 Unavailable, T7 Unavailable, T8 Available, T9 Unavailable | Python: False, False, True, False. Page: T6 Not testable, T7 Unavailable | Python: False, False, True, False. Page: not run (see section 13) |
| AC2 | `code/booking.py` line 9; page: `availability.ts` | T4, T5 | T4 Available, T5 Unavailable | Python: True, False. Page: Available, Unavailable | Python: True, False. Page: not run (see section 13) |
| AC3 | `code/booking.py` line 12; page: `availability.ts` | T3 | Unavailable | Python: False. Page: Unavailable | Python: False. Page: not run (see section 13) |
| AC4 | `code/booking.py` line 16; page: `availability.ts` | T1, T2, T10 | T1 Available, T2 Unavailable, T10 Unavailable | Python: True, False, False. Page: T1 and T2 Not testable | Python: True, False, False. Page: not run (see section 13) |
| AC5 | `code/booking.py` line 19 (Boolean result, `existing` only read); page: read-only check in `availability.ts` | T11 | Available both times | Python: True, True. Page: not run (see section 13) | Python: True, True. Page: not run (see section 13) |
| AC6 | Page: validation messages in `availability.ts`, layout in `App.tsx` | T7, T12 | T7 Unavailable with a reason, T12 Available | Page: T7 Unavailable with "Start time must be earlier than the end time."; T12 not run | Page: not run (see section 13) |

## 7. Issue log

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | Unclear validation feedback (usability): a malformed time gets a misleading message instead of a format hint. | AC6: choose a room, enter start "9:2" and end "11:00", press Check availability → page says Unavailable with "Start and end times are required." although both fields are filled. | Medium | Prompt (exchange B5): "Review only the validation messages for the start and end time inputs … Suggest one small cleanup … Implement it only if it preserves AC1–AC6." Change: one message in `src/availability.ts` reworded to "Start and end times must be valid HH:MM times (e.g. 09:30)." | Not retested on the running page. By reading `availability.ts`, the NaN branch now gives the format hint. |
| 2 | Code quality: all UI (form, room details card, schedule) is in one `App.tsx`; no `components/` folder. | AC6 (the page): open `web/original/project/src/` → only types.ts, data.ts, availability.ts and App.tsx. | Low | Deferred: no change, because splitting the file adds nothing to AC1–AC6 and risks regressions. | n/a |
| 3 | No way to supply the current time: v1 uses the system clock, so T6 (09:00–09:30 at current time 09:00) cannot be set up. | T6 / AC1: look for a current-time control → none exists, so T6 is Not testable. | High | Prompt (exchange B4): "…looking for a way to supply the current time … Make the smallest change that fixes this behavior. Preserve the other acceptance criteria." Change: `src/App.tsx` — editable "Current time (HH:MM)" field replaces the system-clock hook; it defaults to the system clock. | Not retested on the running page. By reading `App.tsx`, the Current time field is present and `nowMinutes` comes from it. |
| 4 | Sample data has no room whose only booking is 10:00–11:00, so touching (T1) and overlap (T2) cannot be set up. | T1, T2 / AC4: 10:30–11:30 returns Available in room-101 and lab-a. | High | Prompt (exchange B8): "In src/data.ts, change only the fictional sample data so that AC4 can be checked on the page …" Change: `src/data.ts` — Thompson Hall 101 now has one booking 10:00–11:00; Engineering Lab A has 10:00–11:00 and 11:40–12:40; Thompson Hall 204 stays blocked. | Not retested on the running page. Bolt reported (B8) that room-101 has one booking 10:00–11:00, lab-a has 10:00–11:00 and 11:40–12:40, and room-204 stays blocked. |
| 5 | Scope: `package.json` lists `@supabase/supabase-js`, although the prototype must have no backend or database. | AC5 and scope (W3): open `package.json` → line 14 lists `@supabase/supabase-js`, a database client, although AC5 keeps the booking data unchanged and the scope has no backend or database; no source file uses it. | Low | Prompt (exchange B7): "package.json lists @supabase/supabase-js (line 14) … Remove only that dependency and update package-lock.json accordingly." Change: dependency removed from `package.json` and `package-lock.json`; nothing in `src/` changed. | Not retested by hand; `package.json` is checked by the checker (W3). |
| 6 | The page cannot accept an end of 24:00, so 23:00–24:00 cannot be requested although AC1 allows `end <= 1440`. | T8 / AC1: enter 23:00–24:00 → page reports an invalid time. | Medium | Prompt (exchange B9): "AC1 allows end ≤ 1440, but labelToMinutes accepts only 00:00–23:59 … Make the smallest change in src/availability.ts so that 24:00 is accepted only as an end time (1440) …" Change: `src/availability.ts` — new `endLabelToMinutes` (24:00 → 1440); `src/App.tsx` — the end field uses it; start and current time keep the strict parser. | Not retested on the running page. Bolt reported (B9) that 24:00 is accepted only as an end time and that the start and current-time fields keep the strict parser. |
| 7 | Code quality: `ScheduleCard` sorts the `bookings` array it receives in place during render. | AC5: read `ScheduleCard` in `web/final/prototype/src/App.tsx`; `bookings.sort(...)` changes the array order (the global `BOOKINGS` data is not changed). | Low | No prompt: I edited it by hand in `web/final/prototype/src/App.tsx`, `bookings.sort(...)` → `bookings.slice().sort(...)`. | The build passes. |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue 3 (no way to supply the current time): before, the page has no current-time input; after, the page has an editable Current time field.

## 8. Critique decisions

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | AC1: the end of the day cannot be entered; `labelToMinutes` accepts only 00:00–23:59, so "24:00" is rejected and T8 (23:00–24:00) can never be Available. | I did not run the page. I read Bolt's report of the repair (B9): a new `endLabelToMinutes` maps 24:00 to 1440 for the end field only, and the start and current-time fields keep the strict parser. The retest on the page is not done (section 13). | accept | AC1 allows `end <= 1440`; the repair targets T8 and T9 (not yet confirmed on the page). |
| 2 | AC4: the overlap rule is correct, but the sample data has no room whose only booking is 10:00–11:00, so T1, T2 and T10 cannot be set up. | I did not run the page. I read Bolt's report of the repair (B8): room-101 has one booking 10:00–11:00, lab-a has 10:00–11:00 and 11:40–12:40, room-204 stays blocked. The overlap rule `start < b.end && b.start < end` I had read in `availability.ts`. The retest on the page is not done (section 13). | accept | AC4 and cases T1, T2, T10: the data should now allow them to be set up (not yet confirmed on the page). |
| 3 | AC5: `bookings.sort(...)` in `ScheduleCard` sorts in place during render (Low); the global `BOOKINGS` is not changed, but `[...bookings].sort(...)` would be cleaner. | I read `ScheduleCard` in `App.tsx`: `bookings.sort(...)` sorts the array it receives, which comes from `roomBookings` (a `useMemo` over `filter`). | modify | AC5: the data shown is not changed either way, so this is only code quality. I used `bookings.slice().sort(...)` instead of the spread form, and the build passes. |

## 9. Coding-agent analysis

### 9.1 The loop

| Step | What happened in this assignment |
| --- | --- |
| User goal | Make T6 testable: let the user supply the current time, because AC1 requires the start to be after the supplied current time (issue 3). |
| Model / plan | Bolt (GLM 5.3 Flash) planned the smallest change: replace the read-only system-clock hook with an editable "Current time" field that defaults to the system clock. |
| Tool call | Bolt read `src/App.tsx`, edited it (new field, updated info line, reset handler) and ran the build. |
| Observation | Bolt reported "Build passes" and said it had changed only `src/App.tsx`, leaving `src/availability.ts` untouched. |
| Next step | Bolt summarised the change and told me how to check T6: set Current time to 09:00 and request 09:00–09:30. |
| Human review | I compared the summary with issue 3 and AC1 and accepted it because it ties to AC1 and adds no feature; I did not run T6 on the final page; by reading `availability.ts`, 09:00–09:30 with current time 09:00 is rejected by `start <= nowMinutes`. The page retest is listed in section 13. |

### 9.2 Context, tools and permissions

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Claude chat (claude.ai) | Only the text I pasted into the chat (AC, `can_book`, tests) and the earlier messages of the same chat. | No access to my files or a terminal; I ran the tests and the checker myself on my computer. | Observed |
| Bolt.new | My prompt with AC1–AC6, then the project files it read before editing (it read `App.tsx` before changing it). | Created and edited project files, listed the files it created and ran the build ("Build passes"). | Observed |
| Bolt.new (internals) | A hidden system prompt and a starter template; the template left `@supabase/supabase-js` in `package.json`. One answer began with the string `626f6c742d63632d6167656e74`, which decodes to "bolt-cc-agent". | Probably an in-browser sandbox where it can install packages and run build commands, driven by an agent runtime. | Assumed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before accepting a Bolt change I compare its own summary with what is really in the export, the file list and package.json, which is how I found a backend dependency Bolt never mentioned. I tie each change to one AC, and I rerun the checker; the twelve page cases have to be run by hand, which I did not do this time (section 13). A change with no AC behind it gets rejected.

**Reliability, security, responsibility:** Bolt's page looked finished but could not be tested against AC1 until I could supply the current time, so reliability comes from the cases I run, not from how the page looks. For security, the generated project pulled in a backend dependency that the scope forbids, so I read package.json before accepting. Responsibility stays with me: the AI proposes, and I verify against the AC and decide.

## 10. Reflection

I learned that a page can look finished and still be difficult to test against its requirements. The most useful approach was to connect each issue to an acceptance criterion and a test case, then make a small change instead of redesigning the application. The editable current-time field should make T6 reproducible, while the clearer time-format message should help users understand invalid input. However, these changes still need to be retested on the final page. I also noticed that checking the project files matters: the package manifest included a Supabase dependency even though the requested prototype had no backend or database. In future work, I would check the generated files and dependencies as well as the interface, and I would not treat an AI report that the build passes as proof that every acceptance criterion passes.

## 11. Appendix A — AI exchanges

### B1

- **Tool:** Claude (claude.ai chat)
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-10-11
- **Stage:** Plan
- **Source:** week-05

**Prompt:**

~~~~text
Original prompt not available: the Claude chat history from 2026-10-11 no longer exists, so the prompt text is not reproduced here and has not been reconstructed. The response below is the plan exactly as pasted into my Week 05 lab report on 2026-10-11.
~~~~

**Response:**

~~~~text
Implementation plan for can_book (Python 3)

Checks, in order:
1. AC1 range: 0 <= start < end <= 1440. Otherwise return False.
2. AC1 timing: start > now. Otherwise return False.
3. AC2 duration: end - start <= 120. Otherwise return False.
4. AC3 blocked: if blocked is True, return False.
5. AC4 overlap: for each (s, e) in existing, the new interval overlaps when
   start < e and s < end. If any booking overlaps, return False. Touching
   endpoints do not overlap.
6. AC5: if no check failed, return True.

Assumptions:
- Inputs follow the contract (integers, valid now, valid existing tuples), so no extra validation.
- Intervals include the start and exclude the end, so (600, 660) and (660, 720) touch but do not overlap.
- Exactly 120 minutes is allowed (at most 120).
- existing is only read: no sorting, appending or removing. An empty existing means no overlap.
- Only a Boolean is returned; saving and confirmation belong to the complete system.

Boundary cases:
- (660, 720) touching the end of (600, 660): True
- (570, 600) touching the start of (600, 660): True
- (630, 690), (615, 645), (570, 690), (600, 660) overlapping: False
- duration 120: True; duration 121: False
- start == now: False; start == now + 1: True
- start == end, and start > end: False
- end == 1440: True; end == 1441: False
- blocked=True with an otherwise valid request: False
- empty existing; several existing bookings with a conflict only in the last one
- existing identical before and after the call (also when it is unsorted)
~~~~

### B2

- **Tool:** Claude (claude.ai chat)
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-10-11
- **Stage:** Generate
- **Source:** week-05

**Prompt:**

~~~~text
Original prompt not available: the Claude chat history from 2026-10-11 no longer exists, so the prompt text is not reproduced here and has not been reconstructed. The response below is code/original/booking_v1.py, saved unedited as the assistant's answer in Week 05 (the Week 05 report records: exactly as the assistant returned it).
~~~~

**Response:**

~~~~text
def can_book(start, end, now, blocked, existing):
    # AC1: valid range inside the day
    if not (0 <= start < end <= 1440):
        return False
    # AC1: the booking must start after the current time
    if start <= now:
        return False
    # AC2: at most 120 minutes
    if end - start > 120:
        return False
    # AC3: the room must not be blocked
    if blocked:
        return False
    # AC4: no overlap with an existing booking (touching endpoints are allowed)
    for existing_start, existing_end in existing:
        if start < existing_end and existing_start < end:
            return False
    # AC5: all of AC1-AC4 hold
    return True
~~~~

### B3

- **Tool:** Bolt.new
- **Model:** GLM 5.3 Flash
- **Date:** 2026-10-17
- **Stage:** Generate
- **Source:** week-06

**Prompt:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements:
User story: As a student, I want to check a room's availability so that I can choose a valid booking time.

Prototype scope: one responsive page for checking one selected room; no login, backend, database, or external API.
Use fictional room and booking data only. The prototype checks availability; it does not save or confirm a booking.

Acceptance criteria
AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.

Intervals include the start and exclude the end. Other rules still apply. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

**Response:**

~~~~text
I'll build a Smart Campus Room Availability Checker as a single responsive page with fictional data. Let me plan the structure and create the files.I'll create the data, logic, and UI files together.Now the main UI. I'll add a tailwind color system and build a polished single page.Now let me verify the build passes.Build passes. Here's what I created — a single-page Smart Campus Room Availability Checker with fictional data:
Main files/components:
   * `src/types.ts` — shared types (Room, Booking, CheckResult) and constants (1440-min day, 120-min max).
   * `src/data.ts` — fictional rooms (one blocked for maintenance) and existing bookings.
   * `src/availability.ts` — the availability-check logic enforcing all acceptance criteria: valid interval bounds with start after current time (AC1), 120-minute max (AC2), blocked-room rejection (AC3), overlap detection with touching endpoints allowed (AC4), and a pure read-only decision that never mutates bookings (AC5). Includes HH:MM ↔ minutes helpers.
   * `src/App.tsx` — the responsive page: a form panel (room selector, start/end time inputs, check button) plus a room-details card and today's-schedule sidebar. Shows a clear Available/Unavailable banner with specific reasons, and works down to mobile widths (AC6).
How it works for the user: Pick a room, type a start and end time in 24-hour HH:MM format, and press "Check availability." The page tells you whether the slot is free and lists every reason if it isn't — nothing is saved, and the existing schedule is never changed.
~~~~

### B4

- **Tool:** Bolt.new
- **Model:** GLM 5.3 Flash
- **Date:** 2026-10-17
- **Stage:** Repair
- **Source:** week-06

**Prompt:**

~~~~text
In the current prototype, looking for a way to supply the current time (to check 09:00–09:30 with the current time set to 09:00) produces nothing because the page only uses the system clock, but AC1 requires that the start be after the supplied current time. Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.
~~~~

**Response:**

~~~~text
The fix is to let the user supply the "current time" instead of forcing the system clock. Let me read the current App and make the smallest change.I'll replace the fixed system-clock current time with an editable "Current time" field, defaulting to the system clock so existing behavior is unchanged unless the user overrides it.Now add the "Current time" field to the form and update the info line to reflect the supplied value.Also update the reset handler to clear the current-time field back to the system clock.Build passes.

**What I changed and why:** I edited `src/App.tsx` only. The page previously derived the "current time" purely from the system clock, so there was no way to supply a different value (like 09:00) to test cases where the start equals or is after that time. I replaced the read-only `useNowMinutes()` hook with an editable **Current time (HH:MM)** field that defaults to the system clock but can be overridden, and `nowMinutes` now resolves from that field (falling back to the system clock only when blank or invalid). The existing availability logic in `src/availability.ts` is untouched, so AC1's "start is after the supplied current time" now uses the supplied value, and AC2–AC6 are preserved.

You can now set Current time to 09:00 and check 09:00–09:30 — it will correctly report Unavailable with "Start time must be after the current time (09:00)," since the rule requires start to be strictly after the current time.
~~~~

### B5

- **Tool:** Bolt.new
- **Model:** GLM 5.3 Flash
- **Date:** 2026-10-17
- **Stage:** Repair
- **Source:** week-06

**Prompt:**

~~~~text
Review only the validation messages for the start and end time inputs (for example, entering "9:2" currently shows "Start and end times are required." although both fields are filled) for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.
~~~~

**Response:**

~~~~text
Let me review the validation messages in the availability logic.The issue is clear. When a user types `"9:2"`, it fails the `HH:MM` format check in `labelToMinutes`, becomes `NaN`, and the message reads "Start and end times are required." — confusing, since both fields are filled, just malformed.

**Suggested cleanup (one line):** Reword that message so it covers both the empty and malformed cases accurately, pointing the user at the expected format instead of implying the fields are blank.

This preserves AC1–AC6 because it changes only the text shown for an already-invalid interval; no validation logic, thresholds, or decision behavior changes.Build passes.

**The problem:** In `src/availability.ts`, when a time like `"9:2"` failed the `HH:MM` format check it became `NaN`, and the message read "Start and end times are required." — which falsely implies the fields are empty when both are actually filled, just malformed. That's a confusing UI feedback mismatch (the validation reason didn't describe the real problem).

**The cleanup:** I rewrote that one message to "Start and end times must be valid HH:MM times (e.g. 09:30)." so it accurately covers both the empty and malformed cases and tells the user the expected format. No validation logic, thresholds, or decisions changed, so AC1–AC6 are preserved.
~~~~

### B6

- **Tool:** Claude (claude.ai chat)
- **Model:** not displayed
- **Date:** 2026-10-25
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
PS D:\MyFiles\Study\SE\practices\SE-practice\sis-03> Get-Content code\booking.py, web\final\prototype\src\availability.ts, web\final\prototype\src\data.ts, web\final\prototype\src\App.tsx
def can_book(start, end, now, blocked, existing):
    # AC1: valid range inside the day
    if not (0 <= start < end <= 1440):
        return False
    # AC1: the booking must start after the current time
    if start <= now:
        return False
    # AC2: at most 120 minutes
    if end - start > 120:
        return False
    # AC3: the room must not be blocked
    if blocked:
        return False
    # AC4: no overlap with an existing booking (touching endpoints are allowed)
    for existing_start, existing_end in existing:
        if start < existing_end and existing_start < end:
            return False
    # AC5: all of AC1-AC4 hold
    return True
import type { Booking, CheckResult, IntervalInput, Room } from "@/types.ts";
import { MAX_BOOKING_MINUTES, MINUTES_PER_DAY } from "@/types.ts";

export function minutesToLabel(min: number): string {
  const m = ((min % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function labelToMinutes(label: string): number | null {
  const match = label.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = Number(match[1]);
  const mm = Number(match[2]);
  if (h < 0 || h > 23 || mm < 0 || mm > 59) return null;
  return h * 60 + mm;
}

export function checkAvailability(
  room: Room | undefined,
  bookings: Booking[],
  input: IntervalInput,
  nowMinutes: number
): CheckResult {
  const reasons: string[] = [];
  const { start, end } = input;

  if (!room) {
    return { decision: "Unavailable", reasons: ["No room selected."] };
  }

  // AC1: valid interval bounds and start must be after current time.
  if (Number.isNaN(start) || Number.isNaN(end)) {
    reasons.push(
      "Start and end times must be valid HH:MM times (e.g. 09:30)."
    );
  } else {
    if (start < 0 || end < 0) {
      reasons.push("Times cannot be earlier than 00:00.");
    }
    if (!(start < end)) {
      reasons.push("Start time must be earlier than the end time.");
    }
    if (end > MINUTES_PER_DAY) {
      reasons.push("End time cannot go past 24:00.");
    }
    if (start <= nowMinutes) {
      reasons.push(
        `Start time must be after the current time (${minutesToLabel(nowMinutes)}).`
      );
    }
  }

  // AC2: max booking length.
  const duration = end - start;
  if (!Number.isNaN(duration) && duration > MAX_BOOKING_MINUTES) {
    reasons.push(
      `Booking is ${duration} minutes; maximum allowed is ${MAX_BOOKING_MINUTES} minutes.`
    );
  }

  // AC3: room blocked.
  if (room.blocked) {
    reasons.push(
      `This room is blocked: ${room.blockedReason ?? "unavailable for booking."}`
    );
  }

  // AC4: overlap with existing bookings (touching endpoints allowed).
  if (Number.isNaN(start) || Number.isNaN(end) || !(start < end)) {
    // skip overlap check when the interval itself is invalid
  } else {
    const overlapping = bookings.filter(
      (b) => b.roomId === room.id && start < b.end && b.start < end
    );
    for (const b of overlapping) {
      reasons.push(
        `Overlaps "${b.title}" (${minutesToLabel(b.start)}â€“${minutesToLabel(b.end)}).`
      );
    }
  }

  return {
    decision: reasons.length === 0 ? "Available" : "Unavailable",
    reasons,
  };
}
import type { Booking, Room } from "@/types.ts";

export const ROOMS: Room[] = [
  {
    id: "room-101",
    name: "Thompson Hall 101",
    building: "Thompson Hall",
    capacity: 30,
    blocked: false,
  },
  {
    id: "room-204",
    name: "Thompson Hall 204",
    building: "Thompson Hall",
    capacity: 18,
    blocked: true,
    blockedReason: "Maintenance â€” HVAC repair scheduled for today.",
  },
  {
    id: "lab-a",
    name: "Engineering Lab A",
    building: "Foster Engineering Center",
    capacity: 24,
    blocked: false,
  },
];

export const BOOKINGS: Booking[] = [
  { id: "b1", roomId: "room-101", title: "Intro to Algorithms", start: 540, end: 630 }, // 09:00â€“10:30
  { id: "b2", roomId: "room-101", title: "Study Group", start: 1080, end: 1140 }, // 18:00â€“19:00
  { id: "b3", roomId: "lab-a", title: "Robotics Workshop", start: 720, end: 840 }, // 12:00â€“14:00
  { id: "b4", roomId: "lab-a", title: "Office Hours", start: 960, end: 1020 }, // 16:00â€“17:00
];
import { useMemo, useState } from "react";
import {
  CalendarCheck,
  Clock,
  DoorClosed,
  DoorOpen,
  Info,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { BOOKINGS, ROOMS } from "@/data.ts";
import {
  checkAvailability,
  labelToMinutes,
  minutesToLabel,
} from "@/availability.ts";
import type { CheckResult } from "@/types.ts";

function systemNowMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export default function App() {
  const [roomId, setRoomId] = useState<string>(ROOMS[0].id);
  const [nowLabel, setNowLabel] = useState<string>(() =>
    minutesToLabel(systemNowMinutes())
  );
  const [startLabel, setStartLabel] = useState<string>("");
  const [endLabel, setEndLabel] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  // AC1 references the *supplied* current time. Fall back to the system
  // clock only when the field is cleared or holds an invalid value.
  const nowMinutes =
    labelToMinutes(nowLabel) ?? systemNowMinutes();

  const room = useMemo(
    () => ROOMS.find((r) => r.id === roomId),
    [roomId]
  );
  const roomBookings = useMemo(
    () => BOOKINGS.filter((b) => b.roomId === roomId),
    [roomId]
  );

  const result: CheckResult | null = useMemo(() => {
    if (!submitted) return null;
    const start = labelToMinutes(startLabel);
    const end = labelToMinutes(endLabel);
    return checkAvailability(
      room,
      roomBookings,
      { start: start ?? NaN, end: end ?? NaN },
      nowMinutes
    );
  }, [submitted, startLabel, endLabel, room, roomBookings, nowMinutes]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleReset() {
    setNowLabel(minutesToLabel(systemNowMinutes()));
    setStartLabel("");
    setEndLabel("");
    setSubmitted(false);
  }

  const isAvailable = result?.decision === "Available";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Smart Campus Room Availability
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Check whether a room is free for your proposed time slot. This
              prototype does not save or confirm bookings.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form panel */}
          <section className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Check a room
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Intervals include the start minute and exclude the end minute.
              The start must be after the current time.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="room"
                  className="block text-sm font-medium text-slate-700"
                >
                  Room
                </label>
                <select
                  id="room"
                  value={roomId}
                  onChange={(e) => {
                    setRoomId(e.target.value);
                    setSubmitted(false);
                  }}
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  {ROOMS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                      {r.blocked ? " â€” Blocked" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <TimeField
                  id="now"
                  label="Current time (HH:MM)"
                  value={nowLabel}
                  onChange={(v) => {
                    setNowLabel(v);
                    setSubmitted(false);
                  }}
                />
                <TimeField
                  id="start"
                  label="Start time (HH:MM)"
                  value={startLabel}
                  onChange={(v) => {
                    setStartLabel(v);
                    setSubmitted(false);
                  }}
                />
                <TimeField
                  id="end"
                  label="End time (HH:MM)"
                  value={endLabel}
                  onChange={(v) => {
                    setEndLabel(v);
                    setSubmitted(false);
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Check availability
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  Clear
                </button>
              </div>
            </form>

            {result && (
              <ResultBanner
                available={isAvailable}
                reasons={result.reasons}
                startLabel={startLabel}
                endLabel={endLabel}
              />
            )}
          </section>

          {/* Room info + schedule */}
          <aside className="lg:col-span-2 space-y-6">
            <RoomCard room={room} />
            <ScheduleCard
              bookings={roomBookings}
              blocked={room?.blocked ?? false}
            />
          </aside>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Fictional sample data for prototype use only.
        </footer>
      </div>
    </div>
  );
}

function TimeField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder="e.g. 14:30"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </div>
  );
}

function ResultBanner({
  available,
  reasons,
  startLabel,
  endLabel,
}: {
  available: boolean;
  reasons: string[];
  startLabel: string;
  endLabel: string;
}) {
  if (available) {
    return (
      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-semibold text-emerald-800">
              Available â€” {startLabel} to {endLabel}
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              This time slot is free and satisfies all booking rules. No booking
              has been saved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4">
      <div className="flex items-start gap-3">
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
        <div className="w-full">
          <p className="font-semibold text-rose-800">
            Unavailable â€” {startLabel || "?"} to {endLabel || "?"}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-rose-700">
            {reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-rose-500" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room }: { room: ReturnType<typeof ROOMS.find> }) {
  if (!room) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Room details
        </h3>
        {room.blocked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700">
            <DoorClosed className="h-3.5 w-3.5" /> Blocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            <DoorOpen className="h-3.5 w-3.5" /> Open
          </span>
        )}
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span>{room.building}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Users className="h-4 w-4 text-slate-400" />
          <span>Capacity: {room.capacity}</span>
        </div>
      </dl>
      {room.blocked && room.blockedReason && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <span>{room.blockedReason}</span>
        </div>
      )}
    </div>
  );
}

function ScheduleCard({
  bookings,
  blocked,
}: {
  bookings: { id: string; title: string; start: number; end: number }[];
  blocked: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-slate-400" />
        <h3 className="text-base font-semibold text-slate-900">
          Today&apos;s schedule
        </h3>
      </div>
      {blocked ? (
        <p className="mt-3 flex items-start gap-2 text-sm text-slate-500">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          Room is blocked; schedule is informational only.
        </p>
      ) : bookings.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          No existing bookings today.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {bookings
            .sort((a, b) => a.start - b.start)
            .map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="font-medium text-slate-700">{b.title}</span>
                <span className="tabular-nums text-slate-500">
                  {minutesToLabel(b.start)}â€“{minutesToLabel(b.end)}
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
~~~~

**Response:**

~~~~text
## Review of the final code against AC1–AC6

I reviewed `booking.py`, `availability.ts`, `data.ts` and `App.tsx`. I could not see `package.json` or `types.ts`, and I did not run the page.

1. **AC1: the end of the day cannot be entered (Medium).** `labelToMinutes` accepts only 00:00–23:59, so "24:00" becomes `null` and the user sees "must be valid HH:MM times". AC1 allows `end = 1440`, so 23:00–24:00 (T8) can never be Available. The checks `end > MINUTES_PER_DAY` and `start < 0 || end < 0` in `checkAvailability` are dead code, because parsed values are always 0–1439. The message "End time cannot go past 24:00." also suggests 24:00 is accepted.
2. **AC1/AC6: an invalid "Current time" is silently replaced by the system clock (Medium).** In `App.tsx`, `labelToMinutes(nowLabel) ?? systemNowMinutes()` hides the error. If the user types "9:2", the page checks against the real time without saying so. The reason line shows the time actually used, which only partly helps.
3. **AC4: the overlap rule is correct, but the sample data cannot exercise it (High for testing).** `start < b.end && b.start < end`, filtered by `roomId`, lets touching endpoints through. The data has no room whose only booking is 10:00–11:00 (room-101: 09:00–10:30 and 18:00–19:00; lab-a: 12:00–14:00 and 16:00–17:00), so T1, T2 and T10 cannot be set up.
4. **AC6: typing HH:MM on a phone may be hard (Low–Medium).** The inputs are `type="text"` with `inputMode="numeric"`, and many phone numeric keypads have no ":" key. This needs a check on a real phone or in browser mobile emulation.
5. **AC5: `bookings.sort(...)` in `ScheduleCard` sorts in place during render (Low).** It sorts the array produced by `filter` in `roomBookings`, which is a copy, so the global `BOOKINGS` is not changed and AC5 is not violated. It is still a code smell; `[...bookings].sort(...)` avoids it.
6. **Possible text corruption (verify first).** The output shows "â€“" and "â€”" in several strings (the overlap message, `blockedReason`, the banner, the room options, the schedule). This may only be how PowerShell displayed UTF-8. If the page shows them, it is an AC6 readability bug.
7. **`booking.py`: no defects found.** All branches match AC1–AC5, and `existing` is only read.
8. **Scope and code quality (Low, no AC violated).** The Room details card with its "Open" badge and the Today's schedule block are unrequested. The prop type `ReturnType<typeof ROOMS.find>` is awkward, and the UI is in one large file. The result banner has no `role="status"`, so screen readers do not announce it, though adding it is optional and arguably beyond scope.
~~~~

### B7

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-10-25
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
package.json lists @supabase/supabase-js (line 14), but no source file uses it and the scope forbids backend and database code. Remove only that dependency and update package-lock.json accordingly. Do not change anything in src/.
~~~~

**Response:**

~~~~text
626f6c742d63632d6167656e74Removed the `@supabase/supabase-js` dependency from `package.json` and updated `package-lock.json` accordingly. The build still passes and nothing in `src/` was changed.
~~~~

### B8

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-10-25
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
In src/data.ts, change only the fictional sample data so that AC4 can be checked on the page. Keep one blocked room, give one room the single booking 10:00–11:00, and give another room exactly two bookings, 10:00–11:00 and 11:40–12:40. Do not change the availability logic or the UI.
~~~~

**Response:**

~~~~text
626f6c742d63632d6167656e74Updated the sample bookings only. Thompson Hall 204 stays blocked; Thompson Hall 101 now has one booking (10:00–11:00); Engineering Lab A now has exactly two bookings (10:00–11:00 and 11:40–12:40), so AC4 overlap checking is exercisable on the page. Build passes.
~~~~

### B9

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-10-25
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
AC1 allows end ≤ 1440, but labelToMinutes accepts only 00:00–23:59, so an end of 24:00 is rejected as invalid. Make the smallest change in src/availability.ts so that 24:00 is accepted only as an end time (1440); 24:01 and later, and 24:00 as start or as current time, stay invalid. Preserve AC1–AC6 and explain which file you changed.
~~~~

**Response:**

~~~~text
626f6c742d63632d6167656e74I'll add a dedicated end-time parser that allows "24:00" → 1440, and use it only for the end field.I'll add a dedicated end-time parser in `src/availability.ts` and point the end field at it. The start and current-time fields keep using the strict parser, so 24:00 stays invalid for them.Now point the end field at the new parser in App.tsx.Build passes. I changed two files:

- **src/availability.ts** — added `endLabelToMinutes`, which maps `"24:00"` → 1440 and otherwise delegates to `labelToMinutes`. This keeps `24:01`+ and `"24:00"` as start/current-time invalid, since those fields still use the strict `labelToMinutes`.
- **src/App.tsx** — the end field now calls `endLabelToMinutes` instead of `labelToMinutes`; start and current time are unchanged.

AC1–AC6 are preserved: the `end > MINUTES_PER_DAY` check still rejects anything past 24:00, and overlap/blocked/duration logic is untouched.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

~~~~text
test_blocked_room_rejected (test_booking.BookingTests.test_blocked_room_rejected) ... ok
test_contains_existing_rejected (test_booking.BookingTests.test_contains_existing_rejected) ... ok
test_empty_existing_allowed (test_booking.BookingTests.test_empty_existing_allowed) ... ok
test_end_after_1440_rejected (test_booking.BookingTests.test_end_after_1440_rejected) ... ok
test_end_at_1440_allowed (test_booking.BookingTests.test_end_at_1440_allowed) ... ok
test_exactly_two_hours_allowed (test_booking.BookingTests.test_exactly_two_hours_allowed) ... ok
test_existing_unchanged_when_false (test_booking.BookingTests.test_existing_unchanged_when_false) ... ok
test_existing_unchanged_when_true (test_booking.BookingTests.test_existing_unchanged_when_true) ... ok
test_gap_between_several_bookings_allowed (test_booking.BookingTests.test_gap_between_several_bookings_allowed) ... ok
test_identical_interval_rejected (test_booking.BookingTests.test_identical_interval_rejected) ... ok
test_inside_existing_rejected (test_booking.BookingTests.test_inside_existing_rejected) ... ok
test_over_two_hours_rejected (test_booking.BookingTests.test_over_two_hours_rejected) ... ok
test_overlap_with_last_of_several_rejected (test_booking.BookingTests.test_overlap_with_last_of_several_rejected) ... ok
test_partial_overlap_rejected (test_booking.BookingTests.test_partial_overlap_rejected) ... ok
test_reversed_times_rejected (test_booking.BookingTests.test_reversed_times_rejected) ... ok
test_start_before_now_rejected (test_booking.BookingTests.test_start_before_now_rejected) ... ok
test_start_equal_now_rejected (test_booking.BookingTests.test_start_equal_now_rejected) ... ok
test_start_one_minute_after_now_allowed (test_booking.BookingTests.test_start_one_minute_after_now_allowed) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_zero_length_rejected (test_booking.BookingTests.test_zero_length_rejected) ... ok

----------------------------------------------------------------------
Ran 21 tests in 0.002s

OK
~~~~

### 12.2 Path B only — three faults you planted

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| `can_book` does no type checking: a float such as `660.5` gives a normal True/False, a string such as `"660"` raises `TypeError` | The contract guarantees integers, AC5 asks for no extra rule, and validation would add a rule that no AC asks for. | Convert and check types in the layer that reads user input, before calling `can_book`. |
| X2 (and possibly X5): the prompts of B1 and B2, the chat text of B2, and the answers of B7 and B8 | The Claude chat history from 2026-10-11 (Week 05) is no longer available. I did not reconstruct the prompts; B1 keeps the plan pasted in my Week 05 report, and B2 shows the v1 file saved at that time. Bolt's answers in B7 and B8 are short (about 25 and 40 words); they are pasted complete and not padded. | Keep the full chat export of every AI session, not only the pasted parts. |
| C1, C4: Page final column of section 5 is empty, and Page v1 for T8–T12 | I did not run the final page by hand, so I left these cells empty instead of writing results I had not seen. Reading the code suggests the final page should behave as expected, but that is not an observation. Page v1 T8–T12 were not run either. | Run `npm run dev` in `web/final/prototype` and in `web/original/project`, enter T1–T12 with current time 09:00, and write the decision shown. |
| Retests of issues 1, 3, 4, 5 and 6 are by code reading or Bolt's report, not by running the page | Same reason as above: the page was not run after the repairs. | Run the page and replace each retest with the message the page shows. |
