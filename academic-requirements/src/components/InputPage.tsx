// The @ts-ignore rejects the error from having the .tsx file extension on import
import React, { useState, useRef, useMemo, useEffect } from "react";
// @ts-ignore
import SearchableDropdown from "./SearchableDropdown.tsx";
// @ts-ignore
import DeleteableInput from "./DeleteableInput.tsx";

import ErrorPopup from "./ErrorPopup";

import ImportPopup from "./ImportPopup";

// Temporary imports until we get the real data (can be deleted later)
// @ts-ignore
import majors from "../mockDataLists/majors.tsx";
// @ts-ignore
import concentrations from "../mockDataLists/concentrations.tsx";

// Input page is the page where the user inputs all of their information
const InputPage = (props: {
  showing: boolean;
  majorList: [];
  majorDisplayList: [];
  concentrationList: [];
  concentrationDisplayList: [];

  courseSubjectAcronyms: string[];
  setSelectedCourseSubject(subject: string): void;
  courseSubjectNumbers: string[];

  takenCourses: string[];
  setTakenCourses(courses: string[]): void;
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

  const [jsonData, setJSONData] = useState([]);

  useEffect(() => {
    if(jsonData != undefined)
    {
      console.log(jsonData[0]);
    }
  },[jsonData])

  const [coursesTaken, setCoursesTaken] = useState<Array<string>>(
    props.takenCourses
  ); // courses taken list of strings
  const tableRef = useRef<HTMLTableElement>(null);

  /* 
  Methods that assign major, minor, or concentration when picking option from a dropdown
*/
  function selectedMajor(_major) {
    setMajor(_major);
    setShowConcentration(true);
    props.onClickMajor(_major);
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

  // When a new subject is selected, reset the selected number back to null
  useEffect(() => {
    setSelectedNumber(null);
  }, [selectedAcronym]);

  function selectedCourseSubjectAcronym(_selectedAcronym) {
    setSelectedAcronym(_selectedAcronym);

    // The updates the selected course acronym in App.js
    props.setSelectedCourseSubject(_selectedAcronym);
  }

  function selectedCourseNumber(_selectedNumber) {
    setSelectedNumber(_selectedNumber);
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

  // closes the uploader popup
  const [uploaderVisibility, setUploaderVisibility] = useState(false);
  const popupCloseHandlerUp = () => {
    setUploaderVisibility(false);
  };
  // Makes the uploader popup visible
  function showUploader() {
    setUploaderVisibility(true);
  }
  // This method handles adding a new taken course to the table
  function processCompletedCourse() {
    if (selectedNumber != null && selectedAcronym != null) {
      //TODO Check that the course is a valid course in the database
      if (!coursesTaken.includes(selectedAcronym + "-" + selectedNumber)) {
        //Add the course to the completed course list
        console.log("Adding course " + selectedAcronym + "-" + selectedNumber);
        setCoursesTaken(
          coursesTaken.concat(selectedAcronym + "-" + selectedNumber)
        );
        props.setTakenCourses(
          coursesTaken.concat(selectedAcronym + "-" + selectedNumber)
        );
      } else {
        throwError("This course has already been added");
      }
    } else {
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
    console.log("Adding course " + selectedAcronym + "-" + selectedNumber);
    // setCoursesTaken(
    //  coursesTaken.concat(selectedAcronym + "-" + selectedNumber)
    // );
    // props.setTakenCourses(
    //   coursesTaken.concat(selectedAcronym + "-" + selectedNumber)
    // );
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
    props.setTakenCourses(arr);
    console.log("Deleted course: " + course);
  }

  /*
  This function calls the showUploader function 
  it has the uploader popup appear where the user
  can select and upload a chosen file.
  Implementation of the Import Button and part of what it's suppose to do is in /ImportPopup/index.js
  */
  function setupUploader() {
    // Makes the upload screen visible sort of redundant
    showUploader();
  }

  //Function to autopopulate completed courses list. with every course.
  function fillCompletedCourses() {}
  return (
    <div className="App">
      {props.showing && (
        <div data-testid="content">
          <header className="Four-Year-Plan">
            <h1>Academic Planner</h1>
          </header>
          <ErrorPopup
            onClose={popupCloseHandler}
            show={visibility}
            title="Error"
            error={error}
          />
          <ImportPopup
            title="Upload"
            show={uploaderVisibility}
            onClose={popupCloseHandlerUp}
            returnJSON={setJSONData}
          />
          <div className="screen">
            <div className="input-grid">
              <div className="input-grid-dropdown" data-testid="MajorDropDown">
                <SearchableDropdown
                  options={props.majorDisplayList}
                  label="Major"
                  onSelectOption={selectedMajor} //reference
                  showDropdown={true}
                  thin={true}
                />
              </div>
              <div className="input-grid-dropdown">
                <SearchableDropdown
                  options={props.concentrationDisplayList}
                  label="Concentration"
                  onSelectOption={selectedConcentration}
                  showDropdown={showConcentration}
                  thin={true}
                />
              </div>
              <div className="input-grid-item">
                <div className="courseDropdowns">
                  <SearchableDropdown
                    options={props.courseSubjectAcronyms}
                    label="Course Subject"
                    onSelectOption={selectedCourseSubjectAcronym}
                    showDropdown={true}
                    thin={true}
                  />
                  <SearchableDropdown
                    options={props.courseSubjectNumbers}
                    label="Course Number"
                    onSelectOption={selectedCourseNumber}
                    showDropdown={selectedAcronym}
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
                <button onClick={setupUploader} data-testid="Import">
                  Import Schedule
                </button>
              </div>
              <div className="input-grid-item">
                <button
                  onClick={() =>
                    props.onClickGenerate(major, concentration, coursesTaken)
                  }
                  data-testid="GenerateSchedule"
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
                        //This may be where issue is with dropdown columns/formatting.
                        (coursesTaken.length - 1) / 10 + 1
                      }, 1fr)`,
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
