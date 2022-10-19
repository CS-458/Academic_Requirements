import { useEffect, useState } from "react";
import "./App.css";
import SearchableDropdown from './components/SearchableDropdown.tsx';

// Temporary imports until we get the real data
import majors from './mockDataLists/majors.tsx';
import concentrations from './mockDataLists/concentrations.tsx';
import courseSubjectAcronym from './mockDataLists/courseSubjectAcronym.tsx';
import courseNumber from './mockDataLists/courseNumber.tsx';

var completedClasses = [];
function App() {
  /*
   General variables
  */
  const [major, setMajor] = useState('');
  //const [minor, setMinor] = useState('');
  const [concentration, setConcentration] = useState('');
  const [showConcentration, setShowConcentration] = useState(false);
  const [concentrationOptions, setConcentrationOptions] = useState([]);
  const [coursesTaken, setCoursesTaken] = useState(null);

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

  function selectedConcentration(_concentration) { setConcentration(_concentration); }

  /*
   Methods for updating the table of previously taken courses
  */
  const [selectedAcronym, setSelectedAcronym] = useState('');
  const [selectedNumber, setSelectedNumber] = useState(0);
  
  function selectedCourseSubjectAcronym (_selectedAcronym) {
    setSelectedAcronym(_selectedAcronym);
    // TODO update list of course numbers based on the acronym
  }

  function selectedCourseNumber(_selectedNumber) {
    setSelectedNumber(_selectedNumber);
    // TODO update list of courses based on the selected course acronym and number

  }
  
  function processCompletedCourse() {
    /*Check that both dropdowns are filled out*/
    if (selectedNumber != null && selectedAcronym != null) {
      /*Add the course to the completed course list*/
      var arrayLength = completedClasses.push(selectedAcronym + "-" + selectedNumber);
      /*Output the course into the completed course list*/
      if (arrayLength > 10) {
        var row = document.getElementById("completedCourseTable").rows[
          arrayLength % 10
        ];
      } else {
        var row = document.getElementById("completedCourseTable").insertRow();
      }
      row.insertCell().innerHTML = selectedAcronym+"-"+selectedNumber;
    } else {
      /* TODO alert the user that they need to enter a complete, valid, course*/
    }
  }
  return (
    <div className="App">
      <header className="Four-Year-Plan">
        <h1>Academic Planner</h1>
      </header>
      <div className="screen">
        <div className="row">
          <div className="column" >
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
          <div className="column2"><button>Import Schedule</button></div>
          <div className="column2"><button>Generate My Schedule</button></div>
          <div className="column2">
          <div className="completedCourses">
          <h2>Completed Courses</h2>
            <center><table id="completedCourseTable">
              <tbody></tbody>
            </table></center>
          </div>
          </div>
        </div>
      </div>
  );
}
export default App;
