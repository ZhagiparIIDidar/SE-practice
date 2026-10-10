# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

**Topic:** 1.1

---

## 1. Scenario

**Question:** What does a software team need to deliver a reliable room-booking system beyond the program code, and how should the team verify, document, deploy, and support it?

**Users:** Students book rooms; administrators manage availability; developers and testers build and maintain the system.

**Problem:** Students need conflict-free bookings, and administrators must block rooms when needed.

**Constraints:**
1. **Technical:** The system must prevent overlapping active bookings for the same room.
2. **Time:** **Fictional assumption:** The team has four weeks for development, testing, documentation, and deployment.

**Risk:** Two overlapping bookings could both be confirmed, causing room conflicts and reducing trust.

**Assumptions:** The university has 20 rooms; users use a browser and students use university accounts; the first version supports booking and cancellation but excludes payments and mobile apps; the university provides a server and administrator. These are fictional, not verified facts.

## 2. Analysis

A reliable room-booking system needs more than code. Its main risk is confirming two overlapping bookings for the same room, so each delivery activity should reduce that risk.

**Scenario assumptions (not verified facts).** Four weeks, 20 rooms, browser access, university accounts, and university-provided hosting are fictional assumptions; the sources do not show that four weeks is enough.

**Requirements.** The team must define the overlap rule. For example, 10:00–11:00 and 11:00–12:00 do not overlap if the end time is excluded, but stakeholders must confirm this. Requirements should also cover valid times, blocked rooms, cancellation ownership, and administrator-only room blocking. Agreeing rules takes time but prevents ambiguity in tests.

**Verification.** Tests should cover valid and invalid bookings, blocked rooms, cancellations, permissions, overlaps, and simultaneous requests. ASTQB’s page on ISTQB principles says testing can reveal defects but cannot prove none remain (ASTQB, n.d.). Google’s review guide recommends checking design, functionality, and automated tests (Google, n.d.). Review and testing work together: reviewers can question test design, while tests give reviewers evidence. Django documentation shows a PostgreSQL exclusion constraint for overlapping reservations, excluding cancelled ones (Django Software Foundation, n.d.). This is a possible database-level approach, not proof that this implementation handles concurrent requests safely; it also ties the design to PostgreSQL. The team should verify the exact constraint behaviour against its chosen database and test persisted results from simultaneous requests.

**Documentation.** Diátaxis separates documentation into tutorials, how-to guides, reference, and explanation (Canonical, n.d.). A small team could provide setup instructions, student and administrator guidance, and a description of booking rules and the database. Documentation takes time and should be updated when rules or deployment steps change.

**Deployment and support.** The Twelve-Factor App says configuration, including credentials, should be separate from code (Wiggins, 2017). Because the first version runs on a university-provided server, the team should agree with the university’s administrator who is responsible for deployment, backups and access before release. Production-like testing, backups, rollback, and restoration checks are my recommendations, not claims established by that source. Maintenance includes correcting defects and adapting to a changed environment (IEEE Computer Society, n.d.). Monitoring failed bookings and errors is also my recommendation. The team should decide which safeguards are proportionate to its resources, because operational work competes with development time.

## 3. Review

I compared B2 with the text that was actually supplied to it. B2 reviewed Prompt A rather than the explanation generated in B1, so its detailed comments were not a reliable review of the B1 draft. I therefore treated the original B2 run as a process error instead of applying all its comments to B1.

Some ideas in the original critique were still useful for my review. I kept the need to define exactly when bookings overlap, test boundary cases, and consider simultaneous booking requests. I also kept the distinction between code coverage and proof of correctness: a test suite can miss a defect if it does not exercise the relevant situation. The warning that transactions alone do not automatically guarantee the required booking rule was useful, but I did not treat it as a verified technical conclusion without checking the database documentation.

I also identified problems in B1 itself. It did not clearly define the booking boundary rule, explain student and administrator permissions, or provide the requested list of claims to verify. It recommended staging, backups, and rollback without supplied evidence for those practices. Its discussion of simultaneous requests identified a risk but did not explain how the system would enforce the no-overlap requirement.

For the corrected review, I would prioritise booking-rule correctness and authorization, then test evidence and deployment readiness. General advice about planning and documentation is relevant, but it matters less than preventing a confirmed double-booking. I will keep recommendations that are not supported by the supplied sources clearly labelled as recommendations and avoid claiming that any single test or database mechanism proves perfect reliability.

## 4. Conclusion

A reliable room-booking system requires more than working code. The team must define booking rules, test normal and boundary cases, check permissions, document how the system is used and maintained, configure deployment safely, and support the system after release. The central risk is that two overlapping bookings for the same room are both confirmed.

