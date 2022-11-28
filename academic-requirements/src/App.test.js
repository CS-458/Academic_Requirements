import { fireEvent, render, screen, cleanup, waitForElement, getByLabelText, getByTestId } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";
import React from "react";
import App from "./App";
import FourYearPlanPage from "./components/FourYearPlanPage";
import SearchableDropdown from "./components/SearchableDropdown";

afterEach(cleanup);

describe("Testing searchable dropdown", () => {
  const mockedOptions = [
    'Mocked option 1', 'Mocked option 2','Mocked option 3'
  ];
  test("searchableDropdown should render with no errors", () => {
    //Mocked function
    const mockedOnChange = jest.fn();
    //Render the searchable dropdown
    const { getByText } = render(<SearchableDropdown 
      options={mockedOptions} 
      onSelectOption={mockedOnChange}
       showDropdown={true}/>);
    //get the <input/>
    const searchableDropdown = screen.getByRole("combobox");
    //Hopefully it renders
    expect(searchableDropdown).toBeTruthy();
  });

  test("searchableDropdown should be able to be clicked", async () => {
    const mockedOnChange = jest.fn();
    const { getByTestId, getByText, getByRole } = render(<SearchableDropdown 
      options={mockedOptions} 
      onSelectOption={mockedOnChange}
      showDropdown={true}
      thin={false}
      label={"dropdown"} />);
    
    const temp = screen.getByRole("combobox")
    //Open the menu (click on dropdown)
    await selectEvent.openMenu(temp);
    //Select "Mocked option 1"
    await selectEvent.select(temp, "Mocked option 1");
    //Function should be called once
    expect(mockedOnChange).toBeCalledTimes(1);
  });

  test("searchableDropdown should be able to be clicked multiple times", async () => {
    const mockedOnChange = jest.fn();
    const { getByRole } = render(<SearchableDropdown
      options={mockedOptions}
      onSelectOption={mockedOnChange}
      showDropdown={true}
      thin={false}
      label={"dropdown"}/>);
    const temp = screen.getByRole("combobox");
    //Repeat this 3 times, checking the function calls on the way
    await selectEvent.openMenu(temp);
    await selectEvent.select(temp, "Mocked option 1");
    expect(mockedOnChange).toBeCalledTimes(1);
    await selectEvent.openMenu(temp);
    await selectEvent.select(temp, "Mocked option 2");
    expect(mockedOnChange).toBeCalledTimes(2);
    await selectEvent.openMenu(temp);
    await selectEvent.select(temp, "Mocked option 3");
    expect(mockedOnChange).toBeCalledTimes(3);
  });
});

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

  // testing if the import button opens the uploader popup
  // and if we try uploading nothing the error popup appears
  test("Test Import Button opens uploader page and upload nothing to receive an error", () => {
    const { getByTestId } = render(<App />);
    //Check that input page is displaying
    expect(getByTestId("content")).toBeInTheDocument();
    //Check that import button can be pressed
    const importButton = getByTestId("Import");
    expect(importButton.textContent).toBe("Import Schedule");
    fireEvent.click(importButton);
    //Checks that uploader popup is open
    expect(getByTestId("uploaderPage")).toBeVisible();

    const uploadButton = getByTestId("uploadButton");
    expect(uploadButton.textContent).toBe("Upload");
    fireEvent.click(uploadButton);
    expect(getByTestId("errorPagePopup")).toBeVisible();
  });

  // Tests if we can upload a file and if it is the wrong file, an error page is thrown
  test("Test upload wrong file type and error thrown", () => {
    const { getByTestId } = render(<App />);
    //Check that input page is displaying
    expect(getByTestId("content")).toBeInTheDocument();

    //Check that import button can be pressed and is named accordingly
    const importButton = getByTestId("Import");
    expect(importButton.textContent).toBe("Import Schedule");
    // presses the import button
    fireEvent.click(importButton);
    //Checks that uploader popup is open
    expect(getByTestId("uploaderPage")).toBeVisible();

    //creates fake png file to test
    let file = new File(["thing"], "chucknorris.png", { type: "image/png" });
    // sets chooseFile to get the choose file button
    const chooseFile = getByTestId("chooseFile");
    // uploads the file
    userEvent.upload(chooseFile, file);
    // checks to see if file was uplaoded
    expect(chooseFile.files).toHaveLength(1);

    const uploadButton = getByTestId("uploadButton");
    expect(uploadButton.textContent).toBe("Upload");
    fireEvent.click(uploadButton);
    // checks if error popped up
    expect(getByTestId("errorPagePopup")).toBeVisible();
  });

  // Tests if we can upload a json file and have no error is thrown
  test("Test upload json file type and no error thrown", () => {
    const { getByTestId } = render(<App />);
    //Check that input page is displaying
    expect(getByTestId("content")).toBeInTheDocument();

    //Check that import button can be pressed
    const importButton = getByTestId("Import");
    expect(importButton.textContent).toBe("Import Schedule");
    fireEvent.click(importButton);
    //Checks that uploader popup is open
    expect(getByTestId("uploaderPage")).toBeVisible();

    let file = new File(["thing"], "chucknorris.json", { type: "json" });
    const chooseFile = getByTestId("chooseFile");
    userEvent.upload(chooseFile, file);
    expect(chooseFile.files).toHaveLength(1);

    const uploadButton = getByTestId("uploadButton");
    expect(uploadButton.textContent).toBe("Upload");
    fireEvent.click(uploadButton);
    expect(getByTestId("uploaderPage")).not.toBeVisible();
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
