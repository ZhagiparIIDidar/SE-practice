# Week 01 — Manual vs AI: Comparison

**Name:**
**Group:**
**Date:**

---

## 1. Facts

|  | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | Python (standard library only) | Next.js 15 + React 19 + TypeScript + Tailwind CSS |
| Time to first version that ran | *2-3 h, 1h i was thinking* | ~6 min (from first prompt to "Built MarksProcessor Web App") |
| Time to all 4 test cases passing | *5sec, if you copy past in terminal test cases* | 0 extra time — all 4 cases were pre-loaded as "Quick Test Cases" buttons and matched spec on first build |
| Number of attempts / prompts needed | 2 i wanted write it in 1 file with list and dict . then i changed my mind ,wanted to use classes | 1 initial prompt (scored 74%) + answered 1 clarifying question → 1 rewritten "Enhanced" prompt (scored 82%) → build |
| Lines of code you actually wrote | 158 (main.py 34 + utils.py 49 + schemas.py 75) | 0 lines written directly — 14 files generated automatically |
| Did it handle invalid marks (case B)? | Yes — verified, by verify func in utils | Yes — verified (screenshot: 5 valid of 9, breakdown Empty:1 / Non-numeric:1 / Negative:1 / Above100:1) |
| Did it handle an empty list (case D)? | Yes — verified, no crash, by verify func in utils | *[fill in: click "Test D" button on the live app and confirm]* |
| Did it use the ≥ 50 pass threshold? | Yes, in find passed func | Yes — shown explicitly in the UI header ("Pass threshold: ≥ 50") |
| Output format matches the spec? | Yes — all 4 cases match exactly | Yes for case B (exact match); *[fill in: confirm A and C]* |
| Can you explain every line of it? | *yes, of course, it was written by python lang and basic syntax* | *no, i dont even know js program language and i have no idea what kind of framework it is* |

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | valid 5 · avg 67.00 · high 92 · low 23 · pass 60.0% | *you can see it in the screenshots* | avg 67.00 · high 92 · low 23 · pass 60.0% | Manual: ✅ |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | valid 5 · avg 71.60 · high 100 · low 47 · pass 80.0% | you can see it in the screenshots | avg 71.60 · high 100 · low 47 · pass 80.0% | Both: ✅ |
| C | `10, 20, 30` | valid 3 · avg 20.00 · high 30 · low 10 · pass 0.0% | you can see it in the screenshots | avg 20.00 · high 30 · low 10 · pass 0.0% | Manual: ✅ |
| D | `abc, , xyz` | "Valid: 0 / you dont have grades" — no crash | *[*you can see it in the screenshots | clear message, no crash | Manual: ✅ |

**Rocket app link (staging preview)😗* [https://marksprocessor-h4v156.public.builtwithrocket.new/](https://marksprocessor-h4v156.public.builtwithrocket.new/)

> 

## 3. What the AI added that I never asked for

- A full Next.js 15 + React 19 + TypeScript + Tailwind CSS web application (component tree with
`TopBar`, `MarksProcessorClient`, `InputSection`, `ValidationSummary`, `StatCards`,
`RejectedEntries`, `NoValidMarksState`, `TestCaseBar` — 14 files total) instead of a simple
script, even though the original prompt only asked for a program that "prints" four numbers.
- A visible pass-threshold/range badge in the UI ("Pass threshold: 50 · Range: 0–100") and a
"Validation Summary" panel that breaks down *why* each entry was rejected (Empty / Non-numeric /
Negative / Above 100) — none of this was requested in the prompt.
- Four pre-loaded "Quick Test Case" buttons (A–D) that happen to match this exact assignment's
spec table almost verbatim.
- A "Download Results" and "Upload CSV Marks" feature — input methods never mentioned in the
prompt.
- `.env` placeholders for `NEXT_PUBLIC_ADSENSE_ID`, `PERPLEXITY_API_KEY`, and
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — ad, third-party AI, and payment integration scaffolding
for a task that never mentioned monetization or payments.
## 4. What the AI got wrong or silently skipped

- *[fill in after testing cases A, C, D on the live link — case B was correct]*
- Code download is blocked behind a paywall ("Own your code" — Download / Deploy anywhere /
Modify however you want, 90% off first month). The free tier only allows browsing files in
Code View, not exporting them — so the source code could not be included in `week-01/ai/` as a
downloadable artifact; screenshots and the live link are provided instead, per the assignment's
fallback instructions.
---

## 5. Reflection

Answer all four, in your own words:

1. Which parts of the work did the AI genuinely speed up?
base code like html css js or other prg lang, base framework carcas that takes a time
2. Where did the AI cost you time, or give you something that looked right but was not?
if want to work with ai you always need subcriptions other way you cant even get a code of site that ai generated
and it looks good but you need a testing but problem is you dont know what is wrong so to find smth like bug takes a time but if you dont do it you have problem and of course black box problem
3. Which of these two artefacts would you be willing to put your name on, and why?
on my own work but it doesnt mean i refuse to use ai , i ll use it like a tool but not like full by itself
4. What must a human engineer still be responsible for after this experiment?
to think and uderstand what you need from ai, you need to test ai results