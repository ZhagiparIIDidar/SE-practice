# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a

missing heading reads as a missing section.

Name:

Student ID:

GitHub username:

---

## 1. Setup

|  |  |
| --- | --- |
| AI assistant (tool) | ChatGPT |
| Exact model name and version | GPT-5.6 Luna |
| Date of the session | 27 September 2026 |
| Diagram renderer used | Mermaid |

One tool and one model for all three prompts. If you switched, say why here — it changes what your

findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;

this is the baseline everything else is measured against.

```
Below is a scenario-constrained set of 8 user stories. I’ve also made the two deliberately unresolved decisions explicit in the assumptions so they can be transferred into submission.yml.Student goalsFind a suitable available study room and time.Reserve a room for individual or group study.Cancel a reservation when it is no longer needed.Receive confirmation that a booking or cancellation was completed.Administrator goalsTake unavailable rooms out of service and return them to service.Review how rooms are being used over a period.User storiesIDUser storyPriorityAssumptionUS-01As a Student, I want to view which study rooms are free and when, so that I can choose an available room and time.HighAvailability includes only rooms that are currently bookable; a blocked room is not shown as available.US-02As a Student, I want to book a free study room for a time slot, so that I can use the room for individual or group study.HighA booking may last exactly two hours, and a booking ending exactly when another begins does not overlap.US-03As a Student, I want the system to prevent me from booking a room for a past or current start time, so that every booking begins in the future.High“Future” means the booking start time must be later than the current time.US-04As a Student, I want to cancel a booking I made, so that the room becomes available for another student.HighA student can cancel only a reservation that they made.US-05As a Student, I want to receive confirmation when my booking is completed, so that I know the reservation was successfully made.MediumConfirmation is provided through UC-06 and is limited to confirming the booking.US-06As a Student, I want to receive confirmation when my cancellation is completed, so that I know the reservation was successfully released.MediumConfirmation is provided through UC-06 and is limited to confirming the cancellation.US-07As an Administrator, I want to block or unblock a study room, so that I can take a room out of service or put it back into service.HighA blocked room cannot be booked, while an unblocked room can be considered for booking subject to the other business rules.US-08As an Administrator, I want to review how study rooms are being used over a period, so that I can monitor room usage.MediumThe review covers room usage during a specified period and does not include information outside UC-05.Decisions to put in submission.ymlassumptions:
  booking_boundary:
    decision: "Bookings that end exactly when another booking begins do not overlap."
  maximum_duration:
    decision: "A booking may last exactly two hours."These choices are consistent with R2 and R3 while explicitly resolving both questions the scenario leaves open.
```

---

## 3. Story review (Part 2)

One row per change you made. "Kept unchanged" is a valid row and needs a reason too.

| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
| US-01: View available study rooms | Kept unchanged | It directly matches UC-01 and stays within the Student role and scenario. | US-01 |
| US-02: Book a free study room | Kept unchanged | It directly matches UC-02 and follows the booking rules. | US-02 |
| US-03: Prevent booking with a past or current start time | Kept unchanged | It reflects business rule R1 that a booking must start in the future. | US-03 |
| US-04: Cancel a booking | Kept unchanged | It directly matches UC-03 and allows a Student to release a reservation they made. | US-04 |
| US-05: Receive booking confirmation | Kept unchanged | It directly matches UC-06 for confirmation of a booking. | US-05 |
| US-06: Receive cancellation confirmation | Kept unchanged | It directly matches UC-06 for confirmation of a cancellation. | US-06 |
| US-07: Block or unblock a study room | Kept unchanged | It directly matches UC-04 and the Administrator role. | US-07 |
| US-08: Review room usage | Kept unchanged | It directly matches UC-05 and the Administrator role. | US-08 |

**Did the assistant invent anything outside the scenario?** Name it against the out-of-scope list in

README section 1, or write "no, and here is how I checked".

No. I checked each story against the out-of-scope list: no payments, fees, fines, check-in, attendance, QR codes, equipment, cleaning, maintenance requests, SMS, push notifications, reminders, registration, passwords, authentication, waiting lists, queues, screens, colours, databases, or servers were added

**How many stories did you end with, and why that number?**

I ended with **8 stories** because the scenario asks for 6 to 8 stories, and 8 allows all six use cases to be covered while separating the important Student goals and the two confirmation cases.****

---

## 4. Original AI output — acceptance criteria (Part 3)

