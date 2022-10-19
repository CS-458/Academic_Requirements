import { useEffect, useState } from "react";
import "./App.css";
import SearchableDropdown from './components/SearchableDropdown.tsx';

// Temporary imports until we get the real data
import majors from './mockDataLists/majors.tsx';
import concentrations from './mockDataLists/concentrations.tsx';
import courseSubjectAcronym from './mockDataLists/courseSubjectAcronym.tsx';
import courseNumber from './mockDataLists/courseNumber.tsx';

function App() {

  /*
   General variables
  */
  const [major, setMajor] = useState('');
  //const [minor, setMinor] = useState('');
  const [concentration, setConcentration] = useState('');
  const [showConcentration, setShowConcentration] = useState(false);
  const [concentrationCourses, setConcentrationCourses] = useState([]);
  const [coursesTaken, setCoursesTaken] = useState(null);

  /* 
    Methods that assign major, minor, or concentration when picking option from a dropdown
  */
  function selectedMajor(_major) { 
    setMajor(_major); 
    setShowConcentration(true);

    // TODO run a query to update the concentrations when major is selected?
    setConcentrationCourses(concentrations);
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

  return (
    <div className="App">
      <header className="Four-Year-Plan">
        <h1>Enter User Input Here</h1>
      </header>
      <div class="screen">
        <div class="row">
          <div class="column" >
            <SearchableDropdown 
              options={majors} 
              label="Major"
              onSelectOption={selectedMajor}
              showDropdown={true}
              thin={false}
            />
          </div>
          <div class="column" >
            <SearchableDropdown 
              options={concentrations} 
              label="Concentration"
              onSelectOption={selectedConcentration}
              showDropdown={showConcentration}
              thin={false}
            />
          </div>
          <div class="column" >
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
        <div class="row2">
          <div class="column2"><button>Import Schedule</button></div>
          <div class="column2"><button>Generate My Schedule</button></div>
          <div class="column2">
            <center><table>
              <tr><th><h2>Completed Courses</h2></th></tr>
              <tr><th>-</th></tr>
              <tr><th>-</th></tr>
              <tr><th>A random long string of text for testing purposes</th></tr>
              <tr><th>-</th></tr>
              <tr><th>-</th></tr>
              <tr><th>-</th></tr>
              <tr><th>-</th></tr>
              <tr><th>-</th></tr>
              <tr><th>-</th></tr>
              <tr><th>-</th></tr>
            </table></center>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
