import type { Booking, Room } from "./rooms";

export type { Booking };

type BookingInput = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: readonly Booking[];
};

type BookingIssue =
  | { kind: "interval" | "past" | "duration" | "blocked" }
  | { kind: "overlap"; conflict: Booking };

/**
 * Classifies why a booking request is rejected, or returns null when available.
 * Delegates the availability gate to canBook so AC1-AC5 have a single source of truth.
 */
export function getBookingIssue({
  start,
  end,
  now,
  blocked,
  bookings,
}: BookingInput): BookingIssue | null {
  if (canBook({ start, end, now, blocked, bookings })) {
    return null;
  }
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    !(0 <= start && start < end && end <= 1440)
  ) {
    return { kind: "interval" };
  }
  if (!(start > now)) return { kind: "past" };
  if (end - start > 120) return { kind: "duration" };
  if (blocked) return { kind: "blocked" };

  const conflict = bookings.find((b) => start < b.end && end > b.start);
  if (conflict) return { kind: "overlap", conflict };
  return { kind: "interval" };
}

/**
 * Pure booking availability rule implementing AC1-AC5 without mutating bookings.
 */
export function canBook({
  start,
  end,
  now,
  blocked,
  bookings,
}: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: readonly { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}

/**
 * Check availability for a specific room in the catalog using its own blocked flag and bookings (F3, F5).
 * Returns false if roomId is not found. Never mutates catalog or room data (AC5).
 */
export function checkRoom(
  rooms: readonly Room[],
  roomId: string,
  request: { start: number; end: number; now: number },
): boolean {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return false;
  return canBook({
    start: request.start,
    end: request.end,
    now: request.now,
    blocked: room.blocked,
    bookings: room.bookings,
  });
}
