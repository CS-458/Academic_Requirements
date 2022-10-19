import "./App.css";
import React, { useState } from "react";
import Select from "react-select";

var completedClasses = [];
function App() {
  /*selectedMajor stores the output from the Major dropdown*/
  const [selectedMajor, setSelectedMajor] = useState(null);
  const handleMajorChange = (e) => {
    setSelectedMajor(e.value);
  };
  /*selectedConcentration stores the output from the Concentration dropdown*/
  const [selectedConcentration, setSelectedConcentration] = useState(null);
  const handleConcentrationChange = (e) => {
    setSelectedConcentration(e.value);
  };
  /*selectedCourseType stores the output from the type dropdown*/
  const [selectedCourseType, setSelectedCourseType] = useState(null);
  const handleCourseTypeChange = (e) => {
    setSelectedCourseType(e.value);
  };
  /*selectedCourseNumber stores the output from the subject dropdown*/
  const [selectedCourseNumber, setSelectedCourseNumber] = useState(null);
  const handleCoursenumberChange = (e) => {
    setSelectedCourseNumber(e.value);
  };
  function processCompletedCourse() {
    /*Check that both dropdowns are filled out*/
    if (selectedCourseType != null && selectedCourseNumber != null) {
      /*Add the course to the completed course list*/
      var arrayLength = completedClasses.push(selectedMajor);
      /*Output the course into the completed course list*/
      if (arrayLength >= 10) {
        var row = document.getElementById("completedCourseTable").rows[
          (arrayLength % 10) + 1
        ];
      } else {
        var row = document.getElementById("completedCourseTable").insertRow();
      }
      row.insertCell().innerHTML = selectedMajor;
    } else {
      /* TODO alert the user that they need to enter a complete, valid, course*/
    }
  }
  const aquaticCreatures = [
    { label: "Shark", value: "Shark" },
    { label: "Dolphin", value: "Dolphin" },
    { label: "Whale", value: "Whale" },
    { label: "Octopus", value: "Octopus" },
    { label: "Crab", value: "Crab" },
    { label: "Lobster", value: "Lobster" },
  ];
  return (
    <div className="App">
      <header className="Four-Year-Plan">
        <h1>Enter User Input Here</h1>
      </header>
      <div class="screen">
        <div class="row">
          <div class="column">
            <Select options={aquaticCreatures} onChange={handleMajorChange} />
          </div>
          <div class="column">
            <button>Concentration dropdown</button>
          </div>
          <div class="column">
            <button>Completed Course</button>
            <button>Completed Number</button>
            <button onClick={processCompletedCourse}>Add Course</button>
          </div>
        </div>
        <div class="row2">
          <div class="column2">
            <button>Import Schedule</button>
          </div>
          <div class="column2">
            <button>Generate My Schedule</button>
          </div>
          <div class="column2">
            <center>
              <table id="completedCourseTable">
                <thead>
                  <tr>
                    <th>
                      <h2>Completed Courses</h2>
                    </th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
