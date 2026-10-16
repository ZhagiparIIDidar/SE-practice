# SIS #02 — AI-Assisted UML Modeling: University Course Registration

## 1. Scope and assumptions

**Scope:** The system allows students to browse course offerings for one semester, view course details and available places, and register for an offering. It records successful enrollments, updates availability, provides confirmation, and clearly explains rejected registration attempts. Payments, prerequisites, timetable clashes, waiting lists, and cancellation are out of scope.

**Assumptions:**

1. Students must be authorized to register, and each enrollment links one student to one course offering.
2. Each offering has a defined capacity. The system must prevent duplicate enrollments for the same student and offering and must not allow the enrollment count to exceed capacity, including during concurrent registration attempts.
## 2. User stories and acceptance criteria

### US-01 — Browse offerings

**US-01:** As a student, I want to view course offerings for one semester, so that I can check course details and available places.

- **AC-01** (R1): Given a semester with course offerings, When a student views the catalog for that semester, Then the system displays each offering's course code, title, offering identifier, and available places.
- **AC-02** (R1): Given a semester with no course offerings, When a student views the catalog for that semester, Then the system displays an empty catalog.
### US-02 — Register for an offering

**US-02:** As an authorized student, I want to register for an available course offering, so that my enrollment is recorded and I receive confirmation.

- **AC-03** (R2, R3, R4): Given an authorized student who is not enrolled in an offering with available capacity, When the student registers for that offering and a place remains available, Then the system creates exactly one Enrollment linking the student and offering, updates availability, and returns a confirmation.
- **AC-04** (R2, R4, R5): Given an offering with exactly one available place and two different authorized students who are not enrolled in it, When both students attempt to register concurrently, Then at most one new enrollment is created, the enrollment count never exceeds capacity, and any rejected request receives the explanation "course full" without creating an enrollment.
### US-03 — Receive a clear rejection

**US-03:** As a student, I want to receive a clear explanation when registration is rejected, so that I understand why I could not enroll.

- **AC-05** (R2, R5): Given an offering whose capacity has been reached, When an authorized student attempts to register, Then the system rejects the request with the explanation "course full", creates no enrollment, and leaves the enrollment count unchanged.
- **AC-06** (R3, R5): Given an authorized student who is already enrolled in an offering, When the student submits another registration request for the same offering, Then the system rejects the request with the explanation "already enrolled", creates no enrollment, and leaves the enrollment count unchanged.
## 3. Sequence diagram

![Final sequence diagram](models/img/sequence.png)

**Participants:** (write here — each lifeline and what it stands for)

**Atomic operation:** (write here — which messages form the one atomic step: the final duplicate check, the capacity check and the creation of the Enrollment, and why a catalog view reserves nothing)

**Where the Enrollment is created:** (write here — which message, which lifeline, and which class in section 4 it produces)

**Technical lifelines:** (write here — every lifeline that is NOT a class in the class diagram, by name, and why the difference in abstraction is fine. "None" if there are none.)

## 4. Class diagram

![Final class diagram](models/img/classes.png)

| Association | Read left to right | Read right to left |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

**How an Enrollment links a student to an offering:** (write here)

**Capacity constraint:** (write here — and why multiplicity alone cannot express it)

**Uniqueness constraint:** (write here — and why multiplicity alone cannot express it)

## 5. Traceability

| Rule and criterion | Model evidence | Validation case |
| --- | --- | --- |
| R1 + (write here) | (write here) | (write here) |
| R2 + (write here) | (write here) | (write here) |
| R3 + (write here) | (write here) | (write here) |
| R4 + (write here) | (write here) | (write here) |
| R5 + (write here) | (write here) | (write here) |

## 6. Walkthroughs

| Case | Observed path and state change | Judgment and evidence |
| --- | --- | --- |
| T1. Available | (write here) | (write here) |
| T2. Last place | (write here) | (write here) |
| T3. Full | (write here) | (write here) |
| T4. Duplicate | (write here) | (write here) |

## 7. Review decisions

| AI suggestion or model element | Decision | Reason | Rule |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

## 8. Modeling explanation

(write here)

## 9. Reflection

(write here)

## 10. Appendix A — Before AI

**Scope:**The system allows students to view a course catalog, select a course offering, and register. It confirms successful registration or rejects it if the requirements are not met. Payment and course creation are excluded from the model

**Initial assumptions:**

1. Every student has an account and must be authorized before registration
2. Each course offering has a limited capacity, and two students cannot take the same last available place.
## 11. Appendix B — AI exchanges

