import Calendar, { TCalDate } from "reactjs-calendar-date-picker";
import "reactjs-calendar-date-picker/dist/style.css";

import { useState } from "react";
// import Calendar, { TCalDate } from "./components/Calendar";
// import "./index.css";

type TState = {
  fromDate: string;
  toDate: string;
};

const App = () => {
  const [selected, setSelected] = useState<TState>();

  const onChange = (arg: TCalDate) => {
    const { from, to } = arg;

    const fromDate = new Date(from).toLocaleDateString();
    const toDate = to ? new Date(to).toLocaleDateString() : "";

    setSelected({ fromDate, toDate });
  };

  // convert dates: new Date().getTime() -> 1691526600000
  const sample_days = [1691526600000, 1691699400000];

  const { fromDate, toDate } = selected || {};

  return (
    <div className="container">
      <Calendar reservedDays={sample_days} onChange={onChange} />
      <p className="note">
        {fromDate && toDate && (
          <>
            <span>from: {fromDate}</span>
            <span>to: {toDate}</span>
          </>
        )}
      </p>
    </div>
  );
};

export default App;
