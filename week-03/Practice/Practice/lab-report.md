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
(paste here)
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
|  |  |  |  |

**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed / not-allowed |  |
| Is exactly two hours allowed under R2? | allowed / not-allowed |  |

**Which invalid or boundary case did the assistant leave out?**

---

## 6. Original AI output — use-case diagram (Part 4)

```
(paste the PlantUML source exactly as generated)
```

Rendered diagram (image, or a link):

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
|  |  |  |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually  

trigger? Name them.

**Did any screen, database or internal component appear as a use case or an actor?**

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them:
- Stories with **no use case** they belong to:
- Criteria that test **no rule** from section 1:
**What does the largest gap tell you about the generated requirements?**

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
(paste)
```

```
$ python tests/validate_submission.py
(paste)
```

|  | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` |  |  |  |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and  

explain costs you nothing.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it  

has to be said.

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without  

a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the  

room. Which single one would you rewrite first, and why?
Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote  

US-07, and the checker is what told me" is worth everything.