### B1 — Requirements (Prompt A)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** draft 3 user stories and 6 acceptance criteria  
**Prompt:**
```
Act as a requirements analyst. Use only this course registration scenario and rules R1–R5: R1. Catalog Show the course code, title, offering and available places for one semester.   R2. Capacity Recheck current availability when registering. Enrollment must never exceed the offering's capacity.   R3. Duplicates A student may have at most one enrollment in the same offering. Reject a repeat request.   R4. Success Create exactly one Enrollment linking the student and offering, update availability and return a confirmation.   R5. Rejection Explain "course full" or "already enrolled". Create no enrollment and leave the enrollment count unchanged.. My initial assumptions are Initial assumptions:Every student has an account and must be authorized before registrationEach course offering has a limited capacity, and two students cannot take the same last available place.Draft 3 user stories and 2 Given / When / Then acceptance criteria for each. Use IDs US-01 to US-03 and AC-01 to AC-06. Map each criterion to rule IDs.Cover normal and rejection behavior. List uncertainty separately. Do not add excluded features or invent university policies.
```

**Response:**

```
User StoriesUS-01 — View Course CatalogAs a student, I want to view course offerings for one semester so that I can check course details and available places.US-02 — Register for a CourseAs an authorized student, I want to register for an available course offering so that my enrollment is recorded and I receive confirmation.US-03 — Handle Registration RejectionsAs a student, I want to receive a clear explanation when registration is rejected so that I understand why I could not enroll.Acceptance CriteriaAC-01 — Display Course OfferingsGiven a semester with course offerings,
When a student views the catalog for that semester,
Then the system displays each offering's course code, title, offering identifier, and available places.Mapped rule: R1AC-02 — Successful RegistrationGiven an authorized student who is not enrolled in an offering with available capacity,
When the student registers for that offering and a place remains available at the time of registration,
Then the system creates exactly one Enrollment linking the student and offering, updates availability, and returns a confirmation.Mapped rules: R2, R3, R4AC-03 — Reject Registration When FullGiven an offering whose capacity has been reached,
When an authorized student attempts to register,
Then the system rejects the request with the explanation "course full", creates no enrollment, and leaves the enrollment count unchanged.Mapped rules: R2, R5AC-04 — Reject Duplicate EnrollmentGiven a student who is already enrolled in an offering,
When the student submits another registration request for the same offering,
Then the system rejects the request with the explanation "already enrolled", creates no enrollment, and leaves the enrollment count unchanged.Mapped rules: R3, R5AC-05 — Prevent Capacity OverflowGiven an offering with exactly one available place and two different authorized students who are not enrolled in it,
When both students attempt to register concurrently,
Then at most one new enrollment is created, the enrollment count never exceeds capacity, and any rejected request receives the explanation "course full" without creating an enrollment.Mapped rules: R2, R4, R5AC-06 — Recheck Availability at RegistrationGiven a student who is not enrolled in an offering that previously had an available place,
When the student attempts to register after that place has been taken by another student,
Then the system rejects the request with the explanation "course full", creates no enrollment, and leaves the enrollment count unchanged.Mapped rules: R2, R5UncertaintyAuthorization: The initial assumptions state that students must be authorized, but R1–R5 do not define the authorization mechanism or the expected behavior for unauthorized requests.Offering identifier: R1 requires displaying the offering, but does not specify its exact format or whether it has a separate identifier.Concurrency: R2 requires preventing capacity overflow, but does not specify the technical mechanism for handling simultaneous requests.Catalog availability: R1 specifies a catalog for one semester, but does not define what the system should display if that semester has no offerings.
```

### B2 — UML drafts (Prompt B)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** draft the sequence and class diagrams  
**Prompt:**
```
Using my approved scenario, R1–R5, stories and criteria below, return separate PlantUML code blocks for a sequence diagram and a domain class diagram.
Sequence: include catalog browsing and guarded success, full-course and duplicate outcomes. Model final checks and creation as one atomic operation.
Class: show domain concepts, useful attributes and multiplicities. State the capacity and uniqueness constraints. Explain assumptions and any technical lifelines.
```

**Response:**

