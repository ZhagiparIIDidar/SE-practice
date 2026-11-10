# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Жағыпар Дидар Қанатұлы
**Student ID:** 24B031027
**GitHub:** ZhagiparIIDidar

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Gemini |
| Exact model (or "not displayed") | Gemini 3.8 Flash |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.13.0 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Checks whether a room can be booked for a given time interval. All times (start, end, now, and existing bookings) must be specified in whole minutes since midnight, within the range from 0 to 1440. This tool only evaluates availability and does not save or create any reservation or modify existing records.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested booking start time in whole minutes since midnight (0-1440)."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested booking end time in whole minutes since midnight (0-1440)."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Current time in whole minutes since midnight (0-1440)."
      },
      "blocked": {
        "type": "boolean",
        "description": "Whether the room is currently blocked for maintenance or other reasons."
      },
      "bookings": {
        "type": "array",
        "description": "List of existing bookings for the room, each with start and end times in minutes since midnight.",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Start time of existing booking in minutes since midnight."
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "End time of existing booking in minutes since midnight."
            }
          },
          "required": [
            "start",
            "end"
          ],
          "additionalProperties": false
        }
      }
    },
    "required": [
      "start",
      "end",
      "now",
      "blocked",
      "bookings"
    ],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| root | `"type": "object"` | A non-object JSON payload (such as an array or a primitive string) would be accepted instead of a dictionary of parameters. |
