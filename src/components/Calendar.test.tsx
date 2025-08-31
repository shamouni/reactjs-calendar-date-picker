import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import Calendar, { TCalDate } from "./Calendar";

describe("Calendar component", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the current month name", () => {
    render(<Calendar onChange={mockOnChange} />);
    const today = new Date();
    const monthName = today.toLocaleString("default", { month: "long" });
    expect(screen.getByTestId("month-name")).toHaveTextContent(monthName);
  });

  it("navigates to next month when clicking next button", () => {
    render(<Calendar onChange={mockOnChange} />);
    const today = new Date();
    const monthName = today.toLocaleString("default", { month: "long" });

    // should start with the current month
    expect(screen.getByTestId("month-name")).toHaveTextContent(monthName);

    // click next button
    fireEvent.click(screen.getByTestId("next-btn"));

    // should update to next month
    const nextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1
    ).toLocaleString("default", { month: "long" });
    expect(screen.getByTestId("month-name")).toHaveTextContent(nextMonth);
  });

  it("navigates to previous month when clicking prev button", () => {
    render(<Calendar onChange={mockOnChange} />);
    const today = new Date();
    const prevMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1
    ).toLocaleString("default", { month: "long" });

    fireEvent.click(screen.getByTestId("prev-btn"));
    expect(screen.getByTestId("month-name")).toHaveTextContent(prevMonth);
  });

  it("selects a start day and calls onChange with 'from' only", () => {
    render(<Calendar onChange={mockOnChange} />);
    const today = new Date();
    const startDay = screen.getByTestId(`day-${today.getDate()}`);
    fireEvent.click(startDay);

    expect(mockOnChange).toHaveBeenCalledWith({
      from: expect.any(Number),
      to: null,
    });
  });

  it("completes a valid range selection", () => {
    render(<Calendar onChange={mockOnChange} />);
    const today = 1;

    // select start day (current month)
    const startDay = screen.getByTestId(`day-${today}`);
    fireEvent.click(startDay);

    const fromCall = mockOnChange.mock.calls[0][0] as TCalDate;
    expect(fromCall.to).toBeNull();

    // select end day (some days later in the same month)
    const endDayNumber = 5;
    const endDay = screen.getByTestId(`day-${endDayNumber}`);
    fireEvent.click(endDay);

    const toCall = mockOnChange.mock.calls[1][0] as TCalDate;
    expect(toCall.from).toBeLessThan(toCall.to!);
  });

  it("does not allow selecting a reserved day", () => {
    const reserved = new Date();
    reserved.setHours(0, 0, 0, 0);
    const reservedTs = reserved.getTime();

    render(<Calendar onChange={mockOnChange} reservedDays={[reservedTs]} />);
    const reservedDay = screen.getByTestId(`day-${reserved.getDate()}`);

    fireEvent.click(reservedDay);

    // onChange should not fire
    expect(mockOnChange).not.toHaveBeenCalled();
    // reserved day should be marked disabled
    expect(reservedDay).toHaveAttribute("aria-disabled", "true");
  });

  it("ignores invalid range that crosses a reserved day", () => {
    // imagine today(start) is the first day of month
    const today = new Date();
    today.setDate(1);
    today.setHours(0, 0, 0, 0);

    const reserved = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 2
    ).getTime();

    render(<Calendar onChange={mockOnChange} reservedDays={[reserved]} />);

    const startDay = screen.getByTestId(`day-${today.getDate()}`); // start = today
    const invalidEnd = screen.getByTestId(`day-${today.getDate() + 4}`); // 2 days after reserved

    // select start
    fireEvent.click(startDay);
    // try selecting a day beyond reserved
    fireEvent.click(invalidEnd);

    // should only trigger once (for the start day)
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
