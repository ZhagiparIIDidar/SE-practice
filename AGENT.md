# AGENTS.md

Rules for any AI agent working in this repository (KBTU, AI-Driven Software Engineering lab work).
Reply to the student in Russian, short and to the point.

## Protected files: never edit, create over, rename or delete

- `AI_USAGE.md`
- `README.md`
- `submission.yml`
- `tests/` (the provided checker and validator scripts; read and run them, never change them)

If a task seems to need a change in one of these, stop and tell the student which line and why.
The student edits these files himself.

## Principles

1. **Do not invent facts.** Test results, terminal output, commit hashes, counts and yes/no
   declarations come only from what the student sends or from a command you actually ran.
   Never write "tests pass" without running them.
2. **Ask before guessing.** If an input, a file or a requirement is unclear or missing, ask one
   short question and wait.
3. **Smallest change that works.** Change only what the task asks for. One fix per bug.
   No unrelated refactors, renames or formatting.
4. **Expected values come from the requirements (AC), never from the current output of the code.**
   Do not change a correct test to make buggy code pass.
5. **Reproduce first, then fix.** Show the failing test before a patch and the passing run after it.
6. **Do not touch the code under test unless the task says so** (for example, never "fix"
   `canBook` while writing tests).
7. **Edit existing files in place.** Do not create new copies of `lab-report.md`; make targeted
   edits and keep the headings unchanged.
8. **Parts the student must write himself stay his.** Do not write sections marked "in your own
   words" or "without the assistant" (for example, the conclusion). You may give a short example
   and check the word count.
9. **Disclose, do not hide.** Anything the AI produced is reported honestly in `AI_USAGE.md`
   (which the student fills in).
10. **Never use another student's work** (their report, declaration or results) as a source for
    this student's data.

## Git and files

- Do not commit, push, rebase, reset or delete branches unless the student asks. Show the commands
  instead.
- Never commit `node_modules/`, `.idea/` or `.env`.
- Run tests from the project's `app/` folder with `npx vitest run`, so the Vitest version matches
  the report.