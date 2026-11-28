# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).  

You are responsible for the accuracy, testing and integrity of everything you submit,  

including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| Antigravity CLI | Gemini 4 Hydrogen (High) | 2026-11-28 | codebase analysis (Task 1) | `report.md` (§2–§3) |
| Antigravity CLI | Gemini 4 Hydrogen (High) | 2026-11-28 | improvement plan | `report.md` (§3.2–§3.3) |
| Antigravity CLI | Gemini 4 Hydrogen (High) | 2026-11-28 | feature extension (Task 2) | `app/src/rooms.ts`, `app/src/filter.ts`, `app/src/booking.ts`, `app/src/App.tsx`, `app/src/components/FilterBar.tsx`, `app/src/components/RoomSelector.tsx`, `app/src/index.css` |
| Antigravity CLI | Gemini 4 Hydrogen (High) | 2026-11-28 | refactoring (Task 3) | `app/src/booking.ts`, `app/src/lib/checkAvailability.ts`, `app/src/types.ts`, `diagrams/before.puml`, `diagrams/after.puml` |
| Antigravity CLI | Gemini 4 Hydrogen (High) | 2026-11-28 | tests & documentation (Task 4–5) | `app/src/catalog.test.ts`, `app/README.md`, `evidence/*.png`, `report.md` (§4–§9) |



**The assistant wrote, or helped write, tests in `app/`:** yes



`app/src/catalog.test.ts` (13 tests for F1–F5, B1–B6, INT). Expected values were verified against the requirements in `README.md` §5 and §9 using a fixed inline `CATALOG` fixture in the test file.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and  

why each module exists:** yes

**Anything I accepted from the AI without fully understanding it:**  

none

Signed: Жағыпар Дидар Қанатұлы