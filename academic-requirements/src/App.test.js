import { fireEvent, render, screen, cleanup, waitForElement } from "@testing-library/react";
import React from "react";
import App from "./App";
import SearchableDropdown from "./components/SearchableDropdown";

afterEach(cleanup);

describe("Testing elements", () => {
  const mockedOptions = [
    {label: 'Mocked option 1', value: 'mocked-option-1'},
    {label: 'Mocked option 2', value: 'mocked-option-2'},
    {label: 'Mocked option 3', value: 'mocked-option-3'}
  ];
  test("searchableDropdown should render with no errors", () => {
    const mockedOnChange = jest.fn();
    const { getByText } = render(<SearchableDropdown 
      options={mockedOptions} 
      onChange={mockedOnChange} />);
    const searchableDropdown = screen.getByTestId("select");
    expect(searchableDropdown).toBeTruthy();
  });

  test("searchableDropdown should call function when selected", async () => {
    const mockedOnChange = jest.fn();
    const { getByTestId } = render(<SearchableDropdown
      options={mockedOptions}
      label="Test"
      onSelectOption={mockedOnChange}
      showDropdown={true}
      thin={true}
    />);
    const searchableDropdown = screen.getByRole("combobox");

    searchableDropdown.click();
    fireEvent.click(screen.getByText('Mocked option 1'))

    expect(mockedOnChange).toBeCalledTimes(1)

    console.log(searchableDropdown);
  });
});

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
    expect(getByTestId("content")).toBeInTheDocument();
  });
});
