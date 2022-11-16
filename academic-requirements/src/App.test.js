import { fireEvent, render } from "@testing-library/react";
import React from "react";
//import App from "./App";
//@ts-ignore
import InputPage from "./components/InputPage.tsx"
describe("Test for App", () => {
  test("Test Rendering", () => {
    const { getByTestId } = render(
      <InputPage
      showing={true}
      onClickGenerate={jest.fn()}
      onClickMajor={jest.fn()}
      onClickConcentration={jest.fn()}
      concentrationList={[]}
      majorList={[]}
      majorDisplayList={[]}
      concentrationDisplayList={[]}
       />);

    //Check that input page is displaying
    expect(getByTestId("content")).toBeInTheDocument();
    //Check that a button can be pressed
    const button = getByTestId("GenerateSchedule");
    expect(button.textContent).toBe("Generate My Schedule");
    fireEvent.click(button);
    //Check still on input page (no major selected so can't switch page)
    expect(getByTestId("content")).toBeInTheDocument();
  });
});
