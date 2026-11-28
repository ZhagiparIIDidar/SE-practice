import { describe, expect, test } from "vitest";
import { checkRoom } from "./booking";
import { filterRooms } from "./filter";
import type { Room } from "./rooms";

const CATALOG: Room[] = [
  {
    id: "room-a",
    name: "Room Alpha",
    building: "North",
    floor: 1,
    capacity: 12,
    type: "Study",
    equipment: ["whiteboard"],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: "room-b",
    name: "Room Beta",
    building: "North",
    floor: 2,
    capacity: 30,
    type: "Seminar",
    equipment: ["projector", "whiteboard"],
    blocked: false,
    bookings: [{ start: 720, end: 780 }],
  },
  {
    id: "room-c",
    name: "Room Gamma",
    building: "South",
    floor: 1,
    capacity: 50,
    type: "Lab",
    equipment: ["projector", "microphone", "lab-bench"],
    blocked: true,
    bookings: [],
  },
  {
    id: "room-d",
    name: "Room Delta",
    building: "South",
    floor: 3,
    capacity: 8,
    type: "Pod",
    equipment: ["tv-screen"],
    blocked: false,
    bookings: [],
  },
];

const NOW = 540; // 09:00

describe("filterRooms — F1, F2, F4, B5, B6", () => {
  test("F1: keeps only rooms whose capacity is at least the requested attendees", () => {
    const result = filterRooms(CATALOG, { attendees: 25, equipment: [] });
    expect(result.map((r) => r.id)).toEqual(["room-b", "room-c"]);
  });

  test("B5: capacity exactly equal to requested attendees keeps the room included", () => {
    const result = filterRooms(CATALOG, { attendees: 12, equipment: [] });
    expect(result.map((r) => r.id)).toContain("room-a");
    expect(result.map((r) => r.id)).toEqual(["room-a", "room-b", "room-c"]);
  });

  test("B6: capacity one below requested attendees excludes the room", () => {
    const result = filterRooms(CATALOG, { attendees: 13, equipment: [] });
    expect(result.map((r) => r.id)).not.toContain("room-a");
    expect(result.map((r) => r.id)).toEqual(["room-b", "room-c"]);
  });

  test("F2: keeps only rooms that contain ALL selected required equipment items", () => {
    const result = filterRooms(CATALOG, {
      attendees: 1,
      equipment: ["projector", "whiteboard"],
    });
    expect(result.map((r) => r.id)).toEqual(["room-b"]);
  });

  test("F4: returns an empty list when no rooms satisfy the criteria", () => {
    const result = filterRooms(CATALOG, {
      attendees: 100,
      equipment: ["whiteboard"],
    });
    expect(result).toEqual([]);
  });
});

describe("checkRoom — F3, F5, AC2, AC3, B1–B4, INT", () => {
  test("F3 AC3: rejects a blocked room as unavailable even with no bookings", () => {
    const before = structuredClone(CATALOG);
    expect(
      checkRoom(CATALOG, "room-c", { start: 600, end: 660, now: NOW }),
    ).toBe(false);
    expect(CATALOG).toEqual(before);
  });

  test("F5: changing the selected room evaluates the chosen room's own bookings for the same times", () => {
    const request = { start: 600, end: 660, now: NOW };
    expect(checkRoom(CATALOG, "room-a", request)).toBe(false);
    expect(checkRoom(CATALOG, "room-b", request)).toBe(true);
  });

  test("F5: returns false when the room ID is unknown", () => {
    expect(
      checkRoom(CATALOG, "missing-room", { start: 600, end: 660, now: NOW }),
    ).toBe(false);
  });

  test("B1 AC2: exactly 120 minutes (720-840) on an open room is available", () => {
    expect(
      checkRoom(CATALOG, "room-a", { start: 720, end: 840, now: NOW }),
    ).toBe(true);
  });

  test("B2 AC2: 121 minutes (720-841) is rejected", () => {
    expect(
      checkRoom(CATALOG, "room-a", { start: 720, end: 841, now: NOW }),
    ).toBe(false);
  });

  test("B3 AC4: touching an existing booking at endpoint (660-720) is available", () => {
    expect(
      checkRoom(CATALOG, "room-a", { start: 660, end: 720, now: NOW }),
    ).toBe(true);
  });

  test("B4 AC4: overlapping an existing booking (630-690) is rejected", () => {
    expect(
      checkRoom(CATALOG, "room-a", { start: 630, end: 690, now: NOW }),
    ).toBe(false);
  });

  test("INT: filtering rooms and then checking the selected room uses that room's bookings without mutating data", () => {
    const snapshot = structuredClone(CATALOG);
    const matching = filterRooms(CATALOG, {
      attendees: 20,
      equipment: ["projector"],
    });
    expect(matching.map((r) => r.id)).toEqual(["room-b", "room-c"]);

    const slot = { start: 720, end: 780, now: NOW };
    expect(checkRoom(matching, "room-b", slot)).toBe(false); // overlaps 720-780
    expect(checkRoom(matching, "room-c", slot)).toBe(false); // blocked
    expect(checkRoom(matching, "room-b", { start: 780, end: 840, now: NOW })).toBe(true); // touching 780
    expect(CATALOG).toEqual(snapshot);
  });
});
