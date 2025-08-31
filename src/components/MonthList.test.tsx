import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import MonthList from "./MonthList";

describe("MonthList component", () => {
  const mockPrev = vi.fn();
  const mockNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the correct month based on the given date", () => {
    const testDate = new Date(2025, 7, 15); // August 15, 2025
    render(
      <MonthList
        date={testDate}
        onPrevClick={mockPrev}
        onNextClick={mockNext}
      />
    );
    expect(screen.getByTestId("month-name")).toHaveTextContent("August");
  });

  it("renders today's date in the paragraph", () => {
    const today = new Date().toDateString();
    const testDate = new Date(2025, 0, 1);
    render(
      <MonthList
        date={testDate}
        onPrevClick={mockPrev}
        onNextClick={mockNext}
      />
    );
    expect(screen.getByTestId("today")).toHaveTextContent(today);
  });

  it("calls onPrevClick when clicking the prev button", () => {
    const testDate = new Date();
    render(
      <MonthList
        date={testDate}
        onPrevClick={mockPrev}
        onNextClick={mockNext}
      />
    );
    fireEvent.click(screen.getByTestId("prev-btn"));
    expect(mockPrev).toHaveBeenCalledTimes(1);
  });

  it("calls onNextClick when clicking the next button", () => {
    const testDate = new Date();
    render(
      <MonthList
        date={testDate}
        onPrevClick={mockPrev}
        onNextClick={mockNext}
      />
    );
    fireEvent.click(screen.getByTestId("next-btn"));
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
