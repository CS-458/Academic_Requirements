// The @ts-ignore rejects the error from having the .tsx file extension on import
import React, { useState, useRef } from "react";
// @ts-ignore
import SearchableDropdown from "./SearchableDropdown.tsx";

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

    // TODO run a query to update the concentrations when major is selected?
    setConcentrationOptions(concentrations);
  }

  //function selectedMinor(_minor) { setMinor(_minor); }

  function selectedConcentration(_concentration) {
    setConcentration(_concentration);
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

  // This method handles adding a new taken course to the table
  function processCompletedCourse() {
    //Check that both dropdowns are filled out
    if (selectedNumber != null && selectedAcronym != null) {
      //TODO Check that the course is a valid course in the database
      if (!coursesTaken.includes(selectedAcronym + "-" + selectedNumber)) {
        //Add the course to the completed course list
        var arrayLength = coursesTaken.push(
          selectedAcronym + "-" + selectedNumber
        );
        //Output the course into the completed course list
        if (tableRef.current != null) {
          if (arrayLength > 10) {
            var location = (arrayLength % 10) - 1;
            if (location == -1) {
              location = 9;
            }
            var row = tableRef.current.rows[location];
          } else {
            var row = tableRef.current.insertRow();
          }
          row.insertCell().innerHTML = selectedAcronym + "-" + selectedNumber;
        }
      } else {
        //TODO alert the user that they need to enter a complete, valid course
      }
    } else {
      // TODO alert the user that they need to enter a complete, valid, course
    }
  }

  function importSchedule() {
    //TODO check if the imported file is a valid format (jsonschema)
    //TODO throw error if the input is not of correct format
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
          <div className="screen">
            <div className="row">
              <div className="column">
                <SearchableDropdown
                  options={majors}
                  label="Major"
                  onSelectOption={selectedMajor}
                  showDropdown={true}
                  thin={false}
                />
              </div>
              <div className="column">
                <SearchableDropdown
                  options={concentrations}
                  label="Concentration"
                  onSelectOption={selectedConcentration}
                  showDropdown={showConcentration}
                  thin={false}
                />
              </div>
              <div className="courseInput">
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
            </div>
          </div>
          <div className="row2">
            <button onClick={processCompletedCourse}>Add Course</button>
            <div className="column2">
              <button>Import Schedule</button>
            </div>
            <div className="column2">
              <button
                onClick={() =>
                  props.onClickGenerate(major, concentration, coursesTaken)
                }
              >
                Generate My Schedule
              </button>
            </div>
            <div className="column2">
              <div className="completedCourses">
                <h2>Completed Courses</h2>
                <table id="completedCourseTable" ref={tableRef}>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputPage;