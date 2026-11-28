import type { Room } from "../types";

interface RoomSelectorProps {
  rooms: Room[];
  selectedId: string;
  onSelect: (id: string) => void;
  onResetFilters: () => void;
}

export function RoomSelector({
  rooms,
  selectedId,
  onSelect,
  onResetFilters,
}: RoomSelectorProps) {
  if (rooms.length === 0) {
    return (
      <div className="empty-rooms" role="status" aria-live="polite">
        <p className="empty-rooms-title">No rooms match your requirements</p>
        <p className="empty-rooms-hint">
          Lower the attendee count or uncheck some required equipment.
        </p>
        <button
          type="button"
          className="btn btn-ghost empty-rooms-btn"
          onClick={onResetFilters}
        >
          Reset filters
        </button>
      </div>
    );
  }

  return (
    <div className="room-list" role="listbox" aria-label="Matching rooms">
      {rooms.map((room) => {
        const selected = room.id === selectedId;
        return (
          <button
            key={room.id}
            type="button"
            role="option"
            aria-selected={selected}
            className={`room-card ${selected ? "selected" : ""} ${room.blocked ? "is-blocked" : ""}`}
            onClick={() => onSelect(room.id)}
          >
            <div className="room-card-top">
              <span className="room-card-name">{room.name}</span>
              {room.blocked && <span className="room-card-blocked">Blocked</span>}
            </div>
            <div className="room-card-meta">
              {room.building} · Floor {room.floor} · Cap {room.capacity}
            </div>
            <div className="room-card-tags">
              {room.equipment.map((item) => (
                <span key={item} className="equip-tag">
                  {item}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
