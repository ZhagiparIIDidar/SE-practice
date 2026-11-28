# Notes for Student Action

## Action needed
- Step: `report.md` §10 — AI reflection (Task 6) and `README.md` §11 / §15
- What must be done: Write a 200–300 word reflection in your own words answering all five required questions (context provided, useful/incorrect suggestions, what you verified, how tests influenced decisions, what to improve next), then update §9 (`Checker results and known fails`) to `none` after re-running `python tests/check_sis.py`.
- Why: `README.md` §11 and §15 explicitly forbid the AI assistant from writing §10 ("your own words, no assistant"; "Zero: Missing, or written by the assistant").
- Blocking: yes (causes check `L10` to fail until completed)

## Action needed
- Step: `AI_USAGE.md` signature
- What must be done: Review `AI_USAGE.md`, verify the yes/no statements, and replace `<your name>` on the `Signed:` line with your full name.
- Why: Personal academic integrity sign-off requires the student's own name and verification.
- Blocking: no

## Action needed
- Step: `README.md` §8 — PlantUML diagram rendering check
- What must be done: Optionally paste `diagrams/before.puml` and `diagrams/after.puml` at https://www.plantuml.com/plantuml to confirm they render cleanly.
- Why: External web service check outside the sandbox/local environment.
- Blocking: no

## Action needed
- Step: `README.md` §13 — `submission.yml` declaration and validation
- What must be done: After writing §10, deleting `app/node_modules/`, running the final `python tests/check_sis.py`, and committing `report.md` / `AI_USAGE.md` / `NOTES.md`, fill in `sis-04/submission.yml` (student details, counts, checker numbers, commit hash, `known_fails`, `review_findings`, `honesty`), then run `python tests/validate_submission.py`.
- Why: `AGENT.md` protects `submission.yml` from being modified or staged by the agent, and it requires your personal student ID, group, GitHub username, and final commit hash.
- Blocking: yes

## Action needed
- Step: `README.md` §14 — Push branch `sis-04`, open PR, and submit link in Teams
- What must be done: Push `sis-04` to `origin`, open PR `sis-04 -> main` titled `SIS 04 - Room catalog and refactoring - <Surname Name>` with the five required headings, leave it open, and paste the PR URL into Microsoft Teams.
- Why: Requires GitHub credentials, remote push permission, and Teams web submission.
- Blocking: yes
