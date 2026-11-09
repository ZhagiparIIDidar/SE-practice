import { describe, expect, test } from 'vitest';
import { canBook } from './booking';

type Input = Parameters<typeof canBook>[0];

const makeInput = (): Input => ({
    start: 0,
    end: 0,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
});

const check = (start: number, end: number, extra: Partial<Input> = {}) =>
    canBook({ ...makeInput(), start, end, ...extra });

describe('canBook', () => {
    test('T01 AC4: 660-720 touches the booking end, allowed', () => {
        expect(check(660, 720)).toBe(true);
    });
    test('T02 AC1: 540-570 starts exactly now, rejected', () => {
        expect(check(540, 570)).toBe(false);
    });
    test('T03 AC1: 720-720 zero duration, rejected', () => {
        expect(check(720, 720)).toBe(false);
    });
    test('T04 AC1: 750-720 reversed, rejected', () => {
        expect(check(750, 720)).toBe(false);
    });
    test('T05 AC1: 1380-1441 past day end, rejected', () => {
        expect(check(1380, 1441)).toBe(false);
    });
    test('T06 AC2: 720-840 exactly 120 minutes, allowed', () => {
        expect(check(720, 840)).toBe(true);
    });
    test('T07 AC2: 720-841 is 121 minutes, rejected', () => {
        expect(check(720, 841)).toBe(false);
    });
    test('T08 AC4: 570-600 touches the booking start, allowed', () => {
        expect(check(570, 600)).toBe(true);
    });
    test('T09 AC4: 630-690 partial overlap, rejected', () => {
        expect(check(630, 690)).toBe(false);
    });
    test('T10 AC4: 570-690 contains the booking, rejected', () => {
        expect(check(570, 690)).toBe(false);
    });
    test('T11 AC4: 615-645 inside the booking, rejected', () => {
        expect(check(615, 645)).toBe(false);
    });
    test('T12 AC4: 600-660 identical to the booking, rejected', () => {
        expect(check(600, 660)).toBe(false);
    });
    test('T13 AC3: 660-720 in a blocked room, rejected', () => {
        expect(check(660, 720, { blocked: true })).toBe(false);
    });
    test('T14 AC4: 630-690 with no bookings, allowed', () => {
        expect(check(630, 690, { bookings: [] })).toBe(true);
    });
    test('X1 AC1 AC2: 1320-1440 ends exactly at 24:00, allowed', () => {
        expect(check(1320, 1440)).toBe(true);
    });
    test('X2 AC4: 660-720 between two bookings touches both, allowed', () => {
        const bookings = [{ start: 600, end: 660 }, { start: 720, end: 780 }];
        expect(check(660, 720, { bookings })).toBe(true);
    });
    test('AC5: an Available request leaves two bookings in reverse order unchanged', () => {
        const bookings = [{ start: 720, end: 780 }, { start: 600, end: 660 }];
        const snapshot = structuredClone(bookings);
        expect(check(660, 720, { bookings })).toBe(true);
        expect(bookings).toEqual(snapshot);
    });
    test('B01 AC1: 541-600 starts one minute after now, allowed', () => {
        expect(check(541, 600)).toBe(true);
    });
    test('B02 AC1: -30-30 starts before 00:00 (now = -100), rejected', () => {
        expect(check(-30, 30, { now: -100 })).toBe(false);
    });
    test('B03 AC3: 630-690 in a blocked room with no bookings, rejected', () => {
        expect(check(630, 690, { blocked: true, bookings: [] })).toBe(false);
    });
    test('B04 AC1: NaN start, rejected', () => {
        expect(check(NaN, 720)).toBe(false);
    });
    test('B05 AC1: NaN end, rejected', () => {
        expect(check(660, NaN)).toBe(false);
    });
    test('B06 AC1 AC2: 700-701 one-minute slot, allowed', () => {
        expect(check(700, 701)).toBe(true);
    });
    test('B07 AC4: 750-810 overlaps only the second of two bookings, rejected', () => {
        const bookings = [{ start: 600, end: 660 }, { start: 720, end: 780 }];
        expect(check(750, 810, { bookings })).toBe(false);
    });
    test('B08 AC4: 541-601 overlaps the booking start by one minute, rejected', () => {
        expect(check(541, 601)).toBe(false);
    });
    test('B09 AC4: 659-719 overlaps the booking end by one minute, rejected', () => {
        expect(check(659, 719)).toBe(false);
    });
    test('B10 AC4: 630-690 overlaps a booking listed second, rejected', () => {
        const bookings = [{ start: 720, end: 780 }, { start: 600, end: 660 }];
        expect(check(630, 690, { bookings })).toBe(false);
    });
    test('B11 AC1: 660-720 with now = 700 starts in the past, rejected', () => {
        expect(check(660, 720, { now: 700 })).toBe(false);
    });
    test('B12 AC5: a rejected request leaves the bookings unchanged', () => {
        const input = { ...makeInput(), start: 630, end: 690 };
        const snapshot = structuredClone(input.bookings);
        expect(canBook(input)).toBe(false);
        expect(input.bookings).toEqual(snapshot);
    });
});

