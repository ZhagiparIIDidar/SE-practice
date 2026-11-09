# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (claude.ai) | Claude Sonnet 5.5 | the first test suite (Task 3) | `suites/first/booking.test.ts` |
| Claude (claude.ai) | Claude Sonnet 5.5 | the improvement prompt (Task 5) | `app/src/booking.test.ts` |
| Claude (claude.ai), this chat | Claude Sonnet 5.5 | wording of `lab-report.md` sections 1–9 from my own observations and run outputs; the final suite file | `lab-report.md`, `submission.yml`, `AI_USAGE.md`, `app/src/booking.test.ts` |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes / no
<!-- If "yes": which change, in which file, and how you checked that the behaviour did not change. -->

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes
<!-- If "yes": which one, the exact model, and for which section. -->
Claude (this chat), Claude Sonnet 5.5: drafted the wording of `lab-report.md` sections 1–9 from my observations and results. Section 10 I wrote myself. Another assistant suggested the extra cases B01–B12 (tool and model: FILL IN); I checked each expected value against AC1–AC5 before adding it.

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain every test in my final suite — its input, its expected result and the AC behind
it — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
`app/src/booking.test.ts`: the helpers `makeInput` and `check`, and `structuredClone` in the AC5 and B12 tests. I understand what they do, but I did not write them myself.
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: Жағыпар Дидар Қанатұлы
Date: 09.11.2026
