import { MAX_BOOKING_MINUTES, MINUTES_PER_DAY } from "./types.ts";

export interface TimeRange {
    start: number;
    end: number;
}

export interface CanBookInput {
    start: number; // minutes after midnight
    end: number;
    now: number;
    blocked: boolean;
    bookings: TimeRange[];
}

export function canBook({ start, end, now, blocked, bookings }: CanBookInput): boolean {
    if (Number.isNaN(start) || Number.isNaN(end)) return false; // AC1
    if (start < 0 || end < 0) return false;                     // AC1
    if (!(start < end)) return false;                           // AC1
    if (end > MINUTES_PER_DAY) return false;                    // AC1
    if (start <= now) return false;                             // AC1
    if (end - start > MAX_BOOKING_MINUTES) return false;        // AC2
    if (blocked) return false;                                  // AC3
    return !bookings.some((b) => start < b.end && b.start < end); // AC4
}

const res = canBook({
    start: 660,
    end: 720,
    now: 540,
    blocked: false,
    bookings: [{ start: 700, end: 650 }],
});
console.log(res);

