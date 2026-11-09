/**
 * Smart Campus - room availability: booking rules + data preservation
 *
 * Place next to the source file:  src/booking.test.ts
 * Run:                            npx vitest run src/booking.test.ts
 *
 * Oracle: every expected value comes from AC1-AC5 and the reviewed case table,
 * never from reading src/booking.ts. The limits (120 minutes, 1440) are written
 * as literals on purpose, so a wrong constant in src/types.ts fails these tests.
 *
 * AC mapping
 *   AC1 -> T02 T03 T04 T05 X1
 *   AC2 -> T06 T07 X1
 *   AC3 -> T13
 *   AC4 -> T01 T08 T09 T10 T11 T12 T14 X2
 *   AC5 -> data-preservation test at the bottom (the visible Available /
 *          Unavailable label is a page check, done manually)
 *   AC6 -> not automated; check the page at desktop and narrow width by hand
 */
import { describe, expect, it } from "vitest";
import { canBook, type CanBookInput, type TimeRange } from "./booking.ts";

// ---------------------------------------------------------------------------
// Fixed time + default fixture (from the case table header)
// ---------------------------------------------------------------------------

// "now" is passed into every call and canBook never reads the clock,
// so a constant is all the fixed time these tests need. 540 = 09:00.
const NOW = 540;

const DEFAULT_BOOKINGS: readonly TimeRange[] = [{ start: 600, end: 660 }];

interface Overrides {
    blocked?: boolean;
    bookings?: readonly TimeRange[];
}

// Builds a brand-new input for every call: the bookings are copied into new
// objects, so no test can see or affect another test's data.
function makeInput(start: number, end: number, overrides: Overrides = {}): CanBookInput {
    const source = overrides.bookings ?? DEFAULT_BOOKINGS;
    return {
        start,
        end,
        now: NOW,
        blocked: overrides.blocked ?? false,
        bookings: source.map((b) => ({ ...b })),
    };
}

// ---------------------------------------------------------------------------
// Reviewed case table (T01-T14, X1, X2)
// ---------------------------------------------------------------------------

interface Case {
    id: string;
    label: string;
    start: number;
    end: number;
    overrides?: Overrides;
    expected: boolean;
    ac: string;
    why: string; // short form of the reviewed reason; shown if the assertion fails
}

const cases: Case[] = [
    {
        id: "T01",
        label: "660-720 (touching after)",
        start: 660,
        end: 720,
        expected: true,
        ac: "AC4",
        why: "booking ends at 660, slot starts at 660: they only touch, no shared minutes",
    },
    {
        id: "T02",
        label: "540-570 (starts now)",
        start: 540,
        end: 570,
        expected: false,
        ac: "AC1",
        why: "start must be strictly later than now (540)",
    },
    {
        id: "T03",
        label: "720-720 (zero duration)",
        start: 720,
        end: 720,
        expected: false,
        ac: "AC1",
        why: "start equals end, so the duration is 0 and the slot is invalid",
    },
    {
        id: "T04",
        label: "750-720 (reversed)",
        start: 750,
        end: 720,
        expected: false,
        ac: "AC1",
        why: "end is earlier than start, so the interval is reversed",
    },
    {
        id: "T05",
        label: "1380-1441 (past day end)",
        start: 1380,
        end: 1441,
        expected: false,
        ac: "AC1",
        why: "end 1441 is beyond 1440 (24:00), so the slot runs into the next day",
    },
    {
        id: "T06",
        label: "720-840 (120 minutes)",
        start: 720,
        end: 840,
        expected: true,
        ac: "AC2",
        why: "exactly 120 minutes; only durations greater than 120 are rejected",
    },
    {
        id: "T07",
        label: "720-841 (121 minutes)",
        start: 720,
        end: 841,
        expected: false,
        ac: "AC2",
        why: "121 minutes is one minute over the limit",
    },
    {
        id: "T08",
        label: "570-600 (touching before)",
        start: 570,
        end: 600,
        expected: true,
        ac: "AC4",
        why: "slot ends at 600 where the booking starts: they only touch, no overlap",
    },
    {
        id: "T09",
        label: "630-690 (partial overlap)",
        start: 630,
        end: 690,
        expected: false,
        ac: "AC4",
        why: "overlaps the existing booking for 30 minutes (630-660)",
    },
    {
        id: "T10",
        label: "570-690 (contains booking)",
        start: 570,
        end: 690,
        expected: false,
        ac: "AC4",
        why: "the existing booking sits entirely inside the slot",
    },
    {
        id: "T11",
        label: "615-645 (inside booking)",
        start: 615,
        end: 645,
        expected: false,
        ac: "AC4",
        why: "the slot sits entirely inside the existing booking",
    },
    {
        id: "T12",
        label: "600-660 (identical interval)",
        start: 600,
        end: 660,
        expected: false,
        ac: "AC4",
        why: "identical to the existing booking, so they fully overlap",
    },
    {
        id: "T13",
        label: "660-720, blocked = true",
        start: 660,
        end: 720,
        overrides: { blocked: true },
        expected: false,
        ac: "AC3",
        why: "the room is blocked; time and duration being valid does not matter",
    },
    {
        id: "T14",
        label: "630-690, bookings = []",
        start: 630,
        end: 690,
        overrides: { bookings: [] },
        expected: true,
        ac: "AC4",
        why: "no existing bookings, so there is nothing to overlap with",
    },
    {
        id: "X1",
        label: "1320-1440 (ends exactly at day end, 120 min)",
        start: 1320,
        end: 1440,
        expected: true,
        ac: "AC1, AC2",
        why: "end 1440 is allowed (only > 1440 is rejected) and 120 minutes is allowed",
    },
    {
        id: "X2",
        label: "660-720 between two bookings",
        start: 660,
        end: 720,
        overrides: {
            bookings: [
                { start: 600, end: 660 },
                { start: 720, end: 780 },
            ],
        },
        expected: true,
        ac: "AC4",
        why: "touches both neighbours only at their boundaries, no shared minutes",
    },
];

describe("canBook - reviewed case table", () => {
    it.each(cases)("$id $label -> $expected [$ac]", ({ start, end, overrides, expected, why }) => {
        const input = makeInput(start, end, overrides);
        expect(canBook(input), why).toBe(expected);
    });
});

// ---------------------------------------------------------------------------
// AC5 - the check only reads the booking data
// ---------------------------------------------------------------------------

describe("AC5 - the availability check does not change booking data", () => {
    it("AC5 an Available request returns true and leaves the bookings exactly as they were", () => {
        const input = makeInput(660, 720); // Available: touches the 600-660 booking only
        const snapshot = structuredClone(input);
        const bookingsRef = input.bookings;

        // Freeze the data so any write (push, sort, splice, field assignment)
        // throws and fails the test instead of passing silently.
        Object.freeze(input.bookings);
        input.bookings.forEach((b) => Object.freeze(b));

        expect(canBook(input)).toBe(true);

        expect(input.bookings).toBe(bookingsRef); // same array, not replaced
        expect(input.bookings).toEqual(snapshot.bookings); // same content, same order
        expect(input).toEqual(snapshot); // the request itself is untouched too
    });
});