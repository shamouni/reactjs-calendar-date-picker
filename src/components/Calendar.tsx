import { useEffect, useRef, useState, Fragment } from "react";
import "../index.css";

export type TCalDate = {
  from: number;
  to: number;
};

type TProps = {
  reservedDays?: number[];
  onChange: (arg: TCalDate) => void;
};

const Calendar = (props: TProps) => {
  const { reservedDays = [], onChange } = props;

  const FROM_DATE = useRef<number>(0);
  const TO_DATE = useRef<number>(0);

  const [daysList, setDaysList] = useState<JSX.Element[]>([]);
  const [date, setDate] = useState(new Date());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => renderCalendar(), []);
  useEffect(() => selectDates(), [daysList]);

  const clear = (c: string) => {
    var elems = document.querySelectorAll(`.${c}`);

    [].forEach.call(elems, (el) => {
      (el as HTMLElement).classList.remove(c);
    });
  };

  const removeFrom = () => {
    const el = document.querySelector(".from") as HTMLElement;
    if (el) {
      el.classList.remove("from");
    }
  };

  const removeTo = () => {
    const el = document.querySelector(".to") as HTMLElement;
    if (el) {
      el.classList.remove("to");
    }
  };

  const checkReservedDays = (day: string) => {
    if (!reservedDays) {
      return false;
    }

    let found = false;
    let isReserved = false;

    reservedDays.forEach((i) => {
      if (i >= FROM_DATE.current && i <= parseInt(day)) {
        found = true;
      }
    });

    if ((FROM_DATE.current && found) || reservedDays.includes(parseInt(day))) {
      isReserved = true;
      FROM_DATE.current = 0;
      TO_DATE.current = 0;
      removeFrom();
      removeTo();
      clear("lights");
    }

    return isReserved;
  };

  const handle = (e: any) => {
    const id = e.target.id;

    const el = document.getElementById(id) as HTMLElement;
    const invalid = FROM_DATE.current && parseInt(id) - FROM_DATE.current < 0;

    const isReserved = checkReservedDays(id);
    if (isReserved) {
      return;
    }

    if (TO_DATE.current || invalid) {
      FROM_DATE.current = 0;
      TO_DATE.current = 0;

      removeTo();
      removeFrom();
      clear("lights");
    }

    if (FROM_DATE.current && !invalid) {
      if (el.classList.contains("from")) {
        FROM_DATE.current = 0;
        el.classList.remove("from");
      } else {
        TO_DATE.current = parseInt(id);
        el.classList.add("to");
        selectDates();
      }
    } else {
      FROM_DATE.current = parseInt(id);
      el.classList.add("from");
    }

    onChange({
      from: FROM_DATE.current,
      to: TO_DATE.current,
    });
  };

  const getNum = (day: number, month: number) => {
    const d = new Date(date.getFullYear(), month, day);
    const num = d.getTime();

    let cls = "";

    if (num === FROM_DATE.current) {
      cls = "from";
    } else if (num === TO_DATE.current) {
      cls = "to";
    }

    return {
      num: num.toString(),
      cls,
    };
  };

  const renderCalendar = () => {
    date.setDate(1);
    setDate(date);

    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    const prevLastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    ).getDate();

    const firstDayIndex = date.getDay();

    const lastDayIndex = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDay();

    const nextDays = 7 - lastDayIndex - 1;
    let days = [];

    for (let x = firstDayIndex; x > 0; x--) {
      const n = prevLastDay - x + 1;
      const { num, cls } = getNum(n, date.getMonth() - 1);

      days.push(
        <div
          id={num}
          onMouseOver={hoverDays}
          onClick={handle}
          className={`prev-date ${cls}`}
        >
          {n}
        </div>
      );
    }

    for (let i = 1; i <= lastDay; i++) {
      const { num, cls } = getNum(i, date.getMonth());
      let cc =
        i === new Date().getDate() && date.getMonth() === new Date().getMonth()
          ? "today"
          : "day";

      if (reservedDays.includes(parseInt(num))) {
        cc += " reserved";
      }

      days.push(
        <div
          id={num}
          onMouseOver={hoverDays}
          onClick={handle}
          className={`${cc} ${cls}`}
        >
          {i}
        </div>
      );
    }

    for (let j = 1; j <= nextDays; j++) {
      const { num, cls } = getNum(j, date.getMonth() + 1);
      days.push(
        <div
          id={num}
          onMouseOver={hoverDays}
          onClick={handle}
          className={`next-date ${cls}`}
        >
          {j}
        </div>
      );
    }

    setDaysList(days);
  };

  const prevClick = () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
  };

  const nextClick = () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
  };

  const hoverDays = (e: any) => {
    clear("light");

    const hasFrom = FROM_DATE.current;

    if (!hasFrom || TO_DATE.current) {
      return;
    }

    const toHover = parseInt(e.target.id);
    const fromHover = FROM_DATE.current;

    for (let i = fromHover; i <= toHover; i += 86400000) {
      const el = document.getElementById(i.toString()) as HTMLElement;
      if (reservedDays.includes(i)) {
        return;
      } else if (el) {
        el.classList.add("light");
      }
    }
  };

  const selectDates = () => {
    if (!FROM_DATE.current || !TO_DATE.current) {
      return;
    }

    for (let i = FROM_DATE.current; i <= TO_DATE.current; i += 86400000) {
      const el = document.getElementById(i.toString()) as HTMLElement;
      if (el) {
        el.classList.add("lights");
      }
    }
  };

  return (
    <div className="calendar">
      <div className="month">
        <i onClick={prevClick} className="prev">
          <svg
            fill="#000000"
            height="28px"
            width="28px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 59.414 59.414"
          >
            <polygon points="45.268,1.414 43.854,0 14.146,29.707 43.854,59.414 45.268,58 16.975,29.707 " />
          </svg>
        </i>
        <div className="date">
          <h1>{months[date.getMonth()]}</h1>
          <p>{new Date().toDateString()}</p>
        </div>
        <i onClick={nextClick} className="next">
          <svg
            fill="#000000"
            height="28px"
            width="28px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 59.414 59.414"
          >
            <polygon points="15.561,0 14.146,1.414 42.439,29.707 14.146,58 15.561,59.414 45.268,29.707 " />
          </svg>
        </i>
      </div>
      <div className="weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="days">
        {daysList.map((i) => (
          <Fragment key={i.props.id}>{i}</Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
