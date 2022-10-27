// The @ts-ignore rejects the error from having the .tsx file extension on import
import React, { useState, useRef, useMemo, useEffect } from "react";
// @ts-ignore
import SearchableDropdown from "./SearchableDropdown.tsx";
// @ts-ignore
import DeleteableInput from "./DeleteableInput.tsx";

import ErrorPopup from "./ErrorPopup";

// Temporary imports until we get the real data (can be deleted later)
// @ts-ignore
import majors from "../mockDataLists/majors.tsx";
// @ts-ignore
import concentrations from "../mockDataLists/concentrations.tsx";
// @ts-ignore
import courseSubjectAcronym from "../mockDataLists/courseSubjectAcronym.tsx";
// @ts-ignore
import courseNumber from "../mockDataLists/courseNumber.tsx";

// Input page is the page where the user inputs all of their information
const InputPage = (props: {
  showing: boolean;
  majorList: [];
  majorDisplayList: [];
  concentrationList: [];
  concentrationDisplayList: [];
  onClickMajor(major: string): void;
  onClickConcentration(concentration: string): void;
  onClickGenerate(
    major: string,
    concentration: string,
    previousCourses: string[]
  ): void;
}) => {
  //TODO make sure all of this information being passed is filled in and valid

  /*
  General variables
  */
  const [major, setMajor] = useState(""); // major that is selected
  const [concentration, setConcentration] = useState(""); // concentration that is selected
  const [showConcentration, setShowConcentration] = useState(false); // concentration dropdown menu is shown
  const [concentrationOptions, setConcentrationOptions] =
    useState<Array<string>>(); // all available concentrations

  const [coursesTaken, setCoursesTaken] = useState<Array<string>>([]); // courses taken list of strings
  const tableRef = useRef<HTMLTableElement>(null);

  /* 
  Methods that assign major, minor, or concentration when picking option from a dropdown
*/
  function selectedMajor(_major) {
    setMajor(_major);
    setShowConcentration(true);
    props.onClickMajor(_major);
    // TODO run a query to update the concentrations when major is selected?
    setConcentrationOptions(concentrations);
  }

  //function selectedMinor(_minor) { setMinor(_minor); }

  function selectedConcentration(_concentration) {
    setConcentration(_concentration);
    props.onClickConcentration(_concentration);
  }

  /*
  Methods for updating the table of previously taken courses
*/
  const [selectedAcronym, setSelectedAcronym] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);

  function selectedCourseSubjectAcronym(_selectedAcronym) {
    setSelectedAcronym(_selectedAcronym);
    // TODO update list of course numbers based on the acronym
  }

  function selectedCourseNumber(_selectedNumber) {
    setSelectedNumber(_selectedNumber);
    // TODO update list of courses based on the selected course acronym and number
    //TODO Check that a selected number is reset to null when you select a new course
  }

  const [visibility, setVisibility] = useState(false);
  const popupCloseHandler = () => {
    setVisibility(false);
  };
  const [error, setError] = useState("");
  function throwError(error) {
    setVisibility(true);
    setError(error);
  }
  // This method handles adding a new taken course to the table
  function processCompletedCourse() {
    //Check that both dropdowns are filled out
    if (selectedNumber != null && selectedAcronym != null) {
      //TODO Check that the course is a valid course in the database
      if (!coursesTaken.includes(selectedAcronym + "-" + selectedNumber)) {
        //Add the course to the completed course list
        console.log("Adding course " + selectedAcronym + "-" + selectedNumber);
        setCoursesTaken(
          coursesTaken.concat(selectedAcronym + "-" + selectedNumber)
        );
      } else {
        throwError("This course has already been added");
      }
    } else {
      // TODO alert the user that they need to enter a complete, valid, course
      if (selectedNumber == null) {
        throwError(
          "No course number has been selected, please select a course number."
        );
      } else {
        throwError(
          "No course type has been selected, please select a course type before adding a course."
        );
      }
    }
  }

  // Removes the course from the coursesTaken list
  function removeCourse(course: string) {
    // Slice method did not work, so here's a replacement:
    let arr = new Array();
    let index = coursesTaken.findIndex((x) => x === course);
    coursesTaken.forEach((x, y) => {
      if (y !== index) {
        arr.push(x);
      }
    });
    setCoursesTaken(arr);
    console.log("Deleted course: " + course);
  }

  function importSchedule() {
    //TODO check if the imported file is a valid format (jsonschema)
    //TODO throw error if the input is not of correct format
    throwError("Import file is not in a valid format");
    /*TODO either update existing variables on screen
   or bypass checking of those variables based on valid import*/
  }

  return (
    <div className="App">
      {props.showing && (
        <div>
          <header className="Four-Year-Plan">
            <h1>Academic Planner</h1>
          </header>
          <ErrorPopup
            onClose={popupCloseHandler}
            show={visibility}
            title="Error"
            error={error}
          />
          <div className="screen">
            <div className="input-grid">
              <div className="input-grid-dropdown">
                <SearchableDropdown
                  options={props.majorDisplayList}
                  label="Major"
                  onSelectOption={selectedMajor}
                  showDropdown={true}
                  thin={false}
                />
              </div>
              <div className="input-grid-dropdown">
                <SearchableDropdown
                  options={props.concentrationDisplayList}
                  label="Concentration"
                  onSelectOption={selectedConcentration}
                  showDropdown={showConcentration}
                  thin={false}
                />
              </div>
              <div className="input-grid-item">
                <div className="courseDropdowns">
                  <SearchableDropdown
                    options={courseSubjectAcronym}
                    label="Course Subject"
                    onSelectOption={selectedCourseSubjectAcronym}
                    showDropdown={true}
                    thin={true}
                  />
                  <SearchableDropdown
                    options={courseNumber}
                    label="Course Number"
                    onSelectOption={selectedCourseNumber}
                    showDropdown={true}
                    thin={true}
                  />
                </div>
                <button
                  onClick={processCompletedCourse}
                  className="addCourseButton"
                >
                  Add Course
                </button>
              </div>
              <div className="input-grid-item">
                <button>Import Schedule</button>
              </div>
              <div className="input-grid-item">
                <button
                  onClick={() =>
                    props.onClickGenerate(major, concentration, coursesTaken)
                  }
                >
                  Generate My Schedule
                </button>
              </div>
              <div className="input-grid-item-courses">
                <div className="completedCourses">
                  <h2>Completed Courses</h2>
                  <div 
                    className="courseList"
                    style={{
                      gridTemplateColumns: `repeat(${
                        (coursesTaken.length - 1) / 10 + 1
                      }, 1fr)`
                    }}
                  >
                    {coursesTaken.map((course) => {
                      return (
                        <div key={course} onClick={() => removeCourse(course)}>
                          <DeleteableInput
                            text={course}
                            thinWidth={coursesTaken.length >= 20}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputPage;