The sources support the principle that testing can reveal defects but cannot prove that none remain, the value of independent code review, separating configuration from code, using distinct documentation modes, and treating maintenance as ongoing work. They do not establish that a specific implementation will prevent double-booking under concurrency or that this project can be completed in four weeks. Staging, backup, rollback, and monitoring details should remain labelled as proposed practices until supported by suitable sources and tests.

## 5. Reflection

The first B2 run did not review B1: its input was Prompt A, so the critique described a prompt rather than the generated explanation. Comparing the texts showed why I should check that each AI step uses the correct input. I kept the original run in the appendix as a record of the mistake.

For the revision, I separated source-supported claims from recommendations. The supplied sources support general points about testing, code review, documentation, configuration, and maintenance, but they do not prove that a particular database design prevents concurrent double-booking. I still need to verify source editions and complete the reference list in the required style. In future, I will check each prompt input, open cited source sections, and decide whether each suggested change is justified before submitting. I also learned that a review is only useful when it examines the intended draft; a detailed critique cannot compensate for supplying the wrong text. Before submission, I will rerun the checker and confirm that the report structure and word counts meet the assignment rules.

## 6. Source verification notes

Check: two factual claims verified in real sources

### Claim 1: Testing cannot prove software is free of defects

**Where it appears:** B3, section 2 (Testing, code review, and security).

