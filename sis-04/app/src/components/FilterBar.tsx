import { EQUIPMENT_OPTIONS } from "../rooms";

interface FilterBarProps {
  attendees: number;
  selectedItems: string[];
  onAttendeesChange: (value: number) => void;
  onToggleItem: (item: string) => void;
  onResetFilters: () => void;
}

const EQUIPMENT_LABELS: Record<string, string> = {
  projector: "Projector",
  whiteboard: "Whiteboard",
  microphone: "Microphone",
  "tv-screen": "TV Screen",
  "lab-bench": "Lab Bench",
  recording: "Recording",
};

export function FilterBar({
  attendees,
  selectedItems,
  onAttendeesChange,
  onToggleItem,
  onResetFilters,
}: FilterBarProps) {
  const activeSet = new Set(selectedItems);
  const hasActiveFilters = attendees > 1 || selectedItems.length > 0;

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <h2 className="panel-title">Filter rooms</h2>
        {hasActiveFilters && (
          <button
            type="button"
            className="filter-reset"
            onClick={onResetFilters}
          >
            Reset filters
          </button>
        )}
      </div>

      <label className="field">
        <span className="field-label">Attendees (min capacity)</span>
        <input
          type="number"
          min={1}
          max={500}
          value={attendees}
          onChange={(e) => {
            const parsed = Number(e.target.value);
            onAttendeesChange(
              Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1,
            );
          }}
          aria-label="Attendees"
        />
      </label>

      <div className="filter-equip">
        <span className="field-label">Required equipment (all selected)</span>
        <div className="equip-grid" role="group" aria-label="Required equipment">
          {EQUIPMENT_OPTIONS.map((item) => {
            const checked = activeSet.has(item);
            return (
              <label
                key={item}
                className={`equip-chip ${checked ? "active" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleItem(item)}
                />
                <span>{EQUIPMENT_LABELS[item] ?? item}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
