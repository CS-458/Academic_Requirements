import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import StringProcessing from "./stringProcessing/StringProcessing";
//@ts-ignore
import InputPage from "./components/InputPage.tsx";
// import App from "./App";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import FourYearPlanPage from "./components/FourYearPlanPage";

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

  test("Test String Processing", () => {

    const stringProcess = new StringProcessing();

    // Base & Edge Cases Testing:

    // true -> string compare is blank, so always true
    expect(stringProcess.courseInListCheck("", ["CS-144"])).toBe(true);

    // true -> string compare is null, so always true
    expect(stringProcess.courseInListCheck(null, ["CS-144"])).toBe(true);

    // true -> string compare is undefined, so always true
    expect(stringProcess.courseInListCheck(undefined, ["CS-144"])).toBe(true);

    // false -> course array is empty, so cannot be satisfied
    expect(stringProcess.courseInListCheck("CS-144", [])).toBe(false);

    // false -> course array is null, so cannot be satisfied
    expect(stringProcess.courseInListCheck("CS-144", null)).toBe(false);

    // false -> course array is undefined, so cannot be satisfied
    expect(stringProcess.courseInListCheck("CS-144", undefined)).toBe(false);

    // true -> one course comparison matches
    expect(stringProcess.courseInListCheck("CS-144", ["CS-144"])).toBe(true);

    // false -> one course comparison not matches
    expect(stringProcess.courseInListCheck("CS-144", ["CS-145"])).toBe(false);

    // false -> one course missing from AND
    expect(
      stringProcess.courseInListCheck("CS-144,CS-145", ["CS-144", "CS-146"])
    ).toBe(false);

    // true -> both courses match AND
    expect(
      stringProcess.courseInListCheck("CS-144,CS-145", ["CS-144", "CS-145"])
    ).toBe(true);

    // false -> one course missing from AND
    expect(
      stringProcess.courseInListCheck("CS-144,CS-145", ["CS-144", "CS-146"])
    ).toBe(false);

    // true -> one course matches OR
    expect(
      stringProcess.courseInListCheck("CS-144|CS-145", ["CS-144", "CS-147"])
    ).toBe(true);

    // true -> other course matches OR
    expect(
      stringProcess.courseInListCheck("CS-144|CS-145", ["CS-145", "CS-147"])
    ).toBe(true);

    // true -> both courses matches OR
    expect(
      stringProcess.courseInListCheck("CS-144|CS-145", ["CS-144", "CS-145"])
    ).toBe(true);

    // false -> no courses match OR
    expect(
      stringProcess.courseInListCheck("CS-144|CS-145", ["CS-148", "CS-142"])
    ).toBe(false);

    // true -> both courses match SUBAND
    expect(
      stringProcess.courseInListCheck("CS-144&CS-145", ["CS-144", "CS-145"])
    ).toBe(true);

    // false -> one course missing from SUBAND
    expect(
      stringProcess.courseInListCheck("CS-144&CS-145", ["CS-144", "CS-146"])
    ).toBe(false);

    // false -> garbage put in for course compare
    expect(
      stringProcess.courseInListCheck("gibberish", ["CS-144", "CS-146"])
    ).toBe(false);

    // false -> garbage put in for course compare
    expect(stringProcess.courseInListCheck("CS-144", ["garbage", "icky"])).toBe(
      false
    );

    // true -> garbage put in for one course, but rest match
    expect(
      stringProcess.courseInListCheck("CS-144,CS-145", [
        "CS_144",
        "garbage",
        "CS-145",
        "icky",
      ])
    ).toBe(true);

    // true -> compare if string has a - or _ in it, still compares correctly
    expect(
      stringProcess.courseInListCheck("CS-144,CS_145,CS-146", [
        "CS_144",
        "CS-145",
        "CS_146",
      ])
    ).toBe(true);

    // true -> one course is taken concurrently
    expect(
      stringProcess.courseInListCheck(
        "!CS-144,CS-130",
        ["CS-130", "CS-180"],
        ["CS-144"]
      )
    ).toBe(true);

    // false -> one course is not taken currently nor concurrently
    expect(
      stringProcess.courseInListCheck(
        "!CS-144,CS-130",
        ["CS-130", "CS-180"],
        ["CS-145"]
      )
    ).toBe(false);

    // true -> checking for dash and underline difference in concurrent courses
    expect(
      stringProcess.courseInListCheck(
        "!CS-144,CS-130",
        ["CS-130", "CS-180"],
        ["CS_144"]
      )
    ).toBe(true);

    // true -> checking for OR course taken concurrently
    expect(
      stringProcess.courseInListCheck(
        "!CS-144|CS-130",
        ["CS-129", "CS-180"],
        ["CS-144"]
      )
    ).toBe(true);

    // true -> checking for SUBAND course taken concurrently
    expect(
      stringProcess.courseInListCheck(
        "!CS-144&CS-130",
        ["CS-130", "CS-180"],
        ["CS-144"]
      )
    ).toBe(true);

    // false -> SUBAND course is taken concurrently but not both
    expect(
      stringProcess.courseInListCheck(
        "!CS-144&CS-130",
        ["CS-129", "CS-180"],
        ["CS-144"]
      )
    ).toBe(false);

    // true -> both courses are taken concurrently
    expect(
      stringProcess.courseInListCheck(
        "!CS-144,!CS-130",
        ["CS-129", "CS-180"],
        ["CS-144", "CS_130"]
      )
    ).toBe(true);

    // true -> one of the two courses are taken concurrently
    expect(
      stringProcess.courseInListCheck(
        "!CS-144|!CS-130",
        ["CS-129", "CS-180"],
        ["CS-145", "CS_130"]
      )
    ).toBe(true);

    // true -> real example with concurrent taken course
    expect(
      stringProcess.courseInListCheck(
        "!BIO_332|CHEM_311|CS_244",
        ["CS-244", "CHEM-311"],
        ["BIO-332"]
      )
    ).toBe(true);

    // true -> check all courses in SUBANDs are satisfied
    expect(
      stringProcess.courseInListCheck("CS-100&CS_101&CS-102", [
        "CS-102",
        "CS-101",
        "CS-100",
      ])
    ).toBe(true);

    // true -> course above minimum is taken
    expect(stringProcess.courseInListCheck(">CS-101", ["CS-102"])).toBe(true);

    // false -> course above minimum is not taken
    expect(stringProcess.courseInListCheck(">CS-101", ["CS-100"])).toBe(false);

    // true -> course above minimum is taken with an AND
    expect(
      stringProcess.courseInListCheck("CS-101,>CS-102", [
        "CS-100",
        "CS-101",
        "CS-103",
      ])
    ).toBe(true);

    // true -> course above minimum is taken with an OR
    expect(
      stringProcess.courseInListCheck("CS-101|>MSCS-102", [
        "MSCS-100",
        "CS-101",
        "MSCS-103",
      ])
    ).toBe(true);

    // false -> course above minimum is not taken with an OR
    expect(
      stringProcess.courseInListCheck("CS-103|>MSCS-102", [
        "MSCS-100",
        "CS-101",
        "MSCS-101",
      ])
    ).toBe(false);

    // true -> concrete course above minimum is taken with an OR
    expect(
      stringProcess.courseInListCheck("CS-101|>MSCS-102", [
        "MSCS-100",
        "CS-101",
        "MSCS-102",
      ])
    ).toBe(true);

    // false -> duplicate entry means course above minimum is false
    expect(
      stringProcess.courseInListCheck("CS-101,>CS100", [
        "CS-101",
        "CS-101",
        "CS-101",
      ])
    ).toBe(false);

    // false -> duplicate entry means course above minimum is false (with an &)
    expect(
      stringProcess.courseInListCheck("CS-101&>CS100", [
        "CS-101",
        "CS-101",
        "CS-101",
      ])
    ).toBe(false);

    //REAL EXAMPLES:

    /* GDD450 Prerequisites */

    // true (SUBAND is satisfied)
    expect(
      stringProcess.courseInListCheck("GDD_325,CS-326&CS_358|DES-350", [
        "GDD_101",
        "CS-358",
        "CS-134",
        "CS_123",
        "GDD_325",
        "DES-349",
        "CS-326",
      ])
    ).toBe(true);

    // false (SUBAND not satisfied)
    expect(
      stringProcess.courseInListCheck("GDD_325,CS-326&CS_358|DES-350", [
        "GDD_101",
        "CS-134",
        "CS_123",
        "GDD_325",
        "DES-349",
        "CS-326",
        "CS-369",
      ])
    ).toBe(false);

    // true (SUBAND not satisfied; OR satisfied)
    expect(
      stringProcess.courseInListCheck("GDD_325,CS-326&CS_358|DES-350", [
        "GDD_101",
        "CS-134",
        "CS_123",
        "GDD_325",
        "DES-350",
        "CS-326",
        "CS-369",
      ])
    ).toBe(true);

    // false (SUBAND satisfied; AND not satisfied)
    expect(
      stringProcess.courseInListCheck("GDD_325,CS-326&CS_358|DES-350", [
        "CS-326",
        "GDD_101",
        "CS-134",
        "CS_123",
        "DES-349",
        "CS-358",
      ])
    ).toBe(false);

    // false (OR satisfied; AND not satisfied)
    expect(
      stringProcess.courseInListCheck("GDD_325,CS-326&CS_358|DES-350", [
        "GDD_101",
        "CS-134",
        "CS_123",
        "DES-350",
        "CS-358",
      ])
    ).toBe(false);

    // true (AND satisifed; OR satisfied; SUBAND satisfied)
    expect(
      stringProcess.courseInListCheck("GDD_325,CS-326&CS_358|DES-350", [
        "GDD_325",
        "GDD_101",
        "CS-326",
        "CS-134",
        "CS_123",
        "DES-350",
        "CS-358",
      ])
    ).toBe(true);

    /* Long psychology requirements */

    // true (all courses are taken)
    expect(
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
      )
    ).toBe(true);

    // true (all courses are taken, but in a different order as above test)
    expect(
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
      )
    ).toBe(true);

    // false (one course is missing)
    expect(
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
      )
    ).toBe(false);

    // false (many courses are missing)
    expect(
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
      )
    ).toBe(false);

    // true (all course are present in OR)
    expect(
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
      )
    ).toBe(true);

    // true (one course is present in OR)
    expect(
      stringProcess.courseInListCheck(
        "PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355|PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291",
        ["PSYC-371"]
      )
    ).toBe(true);

    // true (another one course is present in OR)
    expect(
      stringProcess.courseInListCheck(
        "PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355|PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291",
        ["PSYC-382"]
      )
    ).toBe(true);

    // true (two long ORs joined by an AND)
    expect(
      stringProcess.courseInListCheck(
        "PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355,PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291",
        ["PSYC-377", "PSYC_280"]
      )
    ).toBe(true);

    // false (two long ORs joined by an AND, but one of the ANDs is false)
    expect(
      stringProcess.courseInListCheck(
        "PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355,PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291",
        ["PSYC-377", "PSYC_283"]
      )
    ).toBe(false);

    // true (another one course is present in OR; all are concurrent)
    expect(
      stringProcess.courseInListCheck(
        "!PSYC-121|!PSYC-225|!PSYC-280|!PSYC-333|!PSYC-355|!PSYC-370|!PSYC-371|!PSYC-377|!PSYC-381|!PSYC-382|!PSYC-291",
        ["PSYC-382"]
      )
    ).toBe(true);

    // true (two long ORs joined by an AND; all are concurrent)
    expect(
      stringProcess.courseInListCheck(
        "!PSYC-121|!PSYC-225|!PSYC-280|!PSYC-333|!PSYC-355,!PSYC-370|!PSYC-371|!PSYC-377|!PSYC-381|!PSYC-382|!PSYC-291",
        ["PSYC-377", "PSYC-333"]
      )
    ).toBe(true);

    /* Strings with greater than specific courses */

    // true (all 'concrete' courses are taken)
    expect(
      stringProcess.courseInListCheck(
        "MATH-154|MATH-157,MATH-270,MATH-275,MATH-158|>MSCS-200|>STAT-300",
        ["MATH-270", "MATH-157", "MATH-275", "MATH-158"]
      )
    ).toBe(true);

    // true (a greater than course is taken)
    expect(
      stringProcess.courseInListCheck(
        "MATH-154|MATH-157,MATH-270,MATH-275,MATH-158|>MSCS-200|>STAT-300",
        ["MATH-270", "MATH-157", "MATH-275", "MSCS-209"]
      )
    ).toBe(true);

    // true (a greater than course is taken)
    expect(
      stringProcess.courseInListCheck(
        "MATH-154|MATH-157,MATH-270,MATH-275,MATH-158|>MSCS-200|>STAT-300",
        ["MATH-270", "MATH-157", "MATH-275", "STAT-300"]
      )
    ).toBe(true);

    // false (no greater than courses are taken)
    expect(
      stringProcess.courseInListCheck(
        "MATH-154|MATH-157,MATH-270,MATH-275,MATH-158|>MSCS-200|>STAT-300",
        ["MATH-270", "MATH-157", "MATH-275", "MSCS-170", "STAT-201"]
      )
    ).toBe(false);

    // true (no greater than courses are taken but concurrent course is taken)
    expect(
      stringProcess.courseInListCheck(
        "MATH-154|MATH-157,MATH-270,MATH-275,!MATH-158|>MSCS-200|>STAT-300",
        ["MATH-270", "MATH-157", "MATH-275", "MSCS-170", "STAT-201"],
        ["MATH-158"]
      )
    ).toBe(true);

    // true (concrete course is taken)
    expect(
      stringProcess.courseInListCheck("NANO_230|>CHEM_200|>PHYS_281", [
        "MATH-270",
        "NANO-230",
      ])
    ).toBe(true);

    // true (greater than course is taken)
    expect(
      stringProcess.courseInListCheck("NANO_230|>CHEM_200|>PHYS_281", [
        "MATH-270",
        "PHYS-290",
        "NANO-229",
      ])
    ).toBe(true);

    // true (another greater than course is taken)
    expect(
      stringProcess.courseInListCheck("NANO_230|>CHEM_200|>PHYS_281", [
        "MATH-270",
        "CHEM-200",
        "NANO-229",
      ])
    ).toBe(true);

    // false (no greater than course or concrete course is taken)
    expect(
      stringProcess.courseInListCheck("NANO_230|>CHEM_200|>PHYS_281", [
        "MATH-270",
        "PHYS-280",
        "NANO-229",
      ])
    ).toBe(false);

    // true (all greater than courses are taken)
    expect(
      stringProcess.courseInListCheck("NANO_230,>CHEM_200,>PHYS_281", [
        "PHYS-290",
        "NANO-230",
        "CHEM-199",
        "CHEM-201",
      ])
    ).toBe(true);

    // false (not all greater than courses are taken)
    expect(
      stringProcess.courseInListCheck("NANO_230,>CHEM_200,>PHYS_281", [
        "PHYS-290",
        "NANO-230",
        "CHEM-199",
        "CHEM-198",
      ])
    ).toBe(false);
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
