import { useMemo, useState } from "react";
import type { CheckResult, Room } from "./types";
import { ROOMS } from "./rooms";
import { filterRooms } from "./filter";
import { checkAvailability } from "./lib/checkAvailability";
import { fmtTime, nowHHMM, parseTime } from "./lib/time";
import { FilterBar } from "./components/FilterBar";
import { RoomSelector } from "./components/RoomSelector";
import { BookingForm } from "./components/BookingForm";
import { RoomTimeline } from "./components/RoomTimeline";
import { DecisionPanel } from "./components/DecisionPanel";

function App() {
  const [attendees, setAttendees] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState(ROOMS[0].id);
  const [currentTime, setCurrentTime] = useState(nowHHMM());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [submitted, setSubmitted] = useState(false);

  const filteredRooms: Room[] = useMemo(
    () => filterRooms(ROOMS, { attendees, equipment: selectedItems }),
    [attendees, selectedItems],
  );

  const room: Room | null =
    filteredRooms.find((r) => r.id === selectedId) ?? filteredRooms[0] ?? null;

  const candidate = useMemo(() => {
    const s = parseTime(startTime);
    const e = parseTime(endTime);
    if (Number.isNaN(s) || Number.isNaN(e)) return null;
    return { start: s, end: e };
  }, [startTime, endTime]);

  const result: CheckResult | null = useMemo(() => {
    if (!submitted || !room) return null;
    return checkAvailability({
      rooms: filteredRooms,
      roomId: room.id,
      currentTimeMin: parseTime(currentTime),
      startMin: parseTime(startTime),
      endMin: parseTime(endTime),
    });
  }, [submitted, room, filteredRooms, currentTime, startTime, endTime]);

  const clearResult = () => {
    setSubmitted(false);
  };

  const handleToggleItem = (item: string) => {
    setSelectedItems((prev) =>
      new Set(prev).has(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  const handleResetFilters = () => {
    setAttendees(1);
    setSelectedItems([]);
  };

  const handleSubmit = () => {
    if (!room) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setCurrentTime(nowHHMM());
    setStartTime("10:00");
    setEndTime("11:00");
    clearResult();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-dot" />
          </div>
          <div>
            <h1>Smart Campus</h1>
            <p className="brand-sub">Room Availability Checker</p>
          </div>
        </div>
        <p className="tagline">
          Filter campus rooms by capacity and equipment, then check whether a
          time slot is available. Read-only — no booking is created.
        </p>
      </header>

      <main className="layout">
        <section className="panel left-panel" aria-label="Rooms">
          <FilterBar
            attendees={attendees}
            selectedItems={selectedItems}
            onAttendeesChange={setAttendees}
            onToggleItem={handleToggleItem}
            onResetFilters={handleResetFilters}
          />

          <div className="rooms-count">
            Showing {filteredRooms.length} of {ROOMS.length} rooms
          </div>

          <RoomSelector
            rooms={filteredRooms}
            selectedId={room?.id ?? ""}
            onSelect={(id) => setSelectedId(id)}
            onResetFilters={handleResetFilters}
          />
        </section>

        <section className="panel right-panel" aria-label="Availability check">
          {room ? (
            <>
              <div className="room-summary">
                <div>
                  <h2 className="room-summary-name">{room.name}</h2>
                  <p className="room-summary-meta">
                    {room.building} · Floor {room.floor} · Cap {room.capacity} ·{" "}
                    {room.type}
                  </p>
                  <div className="room-summary-tags">
                    {room.equipment.map((item) => (
                      <span key={item} className="equip-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                {room.blocked && <span className="blocked-tag">Blocked</span>}
              </div>

              <BookingForm
                currentTime={currentTime}
                startTime={startTime}
                endTime={endTime}
                onCurrentTime={(v) => {
                  setCurrentTime(v);
                  clearResult();
                }}
                onStartTime={(v) => {
                  setStartTime(v);
                  clearResult();
                }}
                onEndTime={(v) => {
                  setEndTime(v);
                  clearResult();
                }}
                onSubmit={handleSubmit}
                onReset={handleReset}
              />

              <div className="timeline-section">
                <h3 className="section-title">Today's schedule</h3>
                <RoomTimeline
                  bookings={room.bookings}
                  candidate={candidate}
                  blocked={room.blocked}
                />
              </div>

              <DecisionPanel result={result} submitted={submitted} />

              {room.bookings.length > 0 && (
                <ul className="booking-list">
                  {room.bookings.map((b, i) => (
                    <li key={i}>
                      <span className="booking-list-time">
                        {fmtTime(b.start)}–{fmtTime(b.end)}
                      </span>
                      {b.label && (
                        <span className="booking-list-label">{b.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="decision-panel empty" role="status">
              <p className="decision-placeholder">
                No room matches the current filters. Adjust the attendee count or
                required equipment on the left to select a room.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        Fictional sample data · Read-only availability check
      </footer>
    </div>
  );
}

export default App;
