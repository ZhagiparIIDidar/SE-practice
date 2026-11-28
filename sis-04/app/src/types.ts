import type { Booking, Room } from "./rooms";

export type { Booking, Room };

export type Decision = "available" | "unavailable" | "invalid";

export interface CheckInput {
  room: Room;
  currentTimeMin: number;
  startMin: number;
  endMin: number;
}

export interface CheckResult {
  decision: Decision;
  reason: string;
  /** Conflict details when unavailable due to overlap (AC4). */
  conflict?: Booking;
}
