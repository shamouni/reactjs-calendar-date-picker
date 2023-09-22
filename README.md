# React Calendar Date Picker

A date picker calendar component built with react that supports date selection and reserved days.

![alt text](https://raw.githubusercontent.com/shamouni/shamouni.github.io/master/assets/images/calendar-screenshot.png)

## Installation

```
 npm install reactjs-calendar-date-picker
```

```js
import Calendar, { TCalDate } from "reactjs-calendar-date-picker";
```

You need to import the css style

```js
import "reactjs-calendar-date-picker/dist/style.css";
```

## Examples

```js
import { useState } from "react";
import Calendar, { TCalDate } from "reactjs-calendar-date-picker";
import "reactjs-calendar-date-picker/dist/style.css";

const App = () => {
  const [selected, setSelected] = useState();

  const onChange = (arg) => {
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
```
