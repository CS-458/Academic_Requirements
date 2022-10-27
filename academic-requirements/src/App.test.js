import { fireEvent, render } from "@testing-library/react";
import React from "react";
import App from "./App";

describe("Test for App", () => {
  test("Test Rendering", () => {
    const { getByTestId } = render(<App />);
    //Check that input page is displaying
    expect(getByTestId("content")).toBeInTheDocument();
    //Check that a button can be pressed
    const button = getByTestId("GenerateSchedule");
    expect(button.textContent).toBe("Generate My Schedule");
    fireEvent.click(button);
    //Check still on input page (no major selected so can't switch page)
    expect(getByTestId("content2")).toBeInTheDocument();
  });
});
