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
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | **ERROR** | PASS | PASS | **ERROR** |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | **ERROR** | PASS | PASS | **ERROR** |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | **ERROR** | PASS | PASS | **ERROR** |
| 4 | `analyze_marks([], 50)` | raises ValueError | **ERROR** | PASS | PASS | **ERROR** |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | **ERROR** | PASS | PASS | **ERROR** |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | **ERROR** | PASS | PASS | **ERROR** |
|  | **Totals** |  | 0/6 | 6/6 | 6/6 | 0/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| a | ERROR | defines no callable named 'analyze_marks' |
| d | ERROR | could not be imported: ModuleNotFoundError: No module named 'pandas' |
|  |  |  |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,  
> 
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
PS D:\MyFiles\Study\SE\practices\SE-practice\week-02> python tests/test_analyze_marks.py code/prompt_a.py
ERROR: code\prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
```

**Prompt B**

```

========================================================================
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks list cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: non-numeric value found: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range (0-100): -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_b.py)
========================================================================
```

**Prompt C**

```

========================================================================
analyze_marks harness — code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks list cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: non-numeric mark found: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range (0-100): -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_c.py)
========================================================================
```

**Prompt D**

```
ERROR: code\prompt_d.py could not be imported: ModuleNotFoundError: No module named 'pandas'
The file must define analyze_marks and must not crash on import.
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 0 |
| Requirement coverage | 2 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 2 | 2 | 0 |
| Assumptions stated | 0 | 2 | 2 | 0 |
| Noise (2 = none) | 0 | 1 | 1 | 1 |
| **Total / 10** | 2 | 9 | 9 | 3 |

**Prompt length, in words:** A __6__ · B __44 __ · C __40 __ · D __95 __

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually  

use at work; (2) which single addition bought the most correctness, naming the exact case that  

changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
Prompt B and Prompt C produced the best code with a score of 9/10. However, if I had to choose one prompt for real work, I would use Prompt B because it gives clear requirements without adding too much extra information. It produced correct results in all six test cases. Prompt C also got 9/10, but its additional examples and tests were not necessary because B already passed all cases. Prompt B's most useful addition was the exact function requirements, especially the required function name and input validation. This changed the result from Prompt A, which got 0/6 because it did not define a callable analyze_marks, to Prompt B, which passed 6/6. The single addition that bought the most correctness was clearly specifying the function signature and required behavior. Prompt C added examples and tests, but they were mostly useful for verification rather than fixing a failing case, because B already passed every test. In Prompt D, the role, workplace context, and freedom to choose field names were mostly noise. D also added reading data from an Excel file, which caused a ModuleNotFoundError: No module named 'pandas' and made all six tests fail. The main ambiguity was how much context to give the AI without making it create unnecessary code. I tried to resolve this in D by giving more context, but the result shows that extra context can introduce unnecessary dependencies and complexity.
```

**Word count:**

---

## 9. Two questions for the debrief

Written before class, answered in class.

1.is it too easy task to check ai skills or our prompt lvl  

2.is there diff between other ai