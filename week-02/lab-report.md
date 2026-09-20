# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:**  

**Group:**  

**Date:**

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them  
> 
> by number. If something did not happen, write "did not happen" and why; an empty section and a  
> 
> fabricated one are graded the same way.

---

## 1. The frozen experiment

|  |  |
| --- | --- |
| AI assistant | Claude |
| Exact model name | Sonnet 5, effort medium |
| Implementation language | Python |
| Date of the runs | 20.09.2026 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can  

be checked:

```
(paste here, or write "n/a — used Python")
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes / no
- No follow-up questions were asked before Part 7: yes / no
- Every output was saved **before** any editing: yes / no
---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass  

threshold, a rounding rule, an input method, an invented feature all count.

1. ai wrote a Docstring  

2. ai wrote a sample data  

3. ai set a min marks per subject itself and name of a python file is  Analyze student marks

**Questions it should have asked and did not:**

1.what is the min marks per subject  

2.do you need input in console or it works with

**Is the function named `analyze_marks` with the required signature?** yes / no — if no, what is it  

called: Analyze student marks

**First impression before testing** (one sentence — you will compare this with section 6 later):

ai wrote huge code that needs time to test, understand instead of little func

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1. code more less and friendly   

2. used base python lvl

**What B still leaves open:**

1.still have docstring that i didnt ask to do  

2.ai decided to write the types at its discretion

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | y |
| decimals | y |
| custom pass_mark | y |
| empty list | y |
| text value | y |
| below 0 / above 100 | y |

**Do the AI's own tests pass against the AI's own code?** yes / no

yes

**Do they agree with the harness in section 6?** yes / no — if no, where do they disagree:

**Assumptions C stated explicitly before the code:**

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
your seniour python developer on dome school, write on python func analysis_marks, func, it should return dict(average, highest, lowest, pass_rate), empty list, non-numeric values, range 0-100, return bool results as string at the end like 'true' 'false' + contects , reads data from exel file, name of fields you can set yourself
```

**What I deliberately added that A, B and C did not have:**

1. where data comes  

2. role + work place  

3. some freedom

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**

**if you give a role ai changes his code, it write a lot, so i gave him more context**

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 |  |  |  |  |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 |  |  |  |  |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 |  |  |  |  |
| 4 | `analyze_marks([], 50)` | raises ValueError |  |  |  |  |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError |  |  |  |  |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError |  |  |  |  |
|  | **Totals** |  | /6 | /6 | /6 | /6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,  
> 
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```

```

**Prompt B**

```

```

**Prompt C**

```

```

**Prompt D**

```

```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) |  |  |  |  |
| Requirement coverage |  |  |  |  |
| Verifiability (tests) |  |  |  |  |
| Assumptions stated |  |  |  |  |
| Noise (2 = none) |  |  |  |  |
| **Total / 10** |  |  |  |  |

**Prompt length, in words:** A ____ · B ____ · C ____ · D ____

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually  

use at work; (2) which single addition bought the most correctness, naming the exact case that  

changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)
```

**Word count:**

---

## 9. Two questions for the debrief

Written before class, answered in class.

1.  

2.