```
Below are two PlantUML diagrams based on your approved course-registration scenario. They include catalog browsing, successful registration, full-course rejection, duplicate-enrollment rejection, and protection against concurrent registration exceeding capacity.1. Sequence diagramThis diagram models the final validation and enrollment creation as one atomic operation so two concurrent requests cannot take the same last place.
@startuml
title Course Registration — Sequence Diagram

actor Student
boundary "Course Catalog UI" as UI
control "Registration Service" as RS
database "Enrollment Database" as DB

== Browse offerings ==

Student -> UI: Browse offerings for semester
UI -> RS: getOfferings(semester)
RS -> DB: findOfferings(semester)
DB --> RS: Offerings with available places
RS --> UI: Catalog data
UI --> Student: Display course details and availability

== Register for an offering ==

Student -> UI: Register for offering
UI -> RS: register(studentId, offeringId)
RS -> DB: atomicRegister(studentId, offeringId)

note over DB
Within one atomic transaction:
1. Check offering exists and has capacity
2. Check student is not already enrolled
3. Create enrollment and update availability
end note

alt Offering does not exist
    DB --> RS: Rejected: offering not found
    RS --> UI: Registration rejected
    UI --> Student: Explain rejection
else Student already enrolled
    DB --> RS: Rejected: already enrolled
    RS --> UI: Registration rejected
    UI --> Student: "Already enrolled"
else Offering is full
    DB --> RS: Rejected: course full
    RS --> UI: Registration rejected
    UI --> Student: "Course full"
else Valid and capacity available
    DB --> DB: Create Enrollment\nCommit transaction
    DB --> RS: Registration confirmed
    RS --> UI: Confirmation
    UI --> Student: Display confirmation
end

@enduml
How it worksBrowsing retrieves offerings and their available places.A registration request checks for an existing enrollment and available capacity.The database performs the checks and enrollment creation atomically. If two students request the last place concurrently, at most one registration succeeds.A rejected request creates no enrollment and returns a clear explanation.The “offering not found” outcome is a defensive assumption. The three main registration outcomes required by your criteria are duplicate enrollment, full course, and success.2. Domain class diagram
@startuml
title Course Registration — Domain Class Diagram

class Student {
  +studentId: UUID
  +name: String
  +isAuthorized: Boolean
}

class Semester {
  +semesterId: UUID
  +name: String
}

class Course {
  +courseCode: String
  +title: String
}

class Offering {
  +offeringId: UUID
  +capacity: Integer
  +enrolledCount: Integer
  +availablePlaces(): Integer
}

class Enrollment {
  +enrollmentId: UUID
  +createdAt: DateTime
}

Semester "1" -- "0..*" Offering : contains
Course "1" -- "0..*" Offering : offered as
Offering "1" -- "0..*" Enrollment : has
Student "1" -- "0..*" Enrollment : makes

note right of Offering
Constraint:
capacity >= 0
0 <= enrolledCount <= capacity

availablePlaces =
capacity - enrolledCount
end note

note bottom of Enrollment
Uniqueness constraint:
UNIQUE(studentId, offeringId)

Each enrollment belongs to
exactly one student and one offering.
end note

note bottom of Offering
An offering identifies a course
in a particular semester.

Enrollment changes must preserve
the capacity constraint.
end note

@enduml
3. Assumptions and technical lifelinesElementPurposeStudentRepresents an authorized student who browses and registers.CourseStores the course code and title.SemesterGroups offerings by semester.OfferingRepresents a particular course offering with a defined capacity.EnrollmentRecords the relationship between a student and an offering.Course Catalog UITechnical lifeline that displays catalog data and registration results.Registration ServiceTechnical lifeline that receives requests and coordinates registration.Enrollment DatabaseTechnical lifeline responsible for atomic registration and persistent constraints.Key constraintsCapacity: The number of enrollments must never exceed the offering's capacity.Uniqueness: A student can have at most one enrollment for the same offering.Atomicity: Validation and enrollment creation must behave as one indivisible operation under concurrent requests.Rejection: A rejected registration does not create an enrollment and returns a clear reason.Availability: Available places equal capacity minus the number of enrolled students.Important implementation detail: The class diagram expresses domain constraints, while the sequence diagram shows how registration is performed. In a real database, enforce uniqueness with a unique constraint on (studentId, offeringId). Capacity needs an appropriate transaction or locking strategy; checking availability in application code alone is not sufficient to prevent concurrent overbooking.
```

### B3 — Model critique (Prompt C)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** review both models against R1–R5 and T1–T4  
**Prompt:**
```
(paste here)
```

**Response:**

```
(paste here)
```

### B4 — Focused revision (Prompt D)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** apply my accepted review decisions  
**Prompt:**
```
(paste here)
```

**Response:**

```
(paste here)
```

## 12. Appendix C — Original diagrams

![Original sequence diagram](models/img/original-sequence.png)

![Original class diagram](models/img/original-classes.png)

## 13. Appendix D — References and source checks

### References

- (write here)
### Source checks

| Modeling decision | Source and locator | What the source says | How it supports or changed your model |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |