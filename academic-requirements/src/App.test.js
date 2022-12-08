import {
  fireEvent,
  render,
  screen,
  cleanup,
  waitForElement,
  getByLabelText,
  getByTestId,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";
import React from "react";
import StringProcessing from "./stringProcessing/StringProcessing";
//@ts-ignore
import InputPage from "./components/InputPage.tsx";
// import App from "./App";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import FourYearPlanPage from "./components/FourYearPlanPage";
import SearchableDropdown from "./components/SearchableDropdown";

afterEach(cleanup);

describe("Testing searchable dropdown", () => {
  const mockedOptions = [
    "Mocked option 1",
    "Mocked option 2",
    "Mocked option 3",
  ];
  test("searchableDropdown should render with no errors", () => {
    //Mocked function
    const mockedOnChange = jest.fn();
    //Render the searchable dropdown
    const { getByText } = render(
      <SearchableDropdown
        options={mockedOptions}
        onSelectOption={mockedOnChange}
        showDropdown={true}
      />
    );
    //get the <input/>
    const searchableDropdown = screen.getByRole("combobox");
    //Hopefully it renders
    expect(searchableDropdown).toBeTruthy();
  });

  test("searchableDropdown should be able to be clicked", async () => {
    const mockedOnChange = jest.fn();
    const { getByTestId, getByText, getByRole } = render(
      <SearchableDropdown
        options={mockedOptions}
        onSelectOption={mockedOnChange}
        showDropdown={true}
        thin={false}
        label={"dropdown"}
      />
    );

    const temp = screen.getByRole("combobox");
    //Open the menu (click on dropdown)
    await selectEvent.openMenu(temp);
    //Select "Mocked option 1"
    await selectEvent.select(temp, "Mocked option 1");
    //Function should be called once
    expect(mockedOnChange).toBeCalledTimes(1);
  });

  test("searchableDropdown should be able to be clicked multiple times", async () => {
    const mockedOnChange = jest.fn();
    const { getByRole } = render(
      <SearchableDropdown
        options={mockedOptions}
        onSelectOption={mockedOnChange}
        showDropdown={true}
        thin={false}
        label={"dropdown"}
      />
    );
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
        takenCourses={[]}
        setTakenCourses={jest.fn()}
      />
    );

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
        takenCourses={[]}
        setTakenCourses={jest.fn()}
      />
    );
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
        takenCourses={[]}
        setTakenCourses={jest.fn()}
      />
    );
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
        takenCourses={[]}
        setTakenCourses={jest.fn()}
      />
    );
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

  test("Test String Processing", () => {
    const stringProcess = new StringProcessing();

    // Base & Edge Cases Testing:

    // true -> string compare is blank, so always true
    if (stringProcess.courseInListCheck("", ["CS-144"]).returnValue !== true) {
      throw new Error("");
    }

    // true -> string compare is null, so always true
    if (
      stringProcess.courseInListCheck(null, ["CS-144"]).returnValue !== true
    ) {
      throw new Error("");
    }

    // true -> string compare is undefined, so always true
    if (
      stringProcess.courseInListCheck(undefined, ["CS-144"]).returnValue !==
      true
    ) {
      throw new Error("");
    }

    // false -> course array is empty, so cannot be satisfied
    if (stringProcess.courseInListCheck("CS-144", []).returnValue !== false) {
      throw new Error("");
    }

    // false -> course array is null, so cannot be satisfied
    if (stringProcess.courseInListCheck("CS-144", null).returnValue !== false) {
      throw new Error("");
    }

    // false -> course array is undefined, so cannot be satisfied
    if (
      stringProcess.courseInListCheck("CS-144", undefined).returnValue !== false
    ) {
      throw new Error("");
    }

    // true -> one course comparison matches
    if (
      stringProcess.courseInListCheck("CS-144", ["CS-144"]).returnValue !== true
    ) {
      throw new Error("");
    }

    // false -> one course comparison not matches
    if (
      stringProcess.courseInListCheck("CS-144", ["CS-145"]).returnValue !==
      false
    ) {
      throw new Error("");
    }

    // false -> one course missing from AND
    if (
      stringProcess.courseInListCheck("CS-144,CS-145", ["CS-144", "CS-146"])
        .returnValue !== false
    ) {
      throw new Error("");
    }

    // true -> both courses match AND
    if (
      stringProcess.courseInListCheck("CS-144,CS-145", ["CS-144", "CS-145"])
        .returnValue !== true
    ) {
      throw new Error("");
    }

    // false -> one course missing from AND
    if (
      stringProcess.courseInListCheck("CS-144,CS-145", ["CS-144", "CS-146"])
        .returnValue !== false
    ) {
      throw new Error("");
    }

    // true -> one course matches OR
    if (
      stringProcess.courseInListCheck("CS-144|CS-145", ["CS-144", "CS-147"])
        .returnValue !== true
    ) {
      throw new Error("");
    }

    // true -> other course matches OR
    if (
      stringProcess.courseInListCheck("CS-144|CS-145", ["CS-145", "CS-147"])
        .returnValue !== true
    ) {
      throw new Error("");
    }

    // true -> both courses matches OR
    if (
      stringProcess.courseInListCheck("CS-144|CS-145", ["CS-144", "CS-145"])
        .returnValue !== true
    ) {
      throw new Error("");
    }

    // false -> no courses match OR
    if (
      stringProcess.courseInListCheck("CS-144|CS-145", ["CS-148", "CS-142"])
        .returnValue !== false
    ) {
      throw new Error("");
    }

    // true -> both courses match SUBAND
    if (
      stringProcess.courseInListCheck("CS-144&CS-145", ["CS-144", "CS-145"])
        .returnValue !== true
    ) {
      throw new Error("");
    }

    // false -> one course missing from SUBAND
    if (
      stringProcess.courseInListCheck("CS-144&CS-145", ["CS-144", "CS-146"])
        .returnValue !== false
    ) {
      throw new Error("");
    }

    // false -> garbage put in for course compare
    if (
      stringProcess.courseInListCheck("gibberish", ["CS-144", "CS-146"])
        .returnValue !== false
    ) {
      throw new Error("");
    }

    // false -> garbage put in for course compare
    if (
      stringProcess.courseInListCheck("CS-144", ["garbage", "icky"])
        .returnValue !== false
    ) {
      throw new Error("");
    }

    // true -> garbage put in for one course, but rest match
    if (
      stringProcess.courseInListCheck("CS-144,CS-145", [
        "CS_144",
        "garbage",
        "CS-145",
        "icky",
      ]).returnValue !== true
    ) {
      throw new Error("");
    }

    // true -> compare if string has a - or _ in it, still compares correctly
    if (
      stringProcess.courseInListCheck("CS-144,CS_145,CS-146", [
        "CS_144",
        "CS-145",
        "CS_146",
      ]).returnValue !== true
    ) {
      throw new Error("");
    }

    // true -> one course is taken concurrently
    if (
      stringProcess.courseInListCheck(
        "!CS-144,CS-130",
        ["CS-130", "CS-180"],
        ["CS-144"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // false -> one course is not taken currently nor concurrently
    if (
      stringProcess.courseInListCheck(
        "!CS-144,CS-130",
        ["CS-130", "CS-180"],
        ["CS-145"]
      ).returnValue !== false
    ) {
      throw new Error("");
    }

    // true -> checking for dash and underline difference in concurrent courses
    if (
      stringProcess.courseInListCheck(
        "!CS-144,CS-130",
        ["CS-130", "CS-180"],
        ["CS_144"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // true -> checking for OR course taken concurrently
    if (
      stringProcess.courseInListCheck(
        "!CS-144|CS-130",
        ["CS-129", "CS-180"],
        ["CS-144"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // true -> checking for SUBAND course taken concurrently
    if (
      stringProcess.courseInListCheck(
        "!CS-144&CS-130",
        ["CS-130", "CS-180"],
        ["CS-144"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // false -> SUBAND course is taken concurrently but not both
    if (
      stringProcess.courseInListCheck(
        "!CS-144&CS-130",
        ["CS-129", "CS-180"],
        ["CS-144"]
      ).returnValue !== false
    ) {
      throw new Error("");
    }

    // true -> both courses are taken concurrently
    if (
      stringProcess.courseInListCheck(
        "!CS-144,!CS-130",
        ["CS-129", "CS-180"],
        ["CS-144", "CS_130"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // true -> one of the two courses are taken concurrently
    if (
      stringProcess.courseInListCheck(
        "!CS-144|!CS-130",
        ["CS-129", "CS-180"],
        ["CS-145", "CS_130"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // true -> real example with concurrent taken course
    if (
      stringProcess.courseInListCheck(
        "!BIO_332|CHEM_311|CS_244",
        ["CS-244", "CHEM-311"],
        ["BIO-332"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // true -> check all courses in SUBANDs are satisfied
    if (
      stringProcess.courseInListCheck("CS-100&CS_101&CS-102", [
        "CS-102",
        "CS-101",
        "CS-100",
      ]).returnValue !== true
    ) {
      throw new Error("");
    }

    // true -> course above minimum is taken
    if (
      stringProcess.courseInListCheck(">CS-101", ["CS-102"]).returnValue !==
      true
    ) {
      throw new Error("");
    }

    // false -> course above minimum is not taken
    if (
      stringProcess.courseInListCheck(">CS-101", ["CS-100"]).returnValue !==
      false
    ) {
      throw new Error("");
    }

    // true -> course above minimum is taken with an AND
    if (
      stringProcess.courseInListCheck("CS-101,>CS-102", [
        "CS-100",
        "CS-101",
        "CS-103",
      ]).returnValue !== true
    ) {
      throw new Error("");
    }

    // true -> course above minimum is taken with an OR
    if (
      stringProcess.courseInListCheck("CS-101|>MSCS-102", [
        "MSCS-100",
        "CS-101",
        "MSCS-103",
      ]).returnValue !== true
    ) {
      throw new Error("");
    }

    // false -> course above minimum is not taken with an OR
    if (
      stringProcess.courseInListCheck("CS-103|>MSCS-102", [
        "MSCS-100",
        "CS-101",
        "MSCS-101",
      ]).returnValue !== false
    ) {
      throw new Error("");
    }

    // true -> concrete course above minimum is taken with an OR
    if (
      stringProcess.courseInListCheck("CS-101|>MSCS-102", [
        "MSCS-100",
        "CS-101",
        "MSCS-102",
      ]).returnValue !== true
    ) {
      throw new Error("");
    }

    // false -> duplicate entry means course above minimum is false
    if (
      stringProcess.courseInListCheck("CS-101,>CS100", [
        "CS-101",
        "CS-101",
        "CS-101",
      ]).returnValue !== false
    ) {
      throw new Error("");
    }

    // false -> duplicate entry means course above minimum is false (with an &)
    if (
      stringProcess.courseInListCheck("CS-101&>CS100", [
        "CS-101",
        "CS-101",
        "CS-101",
      ]).returnValue !== false
    ) {
      throw new Error("");
    }

    //REAL EXAMPLES:

    /* GDD450 Prerequisites */

    // true (SUBAND is satisfied)
    if (
      stringProcess.courseInListCheck("GDD_325,CS-326&CS_358|DES-350", [
        "GDD_101",
        "CS-358",
        "CS-134",
        "CS_123",
        "GDD_325",
        "DES-349",
        "CS-326",
      ]).returnValue !== true
    ) {
      throw new Error("");
    }

    // false (SUBAND not satisfied)
    if (
      stringProcess.courseInListCheck("GDD_325,CS-326&CS_358|DES-350", [
        "GDD_101",
        "CS-134",
        "CS_123",
        "GDD_325",
        "DES-349",
        "CS-326",
        "CS-369",
      ]).returnValue !== false
    ) {
      throw new Error("");
    }

    // true (SUBAND not satisfied; OR satisfied)
    if (
      stringProcess.courseInListCheck("GDD_325,CS-326&CS_358|DES-350", [
        "GDD_101",
        "CS-134",
        "CS_123",
        "GDD_325",
        "DES-350",
        "CS-326",
        "CS-369",
      ]).returnValue !== true
    ) {
      throw new Error("");
    }

    // false (SUBAND satisfied; AND not satisfied)
    if (
      stringProcess.courseInListCheck("GDD_325,CS-326&CS_358|DES-350", [
        "CS-326",
        "GDD_101",
        "CS-134",
        "CS_123",
        "DES-349",
        "CS-358",
      ]).returnValue !== false
    ) {
      throw new Error("");
    }

    // false (OR satisfied; AND not satisfied)
    if (
      stringProcess.courseInListCheck("GDD_325,CS-326&CS_358|DES-350", [
        "GDD_101",
        "CS-134",
        "CS_123",
        "DES-350",
        "CS-358",
      ]).returnValue !== false
    ) {
      throw new Error("");
    }

    // true (AND satisifed; OR satisfied; SUBAND satisfied)
    if (
      stringProcess.courseInListCheck("GDD_325,CS-326&CS_358|DES-350", [
        "GDD_325",
        "GDD_101",
        "CS-326",
        "CS-134",
        "CS_123",
        "DES-350",
        "CS-358",
      ]).returnValue !== true
    ) {
      throw new Error("");
    }

    /* Long psychology requirements */

    // true (all courses are taken)
    if (
      stringProcess.courseInListCheck(
        "PSYC-100,PSYC-110,PSYC-190,PSYC-233,PSYC-242,PSYC-251,PSYC-270,PSYC-290,PSYC-300,PSYC-320,PSYC-350,PSYC-490",
        [
          "PSYC-100",
          "PSYC-110",
          "PSYC-190",
          "PSYC-233",
          "PSYC-242",
          "PSYC-251",
          "PSYC-270",
          "PSYC-290",
          "PSYC-300",
          "PSYC-320",
          "PSYC-350",
          "PSYC-490",
        ]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // true (all courses are taken, but in a different order as above test)
    if (
      stringProcess.courseInListCheck(
        "PSYC-100,PSYC-110,PSYC-190,PSYC-233,PSYC-242,PSYC-251,PSYC-270,PSYC-290,PSYC-300,PSYC-320,PSYC-350,PSYC-490",
        [
          "PSYC-110",
          "PSYC-270",
          "PSYC-190",
          "PSYC-233",
          "PSYC-490",
          "PSYC-350",
          "PSYC-242",
          "PSYC-100",
          "PSYC-251",
          "PSYC-290",
          "PSYC-320",
          "PSYC-300",
        ]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // false (one course is missing)
    if (
      stringProcess.courseInListCheck(
        "PSYC-100,PSYC-110,PSYC-190,PSYC-233,PSYC-242,PSYC-251,PSYC-270,PSYC-290,PSYC-300,PSYC-320,PSYC-350,PSYC-490",
        [
          "PSYC-110",
          "PSYC-270",
          "PSYC-190",
          "PSYC-490",
          "PSYC-350",
          "PSYC-242",
          "PSYC-100",
          "PSYC-251",
          "PSYC-290",
          "PSYC-320",
          "PSYC-300",
        ]
      ).returnValue !== false
    ) {
      throw new Error("");
    }

    // false (many courses are missing)
    if (
      stringProcess.courseInListCheck(
        "PSYC-100,PSYC-110,PSYC-190,PSYC-233,PSYC-242,PSYC-251,PSYC-270,PSYC-290,PSYC-300,PSYC-320,PSYC-350,PSYC-490",
        [
          "PSYC-110",
          "PSYC-242",
          "PSYC-100",
          "PSYC-251",
          "PSYC-290",
          "PSYC-320",
          "PSYC-300",
        ]
      ).returnValue !== false
    ) {
      throw new Error("");
    }

    // true (all course are present in OR)
    if (
      stringProcess.courseInListCheck(
        "PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355|PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291",
        [
          "PSYC-121",
          "PSYC-225",
          "PSYC-280",
          "PSYC-333",
          "PSYC-355",
          "PSYC-370",
          "PSYC-371",
          "PSYC-377",
          "PSYC-381",
          "PSYC-382",
          "PSYC-291",
        ]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // true (one course is present in OR)
    if (
      stringProcess.courseInListCheck(
        "PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355|PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291",
        ["PSYC-371"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // true (another one course is present in OR)
    if (
      stringProcess.courseInListCheck(
        "PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355|PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291",
        ["PSYC-382"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // true (two long ORs joined by an AND)
    if (
      stringProcess.courseInListCheck(
        "PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355,PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291",
        ["PSYC-377", "PSYC_280"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // false (two long ORs joined by an AND, but one of the ANDs is false)
    if (
      stringProcess.courseInListCheck(
        "PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355,PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291",
        ["PSYC-377", "PSYC_283"]
      ).returnValue !== false
    ) {
      throw new Error("");
    }

    // true (another one course is present in OR; all are concurrent)
    if (
      stringProcess.courseInListCheck(
        "!PSYC-121|!PSYC-225|!PSYC-280|!PSYC-333|!PSYC-355|!PSYC-370|!PSYC-371|!PSYC-377|!PSYC-381|!PSYC-382|!PSYC-291",
        ["PSYC-382"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // true (two long ORs joined by an AND; all are concurrent)
    if (
      stringProcess.courseInListCheck(
        "!PSYC-121|!PSYC-225|!PSYC-280|!PSYC-333|!PSYC-355,!PSYC-370|!PSYC-371|!PSYC-377|!PSYC-381|!PSYC-382|!PSYC-291",
        ["PSYC-377", "PSYC-333"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    /* Strings with greater than specific courses */

    // true (all 'concrete' courses are taken)
    if (
      stringProcess.courseInListCheck(
        "MATH-154|MATH-157,MATH-270,MATH-275,MATH-158|>MSCS-200|>STAT-300",
        ["MATH-270", "MATH-157", "MATH-275", "MATH-158"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // true (a greater than course is taken)
    if (
      stringProcess.courseInListCheck(
        "MATH-154|MATH-157,MATH-270,MATH-275,MATH-158|>MSCS-200|>STAT-300",
        ["MATH-270", "MATH-157", "MATH-275", "MSCS-209"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // true (a greater than course is taken)
    if (
      stringProcess.courseInListCheck(
        "MATH-154|MATH-157,MATH-270,MATH-275,MATH-158|>MSCS-200|>STAT-300",
        ["MATH-270", "MATH-157", "MATH-275", "STAT-300"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // false (no greater than courses are taken)
    if (
      stringProcess.courseInListCheck(
        "MATH-154|MATH-157,MATH-270,MATH-275,MATH-158|>MSCS-200|>STAT-300",
        ["MATH-270", "MATH-157", "MATH-275", "MSCS-170", "STAT-201"]
      ).returnValue !== false
    ) {
      throw new Error("");
    }

    // true (no greater than courses are taken but concurrent course is taken)
    if (
      stringProcess.courseInListCheck(
        "MATH-154|MATH-157,MATH-270,MATH-275,!MATH-158|>MSCS-200|>STAT-300",
        ["MATH-270", "MATH-157", "MATH-275", "MSCS-170", "STAT-201"],
        ["MATH-158"]
      ).returnValue !== true
    ) {
      throw new Error("");
    }

    // true (concrete course is taken)
    if (
      stringProcess.courseInListCheck("NANO_230|>CHEM_200|>PHYS_281", [
        "MATH-270",
        "NANO-230",
      ]).returnValue !== true
    ) {
      throw new Error("");
    }

    // true (greater than course is taken)
    if (
      stringProcess.courseInListCheck("NANO_230|>CHEM_200|>PHYS_281", [
        "MATH-270",
        "PHYS-290",
        "NANO-229",
      ]).returnValue !== true
    ) {
      throw new Error("");
    }

    // true (another greater than course is taken)
    if (
      stringProcess.courseInListCheck("NANO_230|>CHEM_200|>PHYS_281", [
        "MATH-270",
        "CHEM-200",
        "NANO-229",
      ]).returnValue !== true
    ) {
      throw new Error("");
    }

    // false (no greater than course or concrete course is taken)
    if (
      stringProcess.courseInListCheck("NANO_230|>CHEM_200|>PHYS_281", [
        "MATH-270",
        "PHYS-280",
        "NANO-229",
      ]).returnValue !== false
    ) {
      throw new Error("");
    }

    // true (all greater than courses are taken)
    if (
      stringProcess.courseInListCheck("NANO_230,>CHEM_200,>PHYS_281", [
        "PHYS-290",
        "NANO-230",
        "CHEM-199",
        "CHEM-201",
      ]).returnValue !== true
    ) {
      throw new Error("");
    }

    // false (not all greater than courses are taken)
    if (
      stringProcess.courseInListCheck("NANO_230,>CHEM_200,>PHYS_281", [
        "PHYS-290",
        "NANO-230",
        "CHEM-199",
        "CHEM-198",
      ]).returnValue !== false
    ) {
      throw new Error("");
    }
  });

  /* COMMENTED OUT FOR NOW UNTIL backendFactory problem is resolved
  // Tests the Export button and its functionality
  test("Test Export", () => {
    //Renders the FourYearPlanPage
    const { getByTestId } = render(
      <FourYearPlanPage
        showing={true}
        concentrationCourseList={[]}
        majorCourseList={[]}
        selectedMajor={"major"}
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
  */
});