**Source:** ASTQB, *ISTQB Foundation Level – Seven Testing Principles*, Principle 1. [https://astqb.org/istqb-foundation-level-seven-testing-principles/](https://astqb.org/istqb-foundation-level-seven-testing-principles/)

**What I checked:** Principle 1 says testing can show defects are present but cannot prove there are none. It says testing lowers the chance of undiscovered defects but is not proof of correctness even when no defects are found. This matches B3's wording.

**Limits of the source:**

- The page says the principles come directly from the ISTQB Foundation Level syllabus. It is ASTQB's exam-preparation page, not the syllabus itself, and it does not name the syllabus version.
- No author is shown. The page metadata gives a last-modified date of 10 June 2026, which is not necessarily a publication date.
- The page supports the general principle only. It says nothing about booking systems or concurrency.

**Decision:** The claim is supported by the ASTQB page; the exact syllabus version remains unconfirmed.

### Claim 2: Configuration and credentials should be kept separate from source code

**Where it appears:** B3, section 4 (Deployment and configuration).

**Source:** Wiggins, A., *The Twelve-Factor App, III. Config*. [https://12factor.net/config](https://12factor.net/config)

**What I checked:** The page defines config as anything likely to vary between deploys, including database resource handles and credentials for external services. It says twelve-factor requires strict separation of config from code. It offers a test: could the codebase be made open source at any moment without exposing credentials? This matches B3's wording.

**Limits of the source:**

- The page's recommended method is environment variables. It says config files kept out of version control are a big improvement over constants in code but have weaknesses. So B3's claim holds, but the page prefers one specific approach.
- The page names Adam Wiggins as author and shows a last-updated year of 2017, which resolves the "author not shown" caveat from my earlier notes.
- The page mentions staging only as an example of a deploy environment. It does not say a team should test releases in staging, so B3's staging advice needs a different source or must stay labelled as your own recommendation.
- It is a methodology, not a formal standard.

**Decision:** The config-separation claim is supported. The staging, backup, and rollback advice is not verified by this source.

### References

ASTQB. (n.d.). *ISTQB Foundation Level – Seven Testing Principles*. https://astqb.org/istqb-foundation-level-seven-testing-principles/

Canonical. (n.d.). *Diátaxis, a new foundation for Canonical documentation*. https://canonical.com/blog/diataxis-a-new-foundation-for-canonical-documentation

Django Software Foundation. (n.d.). *PostgreSQL specific database constraints*. Django documentation. https://docs.djangoproject.com/en/stable/ref/contrib/postgres/constraints/

Google. (n.d.). *The standard of code review*. Engineering Practices. https://github.com/google/eng-practices/blob/master/review/index.md

Google. (2016). *Monitoring distributed systems*. In *Site Reliability Engineering*. O’Reilly Media. https://sre.google/sre-book/monitoring-distributed-systems/

IEEE Computer Society. (n.d.). *Chapter 5: Software maintenance*. SWEBOK Wiki mirror. https://swebokwiki.org/Chapter_5:_Software_Maintenance

Wiggins, A. (2017). *III. Config*. The Twelve-Factor App. https://12factor.net/config

*Note:* These entries are based on the supplied source notes. Confirm author/date metadata and the required APA formatting against the original pages before submission; the ASTQB page is not itself the official ISTQB syllabus.

## 7. Appendix A — Initial outline

1. **Understand customer needs:** Identify user requirements, define the system's scope, and agree on acceptance criteria with the university.
2. **Prepare delivery documentation:** Create requirements, a system design, setup instructions, a user guide, and deployment documentation so that others can understand, install, and use the system.
3. **Implement and test the software:** Develop booking and cancellation features. Test overlapping bookings, blocked rooms, invalid booking times, and permissions for students and administrators.
4. **Deploy and verify the system:** Configure the server, database, environment variables, and access permissions. Run smoke tests after deployment to confirm that the main features work correctly.
5. **Provide support and maintenance:** Monitor errors, back up booking data, fix reported bugs, document known issues, and provide a process for users to request help.

## 8. Appendix B — AI exchanges

### B1 — Draft (Prompt A)

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 2026-10-10
- **Purpose:** Contextual draft

**Prompt:**

```
Act as a software engineering tutor. Help me analyze topic 1. Professional software delivery for a first-year-level university assignment.
My scenario is Students who want to find and book available study rooms, administrators who manage rooms and review bookings, and developers and testers who build and maintain the system. Students need a convenient way to find available study rooms and book them without conflicts. Administrators need to manage room availability and prevent bookings in blocked rooms. The system must prevent overlapping active bookings for the same room. Fictional assumption: The development team has four weeks to develop, test, document, and deploy the initial version. The main risk is that the system incorrectly confirms two overlapping bookings, causing students to arrive at the same room at the same time, creating conflicts and reducing trust in the system. My initial ideas are (1) clear requirements and planning, (2) automated testing and code review, (3) technical documentation, (4) controlled deployment and configuration, and (5) monitoring, maintenance, and user support. Draft a 400–500 word explanation using these details.
Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```
Topic 1: Professional Software Delivery

1. Introduction

Professional software delivery involves more than writing program code. A software team must understand user needs, plan development, verify software quality, prepare documentation, deploy the system, and provide support after release. These activities help ensure that software is reliable, understandable, and maintainable.

In the study-room booking system, students need to find available rooms and make bookings without conflicts. Administrators need to manage room availability, block rooms when necessary, and review bookings. Developers and testers are responsible for building and checking the system.

2. Requirements and Planning

The first step is to define clear requirements and plan the work. For example, the system must prevent overlapping active bookings for the same room and reject bookings for blocked rooms. The team should also define booking rules, such as valid start times and booking durations.

Planning helps the team prioritise important features and allocate time for development, testing, documentation, and deployment. However, detailed planning takes time and cannot eliminate every unexpected problem. The team should therefore focus first on essential requirements and adjust the plan when necessary.

Assumption: The initial version must be developed, tested, documented, and deployed within four weeks. This is a fictional deadline, not a verified project fact.

3. Testing and Code Review

Automated testing and code review are important for preventing defects. Unit tests can check individual booking rules, while integration tests can verify how the booking logic interacts with the database. For example, tests should confirm that two active bookings for the same room cannot overlap. They should also check that bookings for different rooms or non-overlapping time periods are allowed.

Code reviews allow team members to identify mistakes and improve readability before changes are merged. However, passing tests does not prove that the system is completely reliable. The team must design tests around realistic situations, including simultaneous booking requests, because two students might attempt to reserve the same room at nearly the same time.

4. Technical Documentation

Documentation should explain how the system works, how to configure and run it, and how its main components interact. It should also describe booking rules, database requirements, and common troubleshooting procedures. This information helps developers maintain the application and assists administrators with routine tasks.

Documentation requires additional effort and can become outdated. To reduce this risk, the team should update it when important requirements, interfaces, or deployment procedures change.

5. Controlled Deployment and Configuration

Before release, the team should test the application in an environment similar to production. Configuration values, database connections, permissions, and required dependencies must be checked. A controlled deployment, supported by a backup and rollback plan, can reduce the impact of release failures.

The trade-off is that these precautions require time and infrastructure. Within the assumed four-week deadline, the team should prioritise essential deployment checks rather than attempting to build an unnecessarily complex release process.

6. Monitoring, Maintenance, and Support

After deployment, monitoring can help identify errors, failed booking requests, and performance problems. User support provides a way for students and administrators to report issues. The team can then investigate incidents, fix defects, and release updates.

These activities require ongoing resources, but ignoring them may allow serious problems to remain undetected.

7. Conclusion

Professional software delivery combines planning, testing, documentation, deployment, and ongoing support. For this system, preventing conflicting bookings is the main quality priority because failures could create room conflicts and reduce user trust. The team should balance delivery speed with sufficient verification and operational safeguards.
```

### B2 — Critique (Prompt B)

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 2026-10-10
- **Purpose:** the draft establishes the scenario and main risk effectively, but it needs clearer evaluation criteria to encourage specific, technically justified reasoning

**Prompt:**

```
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: What does a software team need to deliver a reliable room-booking system beyond the program code, and how should the team verify, document, deploy, and support it?
Scenario: Students want to find and book available study rooms. Administrators manage room availability and review bookings. Developers and testers build and maintain the system. Students need a convenient way to find available rooms and book them without conflicts. Administrators need to manage room availability and prevent bookings in blocked rooms. The system must prevent overlapping active bookings for the same room. Fictional assumption: The team has four weeks to develop, test, document, and deploy the initial version. The main risk is that the system incorrectly confirms two overlapping bookings for the same room, causing students to arrive at the same time and reducing trust in the system. Fictional assumptions: The university has 20 study rooms; users access the system through a web browser; students log in using university accounts; the initial version supports creating and cancelling bookings but excludes online payments and mobile applications; the university provides a server and assigns an administrator to manage room availability.

Draft:

Topic 1: Professional Software Delivery

1. Introduction

Professional software delivery involves more than writing program code. A software team must understand user needs, plan development, verify software quality, prepare documentation, deploy the system, and provide support after release. These activities help ensure that software is reliable, understandable, and maintainable.

In the study-room booking system, students need to find available rooms and make bookings without conflicts. Administrators need to manage room availability, block rooms when necessary, and review bookings. Developers and testers are responsible for building and checking the system.

2. Requirements and Planning

The first step is to define clear requirements and plan the work. For example, the system must prevent overlapping active bookings for the same room and reject bookings for blocked rooms. The team should also define booking rules, such as valid start times and booking durations.

Planning helps the team prioritise important features and allocate time for development, testing, documentation, and deployment. However, detailed planning takes time and cannot eliminate every unexpected problem. The team should therefore focus first on essential requirements and adjust the plan when necessary.

Assumption: The initial version must be developed, tested, documented, and deployed within four weeks. This is a fictional deadline, not a verified project fact.

3. Testing and Code Review

Automated testing and code review are important for preventing defects. Unit tests can check individual booking rules, while integration tests can verify how the booking logic interacts with the database. For example, tests should confirm that two active bookings for the same room cannot overlap. They should also check that bookings for different rooms or non-overlapping time periods are allowed.

Code reviews allow team members to identify mistakes and improve readability before changes are merged. However, passing tests does not prove that the system is completely reliable. The team must design tests around realistic situations, including simultaneous booking requests, because two students might attempt to reserve the same room at nearly the same time.

4. Technical Documentation

Documentation should explain how the system works, how to configure and run it, and how its main components interact. It should also describe booking rules, database requirements, and common troubleshooting procedures. This information helps developers maintain the application and assists administrators with routine tasks.

Documentation requires additional effort and can become outdated. To reduce this risk, the team should update it when important requirements, interfaces, or deployment procedures change.

5. Controlled Deployment and Configuration

Before release, the team should test the application in an environment similar to production. Configuration values, database connections, permissions, and required dependencies must be checked. A controlled deployment, supported by a backup and rollback plan, can reduce the impact of release failures.

The trade-off is that these precautions require time and infrastructure. Within the assumed four-week deadline, the team should prioritise essential deployment checks rather than attempting to build an unnecessarily complex release process.

6. Monitoring, Maintenance, and Support

After deployment, monitoring can help identify errors, failed booking requests, and performance problems. User support provides a way for students and administrators to report issues. The team can then investigate incidents, fix defects, and release updates.

These activities require ongoing resources, but ignoring them may allow serious problems to remain undetected.

7. Conclusion

Professional software delivery combines planning, testing, documentation, deployment, and ongoing support. For this system, preventing conflicting bookings is the main quality priority because failures could create room conflicts and reduce user trust. The team should balance delivery speed with sufficient verification and operational safeguards.
```

**Response:**

```
Corrected critique of B1 (the original B2 run, which reviewed Prompt A instead of B1, is described in sections 3 and 5):

B1 is relevant to the scenario and covers requirements, testing, documentation, deployment, and support. However, it needs more precise reasoning and clearer evidence before it can fully answer the question.

1. **The overlap rule is not defined.** B1 says the system must prevent overlapping bookings but does not define interval boundaries. I should check and state whether a booking ending at 11:00 can be followed by one starting at 11:00. This matters because tests need an unambiguous expected result. An alternative is to disallow touching bookings, but stakeholders must choose the rule.
2. **Concurrency is raised but not explained.** B1 recommends testing simultaneous requests, but does not explain how the implementation prevents both requests from being confirmed. I should check the selected database’s official documentation and test the actual implementation. A normal sequential test may pass while a simultaneous-request case fails.
3. **Permissions are missing.** The scenario includes students and administrators, but B1 does not say that students may cancel only their own bookings or that room blocking is restricted to administrators. I should add these as requirements if they are in scope and test unauthorized actions. A university login service may authenticate users without enforcing application-specific permissions.
4. **The requested verification list is missing.** Prompt A asked for claims to verify, but B1 does not clearly identify them. I should list unresolved claims, especially database concurrency behaviour and whether the four-week schedule is feasible. The deadline is a fictional assumption, not evidence of feasibility.
5. **Deployment advice is unsupported.** Staging, backups, and rollback are recommended without sources. These may be sensible practices, but I should label them as recommendations or find suitable evidence. A small project may use a simpler controlled release process if resources are limited.
6. **Documentation and maintenance are general.** B1 explains why they matter but could identify the minimum deliverables and intended users more concretely. A concise setup guide and user/admin instructions may be more proportionate than extensive documents.

The main revision priority is to connect the booking-conflict risk to explicit requirements, implementation choices, and tests. Testing and code review reduce risk but do not prove that no defects remain. The revised answer should distinguish sourced claims, scenario assumptions, and my recommendations, and should not claim that a particular database mechanism is sufficient until verified.
```

### B3 — Revision (Prompt C)

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 2026-10-10
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions:
- I will not treat the original B2 critique as a valid review of B1 because I pasted Prompt A into its Draft field.
- I will keep the original B2 run as a labelled record and use the corrected critique above for the revision.
- I will define the overlap boundary rule and include tests for overlapping, non-overlapping, blocked-room, cancellation, permission, and simultaneous-request cases.
- I will keep the testing principle and configuration-separation claims because the supplied sources support them.
- I will qualify the PostgreSQL exclusion-constraint example: the supplied Django documentation demonstrates a possible mechanism, but does not prove my implementation is safe under concurrent requests.
- I will label staging, backup, rollback, and monitoring details as recommendations unless I find direct supporting sources.
- I will not claim the four-week schedule is feasible without a project estimate.
- I will check each source locator and complete the required reference list before submission.

Verified evidence: Testing

1. Seven Testing Principles (from the ISTQB Foundation Level Syllabus)

- Organization: ASTQB (a US board of ISTQB), reproducing the ISTQB syllabus. No author or date was shown.
- URL: https://astqb.org/istqb-foundation-level-seven-testing-principles/
- Claim supported: Testing can show that defects exist but cannot prove there are none. Even when no defects are found, that is not proof of correctness. This supports your point that passing tests do not prove the booking system never double-books.
- Caveat: This page quotes the syllabus. For your reference list, cite the ISTQB syllabus itself (the version and year are on istqb.org).

2. The Standard of Code Review / Code Review Developer Guide (google/eng-practices)

- Organization: Google, published on GitHub. No individual author or date was shown.
- URL: https://github.com/google/eng-practices/blob/master/review/index.md
- Claim supported: A code review means someone other than the author examines the code. Google’s guidance says reviews should look at design, functionality, complexity and whether the code has correct, well-designed automated tests.
- Caveat: The repository’s archive date and license came from a secondary article, not from the page, so check them on GitHub if you cite them.

Documentation

3. Diátaxis, a new foundation for Canonical documentation

- Organization: Canonical (Ubuntu). The framework’s creator is Daniele Procida, according to a secondary article I found. The blog page itself shows no author or date.
- URL: https://canonical.com/blog/diataxis-a-new-foundation-for-canonical-documentation
- Claim supported: Diátaxis identifies four types of documentation: tutorials, how-to guides, reference and explanation. Documentation that mixes these modes (for example, a tutorial that digresses into explanation) is confusing. This supports separating setup instructions, a user guide, a reference and design explanations.
- Caveat: Diátaxis is one framework among several, and a four-folder structure is not mandatory. For the primary source, use diataxis.fr, which I did not open.

Deployment and configuration

4. The Twelve-Factor App, III. Config

- Organization or author: The author was not in the retrieved text. I believe it is Adam Wiggins, but confirm that on the site. Version history shows early drafts from 2011.
- URL: https://12factor.net/config
- Claim supported: Config means everything likely to vary between deploys (staging, production, developer environments). It should be kept strictly separate from code, because config varies across deploys and code does not. A useful test is whether the codebase could be made open source without exposing credentials. This supports keeping credentials out of source code.
- Caveat: This is a design methodology, not a standard. It recommends environment variables, and other approaches exist.

5. PostgreSQL specific database constraints (Django documentation)

- Organization: Django Software Foundation.
- URL: https://docs.djangoproject.com/en/stable/ref/contrib/postgres/constraints
- Claim supported: PostgreSQL exclusion constraints are implemented using indexes and require the btree_gist extension. The same page includes an example that restricts overlapping reservations in the same room while ignoring cancelled reservations. This supports enforcing the overlap rule in the database, not only in application code.
- Caveat: This is Django’s documentation, not PostgreSQL’s. It shows that the mechanism exists and fits your scenario, but it does not by itself prove concurrent requests are safe. Verify that in the official PostgreSQL manual (the “Constraints on Ranges” section and the transaction isolation chapter). I did not retrieve those pages.

Maintenance and support

6. Chapter 5: Software Maintenance (SWEBOK wiki)

- Organization: Describes the IEEE Computer Society’s SWEBOK Guide. This wiki page is a mirror of an older version.
- URL: https://swebokwiki.org/Chapter_5:_Software_Maintenance
- Claim supported: Maintenance has three classic categories, corrective, adaptive and perfective, and ISO/IEC/IEEE 14764 adds a fourth, preventive. Corrective maintenance is reactive repair after delivery, and adaptive maintenance keeps the software usable in a changed environment.
- Caveat: Use the official SWEBOK Guide from computer.org for your reference list, since this mirror may not match the current edition.

7. Site Reliability Engineering, Chapter 6: Monitoring Distributed Systems

- Authors: Murphy, Beyer, Jones and Petoff (editors of the book), published April 2016 by O’Reilly. Per a secondary source, the chapter was written by Rob Ewaschuk.
- URL: https://www.oreilly.com/library/view/site-reliability-engineering/9781491929117/ch06.html
- Claims supported: The chapter defines monitoring as collecting and displaying real-time data such as error counts and processing times, and distinguishes white-box monitoring (internal metrics, logs) from black-box monitoring (externally visible behavior as a user would see it). Secondary notes on the same chapter state that the four golden signals are latency, traffic, errors and saturation, and that monitoring should answer what is broken and why.
- Caveat: The O’Reilly preview supports the definitions only. The golden-signals claim comes from a secondary summary, so read the primary chapter (the book’s free version is on sre.google) before citing it. Also, these signals suit large services, and a 20-room system may need only basic logs.

Gaps to close yourself

- No source I retrieved covers concurrency testing specifically. Search the PostgreSQL docs on transaction isolation, or a testing text, to support that claim.
- None of these sources supports “four weeks is enough” or “backups were restored successfully”. Those remain scenario assumptions or things you must test.
- I found no publication dates for several pages. Write “n.d.” (no date) and add your access date, 2026-10-10.

Draft:

Professional Software Delivery

Professional software delivery involves more than writing program code. A software team must understand user needs, plan development, verify software quality, prepare documentation, deploy the system, and provide support after release. These activities help ensure that software is reliable, understandable, and maintainable.

In the study-room booking system, students need to find available rooms and make bookings without conflicts. Administrators need to manage room availability, block rooms when necessary, and review bookings. Developers and testers are responsible for building and checking the system.

Requirements and Planning

The first step is to define clear requirements and plan the work. For example, the system must prevent overlapping active bookings for the same room and reject bookings for blocked rooms. The team should also define booking rules, such as valid start times and booking durations.

Planning helps the team prioritise important features and allocate time for development, testing, documentation, and deployment. However, detailed planning takes time and cannot eliminate every unexpected problem. The team should therefore focus first on essential requirements and adjust the plan when necessary.

Assumption: The initial version must be developed, tested, documented, and deployed within four weeks. This is a fictional deadline, not a verified project fact.

Testing and Code Review

Automated testing and code review are important for preventing defects. Unit tests can check individual booking rules, while integration tests can verify how the booking logic interacts with the database. For example, tests should confirm that two active bookings for the same room cannot overlap. They should also check that bookings for different rooms or non-overlapping time periods are allowed.

Code reviews allow team members to identify mistakes and improve readability before changes are merged. However, passing tests does not prove that the system is completely reliable. The team must design tests around realistic situations, including simultaneous booking requests, because two students might attempt to reserve the same room at nearly the same time.

Technical Documentation

Documentation should explain how the system works, how to configure and run it, and how its main components interact. It should also describe booking rules, database requirements, and common troubleshooting procedures. This information helps developers maintain the application and assists administrators with routine tasks.

Documentation requires additional effort and can become outdated. To reduce this risk, the team should update it when important requirements, interfaces, or deployment procedures change.

Controlled Deployment and Configuration

Before release, the team should test the application in an environment similar to production. Configuration values, database connections, permissions, and required dependencies must be checked. A controlled deployment, supported by a backup and rollback plan, can reduce the impact of release failures.

The trade-off is that these precautions require time and infrastructure. Within the assumed four-week deadline, the team should prioritise essential deployment checks rather than attempting to build an unnecessarily complex release process.

Monitoring, Maintenance, and Support

After deployment, monitoring can help identify errors, failed booking requests, and performance problems. User support provides a way for students and administrators to report issues. The team can then investigate incidents, fix defects, and release updates.

These activities require ongoing resources, but ignoring them may allow serious problems to remain undetected.

Conclusion

Professional software delivery combines planning, testing, documentation, deployment, and ongoing support. For this system, preventing conflicting bookings is the main quality priority because failures could create room conflicts and reduce user trust. The team should balance delivery speed with sufficient verification and operational safeguards.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```
The main revision is to turn the original outline into a focused 400–500 word explanation of professional software delivery, using the room-booking system throughout. I’ll distinguish scenario facts from fictional assumptions, explain the important trade-offs, and identify claims that still need verification. I’ll use only the sources you supplied and won’t present unverified technical details as proven facts.

Revised draft — Professional software delivery

Professional Software Delivery: A Study Room Booking System

Professional software delivery involves more than writing code. A reliable system also needs clear requirements, testing, documentation, controlled deployment, security, and ongoing support. In this scenario, students need to find and book available study rooms, while administrators manage room availability and review bookings.

1. Requirements and planning

The team should define the booking rules before implementation. A booking must start in the future, have a valid duration, and use a room that is not blocked. Two active bookings for the same room must not overlap. The team should also define whether bookings are allowed to touch at their boundaries: for example, 10:00–11:00 followed by 11:00–12:00 should be allowed if the end time is exclusive. Clear requirements reduce misunderstandings, although detailed planning takes time away from implementation.

2. Testing, code review, and security

Automated tests should check normal bookings, invalid times, blocked rooms, cancellations, and overlapping bookings. Tests should also simulate simultaneous requests for the same room. Application-level checks alone may be insufficient when requests arrive concurrently. A suitable database mechanism, such as a PostgreSQL exclusion constraint, can help enforce the no-overlap rule, while transactions protect the consistency of related operations. The exact implementation must be verified against the chosen database design. ISTQB’s testing principles explain that testing can reveal defects but cannot prove that none remain. Independent code review can help identify design problems and weaknesses in automated tests (ISTQB; Google, Code Review Developer Guide).

Security is equally important: students should be allowed to cancel only their own bookings, while room-blocking and administrative review should require administrator permissions. These permissions need explicit tests.

3. Documentation

Documentation should explain how to install and configure the application, how students book or cancel rooms, and how administrators manage availability. Developers also need information about the database structure and deployment process. Diátaxis offers four documentation categories: tutorials, how-to guides, reference, and explanation. These categories can improve clarity without requiring four separate documents.

4. Deployment and configuration

The team should test the release in a staging environment before deploying it to production. Configuration and credentials should be kept separate from source code, following the Twelve-Factor App guidance. A backup and rollback procedure can reduce recovery time if deployment fails, but the team must test restoration rather than assume a backup works.

5. Monitoring and maintenance

After release, the team should monitor failed bookings, application errors, and response times, and provide a way for users to report problems. Logs should help developers investigate booking conflicts without unnecessarily exposing personal information. Maintenance includes correcting defects and adapting the system when requirements or its operating environment change (SWEBOK, Software Maintenance).

Overall, professional delivery combines preventive measures with verification and recovery. No single test, review, or database mechanism guarantees perfect reliability; the team must evaluate evidence and continue improving the system after deployment.

Assumptions

- The four-week deadline is fictional and does not establish that the system can be completed within that time.
- The database is assumed to be PostgreSQL for the exclusion-constraint example. If another database is chosen, the implementation may differ.
- A staging environment, backup process, and rollback procedure are proposed practices, not confirmed existing resources.
- The rules about future start times, duration, cancellation ownership, and administrator permissions must be accepted as requirements by the project stakeholders.

What changed and why

- Reduced the explanation to a focused structure: addresses the original 400–500-word limit.
- Added explicit booking rules and the boundary example: makes the definition of overlapping bookings testable.
- Explained concurrent requests and database enforcement: addresses the central risk instead of merely saying to test simultaneous requests.
- Added student and administrator permissions: covers security and authorization requirements missing from B1.
- Separated proposed practices from confirmed facts: prevents fictional infrastructure and deadlines from being presented as established facts.
- Added backup restoration and rollback verification: a backup is not useful evidence of recoverability until restoration has been tested.
- Added a monitoring and maintenance explanation: connects delivery to the work required after release.
- Removed unsupported claims about feasibility: the supplied evidence does not establish that four weeks is enough.

Claims to verify before submission

1. Database correctness: Consult the official PostgreSQL documentation on range constraints and transaction isolation. Verify how the proposed constraint handles concurrent inserts, cancelled bookings, and boundary times.
2. Testing evidence: Define a concurrency test plan with a specified number of simultaneous requests, repeated runs, and checks of persisted bookings. No particular number of requests is justified by the supplied sources alone.
3. Testing principles: Identify the exact ISTQB Foundation Level syllabus edition and publication year.
4. Documentation: Consult the primary Diátaxis framework at diataxis.fr.
5. Monitoring: Consult the full chapter on monitoring distributed systems in the Google SRE book (https://sre.google/sre-book/monitoring-distributed-systems/) before making more detailed claims about monitoring signals.
6. Maintenance: Prefer the official SWEBOK Guide from the IEEE Computer Society over the older wiki mirror.

Important remaining limitation: The supplied sources support the general principles, but they do not yet provide verified evidence that a particular implementation will prevent double-booking under concurrency or that the proposed deployment and recovery procedures work. Those conclusions require technical documentation and test results.
```

## 9. Appendix C

### Verification table

| AI claim (B3) | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| Testing can reveal defects but cannot prove that none remain. | ASTQB, *Seven Testing Principles*, **Principle 1** ([source](https://astqb.org/istqb-foundation-level-seven-testing-principles/)), accessed 2026-10-10 | The page says testing can show defects are present but cannot prove there are none; finding no defects is not proof of correctness. | `keep` |
| Code review can check design, functionality, complexity, and automated tests. | Google, *The Standard of Code Review*, **“What to look for in a code review”** ([source](https://github.com/google/eng-practices/blob/master/review/index.md)), accessed 2026-10-10 | Google's guide recommends checking design, functionality, complexity, and whether tests are correct and well designed. | `keep` |
| A PostgreSQL exclusion constraint can help enforce the no-overlap rule. | Django documentation, *PostgreSQL specific database constraints*, **ExclusionConstraint example** ([source](https://docs.djangoproject.com/en/stable/ref/contrib/postgres/constraints/)), accessed 2026-10-10 | The example restricts overlapping reservations in the same room and can exclude cancelled reservations. The page also notes the `btree_gist` extension. | `qualify` |
| Diátaxis distinguishes tutorials, how-to guides, reference, and explanation. | Canonical, *Diátaxis, a new foundation for Canonical documentation*, **four documentation types** ([source](https://canonical.com/blog/diataxis-a-new-foundation-for-canonical-documentation)), accessed 2026-10-10 | The page describes the four types and warns that mixing modes can confuse readers. | `keep` |
| Configuration should be kept separate from code. | Twelve-Factor App, **III. Config** ([source](https://12factor.net/config)), accessed 2026-10-10 | The section says configuration that varies between deploys should be strictly separated from code. | `keep` |
| Maintenance includes correcting defects and adapting to a changed environment. | SWEBOK wiki mirror, **Chapter 5: Software Maintenance — corrective and adaptive maintenance** ([source](https://swebokwiki.org/Chapter_5:_Software_Maintenance)), accessed 2026-10-10 | The page describes corrective maintenance as repair after delivery and adaptive maintenance as changes needed for a changed environment. It is an older mirror, so the official current guide remains preferable. | `qualify` |
| Monitoring can include real-time error counts and processing times. | Google SRE book, **Chapter 6: Monitoring Distributed Systems — Introduction** ([source](https://sre.google/sre-book/monitoring-distributed-systems/)), accessed 2026-10-10 | The chapter introduces monitoring through real-time data such as errors and processing times. Applying these measures to failed bookings is my recommendation for this scenario. | `qualify` |

### Change log

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| B3: "Independent code review can help identify design problems and weaknesses in automated tests (ISTQB; Google, Code Review Developer Guide)." | "Google’s review guide recommends checking design, functionality, and automated tests (Google, n.d.)." ISTQB is cited only for the limits of testing. | The ISTQB testing principle says nothing about what a code review should examine, so the code-review claim needed Google’s guide as its source. |
| B3: "A suitable database mechanism, such as a PostgreSQL exclusion constraint, can help enforce the no-overlap rule, while transactions protect the consistency of related operations." | "This is a possible database-level approach, not proof that this implementation handles concurrent requests safely; it also ties the design to PostgreSQL." | The Django documentation only shows that the mechanism exists. It does not prove safety under simultaneous requests, so the claim is qualified and must be checked against the chosen database. |
| B3: "The team should test the release in a staging environment before deploying it to production." | "Production-like testing, backups, rollback, and restoration checks are my recommendations, not claims established by that source." | The Twelve-Factor page mentions staging only as an example of a deploy environment, so these practices are labelled as my own recommendations instead of sourced facts. |
