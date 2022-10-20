import { useEffect, useState } from "react";
import "./App.css";
import SearchableDropdown from "./components/SearchableDropdown.tsx";

// Temporary imports until we get the real data
import majors from "./mockDataLists/majors.tsx";
import concentrations from "./mockDataLists/concentrations.tsx";
import courseSubjectAcronym from "./mockDataLists/courseSubjectAcronym.tsx";
import courseNumber from "./mockDataLists/courseNumber.tsx";

var completedClasses = [];
function App() {
  /*
   General variables
  */
  const [major, setMajor] = useState("");
  //const [minor, setMinor] = useState('');
  const [concentration, setConcentration] = useState("");
  const [showConcentration, setShowConcentration] = useState(false);
  const [concentrationOptions, setConcentrationOptions] = useState([]);
  const [coursesTaken, setCoursesTaken] = useState([]);

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
    /*TODO Double check that a selected number is reset to null when you select a new course*/
  }

  function processCompletedCourse() {
    /*Check that both dropdowns are filled out*/
    if (selectedNumber != null && selectedAcronym != null) {
      /*TODO Double check that the course is a valid course in the database */
      if (!coursesTaken.includes(selectedAcronym + "-" + selectedNumber)) {
        /*Add the course to the completed course list*/
        setCoursesTaken((coursesTaken) => [
          ...coursesTaken,
          selectedAcronym + "-" + selectedNumber,
        ]);
        var arrayLength = completedClasses.push(
          selectedAcronym + "-" + selectedNumber
        );
        /*Output the course into the completed course list*/
        if (arrayLength > 10) {
          var location = (arrayLength % 10) - 1;
          if (location == -1) {
            location = 9;
          }
          var row = document.getElementById("completedCourseTable").rows[
            location
          ];
        } else {
          var row = document.getElementById("completedCourseTable").insertRow();
        }
        row.insertCell().innerHTML = selectedAcronym + "-" + selectedNumber;
      } else {
        /*TODO alert the user that the class has already been entered*/
      }
    } else {
      /* TODO alert the user that they need to enter a complete, valid, course*/
    }
  }
  function generateScheduleButton() {
    //TODO throw error if major not selected
    //TODO throw error if concentration not selected
    //TODO switch to next screen and pass on major, concentration, and optionally class list
  }
  function importSchedule() {
    //TODO check if the imported file is a valid format (jsonschema)
    //TODO throw error if the input is not of correct format
    /*TODO either update existing variables on screen
     or bypass checking of those variables based on valid import*/
  }
  return (
    <div className="App">
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
            <button onClick={processCompletedCourse}>Add Course</button>
          </div>
        </div>
        <div className="row2">
          <div className="column2">
            <button onClick={importSchedule}>Import Schedule</button>
          </div>
          <div className="column2">
            <button onClick={generateScheduleButton}>
              Generate My Schedule
            </button>
          </div>
          <div className="column2">
            <div className="completedCourses">
              <h2>Completed Courses</h2>
              <center>
                <table id="completedCourseTable">
                  <tbody></tbody>
                </table>
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
