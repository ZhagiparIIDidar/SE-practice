import type { Room } from "./rooms";

export type RoomFilterCriteria = {
  attendees: number;
  equipment: string[];
};

/**
 * Filter rooms by minimum capacity (F1) and required equipment (F2).
 * Does not mutate the input array or room objects.
 */
export function filterRooms(
  rooms: readonly Room[],
  criteria: RoomFilterCriteria,
): Room[] {
  const minCapacity = Number.isFinite(criteria.attendees)
    ? Math.max(0, criteria.attendees)
    : 0;
  const requiredEquipment = criteria.equipment
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return rooms.filter((room) => {
    if (room.capacity < minCapacity) return false;
    if (requiredEquipment.length === 0) return true;
    const availableEquipment = new Set(
      room.equipment.map((item) => item.trim().toLowerCase()),
    );
    return requiredEquipment.every((item) => availableEquipment.has(item));
  });
}