```
Here are the assumptions first, followed by 3–5 acceptance criteria for each selected story.US-01Assumptions:A blocked room is not shown as available.Availability is checked for the requested future time period.Acceptance Criteria:Given a study room is free during a future time slot, When the Student views availability, Then the room is shown as available for that time slot.Given a study room is already booked during a time slot, When the Student views availability, Then the room is not shown as available for that overlapping time.Given a room is blocked, When the Student views availability, Then the blocked room is not shown as available.Given a requested time slot is in the past, When the Student checks availability for that slot, Then the system does not allow the Student to use that past slot for a booking.US-02Assumptions:A booking can last up to two hours.A booking must start in the future.A booking ending exactly when another begins does not overlap.Acceptance Criteria:Given a room is available and the requested start time is in the future, When the Student books it for a duration of two hours or less, Then the booking is created successfully.Given a Student attempts to book a room for more than two hours, When the Student submits the booking, Then the system rejects the booking and indicates that the maximum duration is two hours.Given a Student attempts to create a booking with a start time in the past, When the Student submits the booking, Then the system rejects the booking.Given a room already has a booking that overlaps the requested time, When the Student attempts to book that room, Then the system rejects the booking.Given an existing booking ends at 12:00 and a new booking starts at 12:00, When the Student books the room, Then the new booking is allowed because the two bookings do not overlap.US-03Assumptions:A Student can cancel only a booking they made.A booking must have been created for a future time to be eligible for cancellation.Acceptance Criteria:Given a Student has a booking they made, When they choose to cancel it, Then the booking is cancelled and the room becomes available for that time.Given a Student does not own a booking, When they attempt to cancel it, Then the system rejects the cancellation.Given a Student selects a booking that has already been cancelled, When they attempt to cancel it again, Then the system rejects the request and indicates that the booking is no longer active.Given a Student has an active future booking, When they cancel it successfully, Then the cancelled booking no longer prevents another Student from booking that time slot.
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| A free room is shown as available for a future time slot. | No problem. | Kept unchanged. | AC-01 |
| A room with an overlapping booking is not shown as available. | No problem. | Kept unchanged. | AC-02 |
| A blocked room is not shown as available. | No problem. | Kept unchanged. | AC-03 |
| A Student can book an available room for up to two hours. | The maximum duration needed to be explicit. | Clarified that the duration can be two hours or less. | AC-04 |
| A booking longer than two hours is rejected. | No problem. | Kept unchanged. | AC-05 |
| An overlapping booking is rejected. | No problem. | Kept unchanged. | AC-06 |
| A Student can cancel their own active booking. | No problem. | Kept unchanged. | AC-07 |
| A Student cannot cancel another Student's booking. | No problem. | Kept unchanged. | AC-08 |
| A Student cannot cancel an already cancelled booking. | No problem. | Kept unchanged. | AC-09 |

**The two open questions.**

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed | The two bookings do not overlap because one ends exactly when the other begins. |
| Is exactly two hours allowed under R2? | allowed | Two hours is the maximum duration, so a booking of exactly two hours is valid. |

**Which invalid or boundary case did the assistant leave out?**

The assistant left out the case where the booking has an invalid duration, such as an end time that is the same as or earlier than the start time.

## 6. Original AI output — use-case diagram (Part 4)

```
Here is a PlantUML version that stays within the given Smart Campus scenario and uses only justified relationships:@startuml

left to right direction

actor Student
actor Administrator

rectangle "Smart Campus Study Room Booking System" {
    usecase "View availability" as UC1
    usecase "Book room" as UC2
    usecase "Cancel booking" as UC3
    usecase "Block or unblock room" as UC4
    usecase "Review usage" as UC5
    usecase "Send confirmation" as UC6
}

Student --> UC1
Student --> UC2
Student --> UC3

Administrator --> UC4
Administrator --> UC5

UC2 ..> UC6 : <<include>>
UC3 ..> UC6 : <<include>>

