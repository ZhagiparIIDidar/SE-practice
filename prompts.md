# Week 01 — Part 2: Rocket Prompt Log

**Tool:** Rocket (rocket.new), free tier, web version
**App link (staging preview):** https://marksprocessor-h4v156.public.builtwithrocket.new/

---

## 1. Initial prompt (exact, as required by the assignment)

```
Build a small program that processes a list of student marks and prints:
average, highest, lowest, and pass rate.
```

Submitted: Sep 10, 2026, 10:20 AM.

## 2. Rocket's first reaction

> Agent detected prompt score: **74%**
> "This is good enough score to proceed. However, a few answers to my questions will help
> enhance prompt completeness and generate more accurate results."

**Clarifying question asked:**

- How will marks be entered into the app?

(I answered by providing the full test-data table from the assignment spec — the four cases A–D
with their expected average / highest / lowest / pass rate.)

## 3. Rocket's rewritten / enhanced prompt (final score 82%)

> **Rocket Enhanced**
>
> A clean web tool where a teacher or user pastes a comma-separated list of student marks and
> instantly sees the computed average, highest mark, lowest mark, and pass rate. The app
> validates each entry — filtering out non-numeric values, negatives, and marks above 100 — so
> only valid scores are counted. It handles all four test cases: normal input, mixed
> valid/invalid entries, low scores, and fully invalid input (showing a friendly message instead
> of crashing).
>
> Building with Next.js and TypeScript.

**What Rocket added on its own that was never in my original prompt:**
- The tech stack choice (Next.js 15, React 19, TypeScript, Tailwind CSS) — I never specified a
  language or framework.
- A full web UI with a text area, "Calculate Results" button, and four stat cards, instead of a
  console program that just "prints" the numbers.
- A "Validation Summary" panel breaking down *why* entries were rejected (Empty / Non-numeric /
  Negative / Above 100 counts).
- Four pre-loaded "Quick Test Case" buttons (A, B, C, D) that closely mirror the assignment's own
  spec table.
- CSV upload / results download buttons.
- `.env` placeholders for AdSense, a Perplexity API key, and a Stripe publishable key — none of
  which relate to this task at all.

## 4. Build result

> **Built MarksProcessor Web App** — Sep 10, 2026, 10:26 AM
>
> What I did:
> - Built a Student Marks Processor with textarea input, Calculate button, and 4 KPI stat cards
>   (Average, Highest, Lowest, Pass Rate)
> - Implemented full validation logic: filters negatives, values > 100, non-numeric strings, and
>   empty entries; pass threshold ≥ 50; average to 2dp, pass rate to 1dp
> - Added 4 preloaded test cases (A–D) matching all specified expected outputs, plus a graceful
>   "no valid marks" message for case D

## 5. Testing against the four spec cases

| Case | Input | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | *[fill in — click "Test A" on the live link]* | avg 67.00 · high 92 · low 23 · pass 60.0% | |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | 5 of 9 valid (Empty:1, Non-numeric:1, Negative:1, Above100:1) · avg 71.60 · high 100 · low 47 · pass 80.0% (4 passed, 1 failed) | avg 71.60 · high 100 · low 47 · pass 80.0% | ✅ |
| C | `10, 20, 30` | *[fill in — click "Test C" on the live link]* | avg 20.00 · high 30 · low 10 · pass 0.0% | |
| D | `abc, , xyz` | *[fill in — click "Test D" on the live link]* | clear message, no crash | |

## 6. Fixing a defect (follow-up prompt)

**Defect chosen:** *[fill in once cases A/C/D are checked — if all match, note the worst thing
from section 3 above instead, e.g. "remove the Stripe/AdSense/Perplexity env placeholders it
added without being asked"]*

**Prompt used:** *[fill in]*

**Result:** *[fixed / partly fixed / broke something else]*

## 7. Code download

Rocket's Code View shows the full generated file tree (Next.js `src/app/marks-processor`,
components, `.env`, config files, etc.), but the **Download** button is paywalled: the "Own your
code" dialog ("Download · Deploy anywhere · Modify however you want") requires upgrading to a
paid plan. On the free tier, code can be browsed in-editor but not exported as a `.zip`.

Per the assignment's fallback instructions, no source code was downloaded. Instead this folder
contains:
- This prompt log (`prompts.md`)
- Screenshots (`screenshots/`) of: the initial prompt + clarifying question, the rewritten
  prompt, the built app running with test data, the code view file tree, and the download paywall
- The live staging link above, which stays queryable for grading
