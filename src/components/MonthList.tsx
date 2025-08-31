type TMonthListProps = {
  date: Date;
  onPrevClick: () => void;
  onNextClick: () => void;
};

function MonthList({ date, onPrevClick, onNextClick }: TMonthListProps) {
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

  return (
    <div className="month">
      <i
        data-testid="prev-btn"
        onClick={onPrevClick}
        className="prev"
        role="button"
        aria-label="previous month"
      >
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
        <h1 data-testid="month-name">{months[date.getMonth()]}</h1>
        <p data-testid="today">{new Date().toDateString()}</p>
      </div>

      <i
        data-testid="next-btn"
        onClick={onNextClick}
        className="next"
        role="button"
        aria-label="next month"
      >
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
  );
}

export default MonthList;