@endumlWhy these associations:Student → View availability — needs to see available rooms.Student → Book room — makes a booking.Student → Cancel booking — manages their booking.Administrator → Block or unblock room — manages room availability.Administrator → Review usage — reviews room usage.Book room → Send confirmation and Cancel booking → Send confirmation use <<include>> because confirmation is part of those actions.No screens, databases, internal classes, or unnecessary actors are modeled.
```

Rendered diagram (image, or a link):

![]()https://plantuml.online/uml/TP3FJiCm3CRlVWghzqrYtNP0KoNe6wo2kvjcnLh-eCGTgX3lJbfo81FabC_VprzY6tqH58-1npV1WODMmju1a18Vi9Dfq4woUXeiEuuIA2c0XIKt6erLPoa8jcJVfxWspNZstkApzrTs8tPp56qh_0HCPufQKKnjhwm_a6x4XdesB7E55F6bVIYn9GL3oilshhHRSaeRx7_Uoanz5s6ykcAQONBzUlqLjo_HixujtveYZJeJXvBej1jGUNVXO6bPLyQEy0MGLuQRJRDEKkhTdQu1YgtcylxFwW4W9U1skuWZFkBfn4wPbDSqoQd_SRu1

---

### 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| Associations | No unjustified actor–use-case links were drawn. | Kept only the links that represent actions initiated by Student or Administrator. |
| `Send confirmation` | It is not directly triggered by a person; it is performed by the system as part of booking/cancellation. | Kept it as an `<<include>>` use case rather than connecting it directly to an actor. |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually trigger? Name them.

**None.** All actor–use-case associations represent actions directly initiated by an actor. `Send confirmation` is not directly associated with an actor because it is system behavior included in booking or cancellation.

**Did any screen, database or internal component appear as a use case or an actor?**

**No.** The diagram contains only the two actors (**Student**, **Administrator**) and the relevant system-level use cases. No screens, databases, or internal components are modeled.

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- **Use cases with no story behind them:** none
- **Stories with no use case they belong to:** none
- **Criteria that test no rule from section 1:** AC-01, AC-02, AC-03, AC-07, AC-08, AC-09
---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
PS D:\MyFiles\Study\SE\practices\SE-practice\week-03\Practice\Practice> python tests/check_requirements.py
FAIL   US-1  user-stories.md         2 TODO placeholder(s) left in the file
PASS   US-2  user-stories.md         6 stories, IDs US-01…US-06
PASS   US-3  user-stories.md         every story has the required sentence shape
PASS   US-4  user-stories.md         every story has a priority
PASS   US-5  user-stories.md         every story declares an assumption
PASS   US-6  user-stories.md         only Student and Administrator appear as roles
PASS   US-7  user-stories.md         nothing from the out-of-scope list appears
PASS   AC-1  acceptance-criteria.md  no placeholders left
PASS   AC-2  acceptance-criteria.md  three sections, all naming real stories: US-01, US-02, US-03
PASS   AC-3  acceptance-criteria.md  every section has 3 to 5 uniquely numbered criteria
PASS   AC-4  acceptance-criteria.md  all 9 criteria are complete Given/When/Then
PASS   AC-5  acceptance-criteria.md  every section covers an invalid or boundary case
PASS   AC-6  acceptance-criteria.md  3 assumptions listed before the criteria
PASS   AC-7  acceptance-criteria.md  both open questions are settled in the assumptions
PASS   PU-1  use-cases.puml          valid PlantUML block, no placeholders
PASS   PU-2  use-cases.puml          exactly two actors: Student, Administrator
PASS   PU-3  use-cases.puml          all six use cases present
PASS   PU-4  use-cases.puml          system boundary present
PASS   PU-5  use-cases.puml          no screens, databases or internal components
PASS   PU-6  use-cases.puml          no unjustified actor associations found
PASS   TR-1  traceability.md         all six use cases have a row
PASS   TR-2  traceability.md         every ID in the table resolves
PASS   TR-3  traceability.md         every story appears in the table
------------------------------------------------------------------------
22 PASS · 1 FAIL · 0 ERROR   (23 checks)
Every FAIL goes in lab-report.md section 9 with what you decided about it.
A FAIL you report and explain costs you nothing. One you hide costs the criterion.
```

```
$ python tests/validate_submission.py
submission.yml — submission.yml
------------------------------------------------------------------------
PASS   schema                                    1
PASS   week                                      03
FAIL   student.name                              left empty
PASS   student.student_id                        24B031016
PASS   student.github                            ZhagiparIIDidar
PASS   assistant.tool                            ChatGPT
PASS   assistant.model                           GPT-5.6 Luna
PASS   counts.user_stories                       6
PASS   counts.acceptance_criteria_sets           3
FAIL   checker.pass                              left empty — run the checker and report the result
FAIL   checker.fail                              left empty — run the checker and report the result
FAIL   checker.error                             left empty — run the checker and report the result
FAIL   checker.commit                            left empty
PASS   assumptions.overlap_touching_bookings     allowed
PASS   assumptions.exactly_two_hours             allowed
PASS   traceability.use_cases_not_covered        []
PASS   traceability.stories_not_traced           []
NOTE   traceability                              you are claiming full coverage in both directions — that is rare on a first pass, and it is checked
FAIL   review_findings                           three or more required, found 0
PASS   honesty.can_explain_everything_submitted  yes
PASS   honesty.ai_usage_disclosed                yes
------------------------------------------------------------------------
14 PASS · 6 FAIL · 0 ERROR · 1 note
Fix the FAIL and ERROR lines above, then run this again before you push.
```

|  | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | 22 | 1 | 0 |
| `validate_submission.py` | 14 | 6 | 0 |

Commit these numbers were produced at (`git rev-parse --short HEAD`): f5693e8

### Every FAIL

- **US-1:**`user-stories.md` has 2 TODO placeholders left. **Decision:** remove the remaining TODO placeholders before the final submission.
- **student.name:** The student name is empty in `submission.yml`. **Decision:** fill in my name before the final submission.
- **checker.pass:** The checker result was not recorded. **Decision:** fill in `22` after running the checker.
- **checker.fail:** The checker result was not recorded. **Decision:** fill in `1` after running the checker.
- **checker.error:** The checker error count was not recorded. **Decision:** fill in `0` after running the checker.
- **checker.commit:** The commit hash was not recorded. **Decision:** fill in `f5693e8`.
- **review_findings:** Fewer than three review findings were recorded. **Decision:** add at least three findings from the requirements review.  
**Did you run the checks by hand instead of with Python?**
## No. I ran both checks with Python using `check_requirements.py` and `validate_submission.py`.

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
a checker?  

2. What did the assistant get right that would have taken you noticeably longer by hand?  

3. You are handing these requirements to someone who will implement them, and you will not be in the  

room. Which single one would you rewrite first, and why?

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote

US-07, and the checker is what told me" is worth everything.