import { fireEvent, render } from "@testing-library/react";
import React from "react";
import App from "./App";
import FourYearPlanPage from "./components/FourYearPlanPage";

describe("Test for App", () => {
  global.URL.createObjectURL = jest.fn();

  test("Test Rendering", () => {
    const { getByTestId } = render(<App />);
    //Check that input page is displaying
    expect(getByTestId("content")).toBeInTheDocument();
    //Check that a button can be pressed
    const button = getByTestId("GenerateSchedule");
    expect(button.textContent).toBe("Generate My Schedule");
    fireEvent.click(button);
    //Check still on input page (no major selected so can't switch page)
    expect(getByTestId("content")).toBeInTheDocument();
  });

  // Tests the Export button and its functionality
  test("Test Export", () => {
    // Renders the FourYearPlanPage
    const { getByTestId } = render(
      <FourYearPlanPage
        showing={true}
        concentrationCourseList={[]}
        majorCourseList={[]}
        selectMajor={"major"}
        selectedConcentration={"concentration"}
        completedCourses={[]}
      />
    ); 
    const link = { click: jest.fn() };
    // Creates a spy element to get info from the FourYearPlanPage
    jest.spyOn(document, "createElement").mockImplementation(() => link);
    // Export Button
    const ebutton = getByTestId("ExportButton");
    // Expects export button to exist
    expect(getByTestId("ExportButton")).toBeInTheDocument();
    // After clicking the button, expects file to be called scheudle.json
    fireEvent.click(ebutton);
    expect(link.download).toBe("schedule.json");
  });
});
