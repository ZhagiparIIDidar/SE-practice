import type { CheckResult, Room } from "../types";
import { checkRoom, getBookingIssue } from "../booking";
import { fmtTime } from "./time";

export type RoomCheckParams = {
  rooms: readonly Room[];
  roomId: string;
  currentTimeMin: number;
  startMin: number;
  endMin: number;
};

/**
 * UI-facing availability check delegating the boolean decision to checkRoom (F3, F5, AC1-AC5)
 * and formatting a human-readable explanation when rejected. Never mutates room data (AC5).
 */
export function checkAvailability({
  rooms,
  roomId,
  currentTimeMin,
  startMin,
  endMin,
}: RoomCheckParams): CheckResult {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    return {
      decision: "unavailable",
      reason: "No matching room is selected.",
    };
  }

  if (
    checkRoom(rooms, roomId, {
      start: startMin,
      end: endMin,
      now: currentTimeMin,
    })
  ) {
    return {
      decision: "available",
      reason: `Interval ${fmtTime(startMin)}–${fmtTime(endMin)} is available (${endMin - startMin} min).`,
    };
  }

  const issue = getBookingIssue({
    start: startMin,
    end: endMin,
    now: currentTimeMin,
    blocked: room.blocked,
    bookings: room.bookings,
  });

  if (issue?.kind === "interval") {
    return {
      decision: "invalid",
      reason:
        "Enter a valid interval: 0 ≤ start < end ≤ 1440 minutes (00:00–24:00).",
    };
  }
  if (issue?.kind === "past") {
    return {
      decision: "invalid",
      reason: `Start time must be after the current time (${fmtTime(currentTimeMin)}).`,
    };
  }
  if (issue?.kind === "duration") {
    return {
      decision: "unavailable",
      reason: `Requested length is ${endMin - startMin} min, but the maximum is 120 min.`,
    };
  }
  if (issue?.kind === "blocked") {
    return {
      decision: "unavailable",
      reason: "This room is blocked and cannot be booked.",
    };
  }
  if (issue?.kind === "overlap") {
    const { conflict } = issue;
    return {
      decision: "unavailable",
      reason: `Overlaps an existing booking (${fmtTime(conflict.start)}–${fmtTime(conflict.end)}). Touching endpoints are allowed.`,
      conflict,
    };
  }

  return {
    decision: "unavailable",
    reason: "This room is unavailable for the requested interval.",
  };
}