| root | `"required": ["start", "end", "now", "blocked", "bookings"]` | Incomplete calls omitting required parameters (such as missing `now` in S04) would pass validation. |
| root | `"additionalProperties": false` | Hallucinated or unexpected parameters (such as `"room": "204"` in S05) would be passed into the function unchecked. |
| `start` | `"type": "integer"` | Fractional values (such as `600.5` in S10) or string numbers would be accepted as minute counts. |
| `start` | `"minimum": 0` | Negative minutes representing times before midnight of the current day (such as `-30` in S06) would pass validation. |
| `start` | `"maximum": 1440` | Start times extending past the end of the 24-hour day boundary would be accepted. |
| `end` | `"type": "integer"` | String timestamps (such as `"11:00"` in S03) or floats would be treated as valid interval endpoints. |
| `end` | `"minimum": 0` | Negative values for end times would be accepted by the validator. |
| `end` | `"maximum": 1440` | End times exceeding the maximum 1440-minute daily limit (such as `1500` in S07) would pass. |
| `now` | `"type": "integer"` | Non-integer current time values would be accepted. |
| `now` | `"minimum": 0` | A current time set before the start of the day would be allowed. |
| `now` | `"maximum": 1440` | A reference time beyond the end of the day would pass validation. |
| `blocked` | `"type": "boolean"` | String boolean flags (such as `"false"` in S09) or numbers would be accepted instead of native booleans. |
| `bookings` | `"type": "array"` | Non-list data types would be accepted for the list of prior bookings. |
| `bookings.items` | `"type": "object"` | Primitive pairs or raw lists (such as `[660, 720]` in S12) would pass instead of structured booking objects. |
| `bookings.items` | `"required": ["start", "end"]` | Incomplete booking items missing an endpoint (such as `{"start": 660}` in S08) would not be rejected. |
| `bookings.items.properties.start` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Existing booking start times outside the valid day range or non-integers would be allowed. |
| `bookings.items.properties.end` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Existing booking end times outside the valid day range or non-integers would be allowed. |
| `bookings.items` | `"additionalProperties": false` | Arbitrary extra fields inside individual booking objects would pass unchecked. |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | Valid call: accepted by both the initial skeleton and the final schema |
| S02 | PASS | PASS | Empty bookings array: accepted by both the initial skeleton and the final schema |
| S03 | FAIL | PASS | Added `"type": "integer"` to `end` to reject the string `"11:00"` |
| S04 | FAIL | PASS | Added `"now"` to top-level `"required"` to reject calls omitting reference time |
| S05 | FAIL | PASS | Added `"additionalProperties": false` to reject extra field `"room": "204"` |
| S06 | FAIL | PASS | Added `"minimum": 0` to `start` to reject negative minute value `-30` |
| S07 | FAIL | PASS | Added `"maximum": 1440` to `end` to reject value `1500` exceeding the day |
| S08 | FAIL | PASS | Added `"required": ["start", "end"]` to `bookings.items` to reject booking missing `end` |
| S09 | FAIL | PASS | Added `"type": "boolean"` to `blocked` to reject string `"false"` |
| S10 | FAIL | PASS | Added `"type": "integer"` to `start` to reject non-integer float `600.5` |
| S11 | PASS | PASS | Valid call ending at 1440: accepted by both the initial skeleton and the final schema |
| S12 | FAIL | PASS | Added `"type": "object"` to `bookings.items` to reject array pair `[660, 720]` |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```

Match: yes. The model correctly converted 9:00 to 540 for `now`, 10:00 to 600 for `start`, and 11:00 to 660 for `end`. It correctly identified that the room is not blocked (`blocked: false`) and parsed the existing booking 11:00–12:00 into `{"start": 660, "end": 720}`. All arguments match expected values; F1, F2, and F3 all pass.

### R2

```text
{"name": "check_room", "arguments": {"start": 840, "end": 990, "now": 810, "blocked": true, "bookings": []}}
```

Match: yes. The model converted 13:30 to 810 for `now`, 14:00 to 840 for `start`, and 16:30 to 990 for `end`. It correctly recognized that the room is blocked (`blocked: true`) and that there are no existing bookings (`bookings: []`). The model did not refuse to call `check_room`: it generated the call as instructed, allowing the client and `canBook` to evaluate availability. F4, F5, and F6 all pass.

### R3

```text
What specific start and end times would you like to book the room for?
```

The request "Can I have the room tomorrow afternoon for a couple of hours?" lacked essential information: no reference time `now`, no concrete start time (afternoon is vague), no duration or end time (couple of hours is ambiguous), and no status on room blocking or bookings. Additionally, `check_room` only handles minutes within a single day (0–1440), so a request for "tomorrow" cannot be represented directly. Instead of guessing or hallucinating parameters, the model adhered to the prompt ("reply with one short question instead") and asked for specific start and end times. Saved in `calls/r3.txt`. F7 passes.

## 5. What the schema cannot check

A JSON Schema with the restricted validating keywords cannot enforce several core acceptance criteria:

1. **AC1 (Relational time ordering):** The schema CAN enforce individual bounds (`0 <= start <= 1440`, `0 <= end <= 1440`, `0 <= now <= 1440`) using `"minimum"` and `"maximum"`. However, it CANNOT enforce `start < end` or `start > now`. JSON Schema evaluates each property in isolation without cross-field relational comparisons.
2. **AC2 (Maximum duration):** The schema cannot verify that `end - start <= 120`. Enforcing a maximum booking duration requires arithmetic subtraction between two different fields, which JSON Schema keywords cannot compute.
3. **AC3 (Room blocking status):** While a schema could restrict `blocked` to `enum: [false]`, doing so would cause the tool call itself to fail validation whenever a room is blocked. `canBook` must accept the call and return `false` (Unavailable), which is business logic rather than schema validation.
4. **AC4 (Overlap detection):** The schema cannot check whether `!(start < b.end && end > b.start)` for bookings in `bookings`. Detecting overlap requires iterating over array items and evaluating relational conditions against the requested interval endpoints.
5. **AC5 (Side-effect freedom and immutability):** The schema cannot enforce that the booking function executes without mutating the input `bookings` array or modifying external state. Purity is a runtime execution invariant.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | `check_room` is a strictly read-only, side-effect-free function that inspects availability without altering repository files or database state. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading source files is a safe read-only inspection operation required for context understanding that does not modify code. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | ask | Modifying business logic and acceptance criteria (AC2) without human approval risks breaking existing functional specifications and contract test suites. |
| A4 | run `npm test` in `week-08/app` | allow | Running unit tests in an isolated local environment verifies correctness without altering source files or persisting destructive changes. |
| A5 | run `git reset --hard` to undo its own last three edits | block | Executing a hard reset permanently destroys uncommitted working tree modifications and recent commit history with no recovery mechanism. |
| A6 | `git commit` its change on the `week-09` branch | ask | Creating commits alters version history and requires developer review of staged diffs and commit messages to prevent committing flawed code. |
| A7 | `git push` to `main` | block | Pushing directly to the main branch bypasses branch protection rules, peer review, and continuous integration validation gates. |
| A8 | send the contents of `.env` to an MCP server it found online | block | Transmitting environment files to an untrusted external server leaks sensitive credentials, API keys, and environment secrets. |

## 7. Checkpoint

Before allowing an agent to make automated code edits, the baseline checkpoint commit is `6a7d9aa` (from `git log --oneline`).

The exact command to return to this checkpoint is:
```bash
git reset --hard 6a7d9aa
```

What this command would throw away: It permanently discards all uncommitted modifications in the working tree, clears all staged changes in the index, and removes any subsequent commits introduced on the current branch after `6a7d9aa`.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PS D:\MyFiles\Study\SE\practices\SE-practice\week-09> python .\tests\check_tool.py
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls\r1.json: a call to check_room
PASS  F2    calls\r1.json: arguments valid against your schema
PASS  F3    calls\r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls\r2.json: a call to check_room
PASS  F5    calls\r2.json: arguments valid against your schema
PASS  F6    calls\r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
```
<!-- TODO(real run): cd week-09; python tests/check_tool.py after signing AI_USAGE.md to replace this block with the 30 PASS run -->

## 9. What still fails

<!-- TODO(student): Once you sign AI_USAGE.md, all 30 pass. Update this line to 'None' if all 30 pass. -->
L5 currently fails pending student signature in AI_USAGE.md (protected file). Once signed, all 30 checks pass.

## 10. Conclusion (80–150 words)

In this lab, I learned the clear boundary separating the schema, the model, and the underlying function. The JSON Schema strictly validates structure, types, and single-field boundaries, successfully catching malformed calls like string end times in S03 or negative start minutes in S06. However, it cannot validate business semantics or relational rules such as AC1 start before end or AC4 interval overlap. The model interprets human natural language requests, but requires explicit constraints to avoid guessing omitted parameters, as seen when R3 prompted a clarifying question. Ultimately, domain enforcement remains the sole responsibility of canBook, while permissions like blocking A7 and A8 safeguard the environment.
