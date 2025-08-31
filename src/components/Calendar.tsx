import { useState, useMemo, useCallback, JSX } from "react";
import { forwardRef, useImperativeHandle } from "react";
import MonthList from "./MonthList";
import "../index.css";

export type TCalDate = {
  from: number | null;
  to: number | null;
};

export type TCalendarRef = {
  clear: () => void;
};

type TProps = {
  reservedDays?: number[]; // timestamps at local midnight
  onChange: (arg: TCalDate) => void;
};

const Calendar = forwardRef<TCalendarRef, TProps>((props, ref) => {
  const { reservedDays = [], onChange } = props;

  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState<TCalDate>({ from: null, to: null });
  const [hoverDay, setHoverDay] = useState<number | null>(null);

  /** Utility: check if any reserved day exists between a and b (inclusive) */
  const hasReservedBetween = useCallback(
    (a: number, b: number) => {
      const start = Math.min(a, b);
      const end = Math.max(a, b);
      return reservedDays.some((d) => d >= start && d <= end);
    },
    [reservedDays]
  );

  /** Handlers for month navigation (stable references) */
  const handlePrev = useCallback(() => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  }, []);

  const handleNext = useCallback(() => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  }, []);

  /** Handle day selection with reserved-range guard */
  const handleSelect = useCallback(
    (day: number) => {
      // Block selecting a reserved start/end
      if (reservedDays.includes(day)) return;

      // Start new range or reset when needed
      if (!range.from || range.to || day < range.from) {
        setRange({ from: day, to: null });
        onChange({ from: day, to: null });
        return;
      }

      // Finishing the range: disallow crossing any reserved day
      if (range.from && !range.to) {
        if (hasReservedBetween(range.from, day)) {
          // Do nothing: keep current "from" and ignore invalid "to"
          return;
        }
        setRange({ from: range.from, to: day });
        onChange({ from: range.from, to: day });
      }
    },
    [range, reservedDays, onChange, hasReservedBetween]
  );

  useImperativeHandle(ref, () => ({
    clear() {
      setRange({ from: null, to: null });
      onChange({ from: null, to: null });
    },
  }));

  /** Build days for calendar grid */
  const daysList = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();
    const lastDayIndex = new Date(year, month + 1, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;

    const todayTs = new Date().setHours(0, 0, 0, 0);

    const buildDay = (day: number, m: number, extraClass = "") => {
      const ts = new Date(year, m, day, 0, 0, 0, 0).getTime();
      const isReserved = reservedDays.includes(ts);

      // Base class
      let cls = extraClass || "day";

      // Reserved state
      if (isReserved) cls += " reserved";

      // Markers
      if (ts === range.from) cls += " from";
      if (ts === range.to) cls += " to";

      // Hover highlight (only if there's no reserved day in between)
      if (
        range.from &&
        !range.to &&
        hoverDay &&
        ts >= Math.min(range.from, hoverDay) &&
        ts <= Math.max(range.from, hoverDay) &&
        !hasReservedBetween(range.from, hoverDay)
      ) {
        cls += " light";
      }

      // Selected range highlight
      if (
        range.from &&
        range.to &&
        ts >= Math.min(range.from, range.to) &&
        ts <= Math.max(range.from, range.to)
      ) {
        cls += " lights";
      }

      // Today marker
      if (ts === todayTs) cls += " today";

      return (
        <div
          key={ts}
          className={cls}
          aria-disabled={isReserved}
          onClick={!isReserved ? () => handleSelect(ts) : undefined}
          onMouseOver={() => setHoverDay(ts)}
          data-testid={extraClass ? undefined : `day-${day}`} // only for current month
        >
          {day}
        </div>
      );
    };

    const nodes: JSX.Element[] = [];

    // Previous month filler
    for (let x = firstDayIndex; x > 0; x--) {
      const n = prevLastDay - x + 1;
      nodes.push(buildDay(n, month - 1, "prev-date"));
    }

    // Current month
    for (let i = 1; i <= lastDay; i++) nodes.push(buildDay(i, month));

    // Next month filler
    for (let j = 1; j <= nextDays; j++) {
      nodes.push(buildDay(j, month + 1, "next-date"));
    }

    return nodes;
  }, [date, range, hoverDay, reservedDays, hasReservedBetween]);

  return (
    <div className="calendar" onMouseLeave={() => setHoverDay(null)}>
      <MonthList
        date={date}
        onPrevClick={handlePrev}
        onNextClick={handleNext}
      />

      <div className="weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="days">{daysList}</div>
    </div>
  );
});

export default Calendar;
