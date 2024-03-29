import React, { useEffect, useState } from "react";
import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import InputPage from "./components/InputPage.tsx";
import PassThrough from "./components/PassThrough.tsx";
import ErrorPopup from "./components/ErrorPopup";
function App() {
  /* Variables to store necessary info */
  const [clickedGenerate, setClickedGenerate] = useState();

  //majorData is an array of major objects returned from the database
  const [majorData, setMajorData] = useState([]);
  //majorDisplayData is an array of the 'name' of the major objects for display purposes
  const [majorDisplayData, setMajorDisplayData] = useState([]);
  //majorCode is an array of the 'idMajor' of the major objects for query purposes
  const [majorCode, setMajorCode] = useState();

  //concentrationData is an array of concentration objects
  const [concentrationData, setConcentrationData] = useState([]);
  //concentrationDisplayData is an array of the 'name' of the concentration objects
  const [concentrationDisplayData, setConcentrationDisplayData] = useState([]);
  //concentrationCode is an array of the 'idConcentration' of the concentration objects
  const [concentrationCode, setConcentrationCode] = useState();

  //majorCourseData is an array of course objects related to the major
  const [majorCourseData, setMajorCourseData] = useState([]);
  //concentrationCourseData is an array of the course object related to the concentration
  const [concentrationCourseData, setConcentrationCourseData] = useState([]);
  // genEdCourseData is an array of the course object for general education courses
  const [genEdCourseData, setGenEdCourseData] = useState([]);

  const [major, setMajor] = useState("");
  const [concentration, setConcentration] = useState("");

  //requirements for the concentration
  const [requirements, setRequirementsData] = useState([]);

  //general requirements
  const [requirementsGen, setRequirementsGenData] = useState([]);

  // Flag for using a four year plan
  const [useFourYearPlan, setUseFourYearPlan] = useState(false);
  const [fourYearPlan, setFourYearPlan] = useState(null);

  // courseSubjects the array of subject strings from the database
  const [courseSubjects, setCourseSubjects] = useState([]);
  // selectedCourseSubject is the specific course subject selected
  // On update, a useEffect is called to get the respective numbers
  const [selectedCourseSubject, setSelectedCourseSubject] = useState("");
  // courseSubjectNumbers the array of number (as strings) from the database
  const [courseSubjectNumbers, setCourseSubjectNumbers] = useState([]);

  const [coursesTaken, setCoursesTaken] = useState([]);

  //Functions and variables for controlling an error popup
  const [visibility, setVisibility] = useState(false);
  const popupCloseHandler = () => {
    setVisibility(false);
  };
  const [error, setError] = useState("");
  function throwError(error) {
    setVisibility(true);
    setError(error);
  }

  // Processes when the user clicks to generate the schedule
  function generateSchedule(major, concentration, previousCourses) {
    console.log("generate schedule");
    if (major != "" && concentration != "") {
      setClickedGenerate(true);
      setCoursesTaken(previousCourses);
      setMajor(major);
      setConcentration(concentration);
    } else {
      if (major == "") {
        throwError(
          "No major is selected \n Please select a major before continuing."
        );
      } else {
        throwError(
          "No concentration is selected \n Please select a concentration before continuing."
        );
      }
    }
    // Sends information to the console for manual review
    console.log("Major: " + major + ", Concentration: " + concentration);
    console.log("Courses taken: ");
    previousCourses.forEach((course) => {
      console.log(course + ", ");
    });
  }
  // Sets major to the selected major from the dropdown
  function selectMajor(selectedMajor) {
    setMajor(selectedMajor);
  }

  // Sets concentration to the selected concentration from the dropdown
  function selectConcentration(selectedConcentration) {
    setConcentration(selectedConcentration);
  }

  // Runs on startup
  // Get all the data that doesn't need user input
  useEffect(() => {
    fetch("/major") // create similar
      .then((res) => res.json())
      .then((result) => {
        // Sets majorData to result from database query
        setMajorData(result);
        // Gets the 'name' of the major objects
        let temp = [];
        result.forEach((x) => {
          temp.push(x.name);
        });
        // Sets majorDisplayData to the 'name' of the majors
        setMajorDisplayData(temp);
      });
    fetch("/subjects")
      .then((res) => res.json())
      .then((result) => {
        let temp = [];
        result.forEach((x) => {
          temp.push(x.subject);
        });
        //get Course subject data, pass in the result
        setCourseSubjects(temp);
      });
    fetch("/courses/geneds")
      .then((res) => res.json())
      .then((result) => {
        setGenEdCourseData(result);
      });
  }, []);

  // Runs whenever a course subject has been selected
  // Gets the array of course number for that subject from the API
  useEffect(() => {
    fetch(`/subjects/numbers?sub=${selectedCourseSubject}`)
      .then((res) => res.json())
      .then((result) => {
        let temp = [];
        result.forEach((x) => {
          temp.push(x.number);
        });
        setCourseSubjectNumbers(temp);
      });
  }, [selectedCourseSubject]);

  // Gets the concentrations from the database based on the 'idMajor' of the selected major
  // Runs when majorCode is updated
  useEffect(() => {
    fetch(`/concentration?majid=${majorCode}`)
      .then((res) => res.json())
      .then((result) => {
        // Sets concentrationData to result from database query
        setConcentrationData(result);
        // Gets the 'name' of the concentration objects
        let temp = [];
        result.forEach((x) => {
          temp.push(x.name);
        });
        // Sets concentrationDisplayData to the 'name' of the concentrations
        setConcentrationDisplayData(temp);
      });
  }, [majorCode]); // gets called whenever major is updated

  // Gets the courses related to the 'idMajor' of the selected major
  // Runs when majorCode is updated
  useEffect(() => {
    fetch(`/courses/major?majid=${majorCode}`)
      .then((res) => res.json())
      .then((result) => {
        // Sets majorCourseData to the result from the query
        setMajorCourseData(result);
      });
  }, [majorCode]);

  // Gets the courses related to the 'idConcentration' of the selected concentration
  // Runs when concentrationCode is updated
  useEffect(() => {
    fetch(`/courses/concentration?conid=${concentrationCode}`)
      .then((res) => res.json())
      .then((result) => {
        // console.log("result", result);
        // Sets concentrationCourseData to the result from the query
        setConcentrationCourseData(result);
      });
  }, [concentrationCode]);

  //Gets the requirements related to the major/concentration
  useEffect(() => {
    fetch(`/requirements?conid=${concentrationCode}`)
      .then((res) => res.json())
      .then((result) => {
        // Sets concentrationCourseData to the result from the query
        //console.log("requirements", result);
        setRequirementsData(result);
      });
  }, [concentrationCode]);

  //Gets the requirements related to the major/concentration
  useEffect(() => {
    fetch(`/requirements/gen?conid=${concentrationCode}`)
      .then((res) => res.json())
      .then((result) => {
        // Sets concentrationCourseData to the result from the query
        setRequirementsGenData(result);
      });
  }, [concentrationCode]);

  // Gets the 'idMajor' relating to the 'name' of the selected major
  // Runs when major is updated
  useEffect(() => {
    for (let i = 0; i < majorData.length; i++) {
      if (majorDisplayData[i] == major) {
        // Sets the majorCode to the 'idMajor' of the selected major
        setMajorCode(majorData[i].idMajor);
        // Whenever the major is updated, the existing four year plan and concentration
        // are potentially invalid, so reset them.
        setFourYearPlan(null);
        if (!importData) {
          setConcentration(null);
        }
      }
    }
  }, [major]);

  // Gets the 'idConcentration' relating to the 'name' of the selected major
  // Runs when concentration is updated
  useEffect(() => {
    for (let i = 0; i < concentrationData.length; i++) {
      if (concentrationDisplayData[i] == concentration) {
        // Sets the concentrationCode to the 'idConcentration' of the selected concentration
        setConcentrationCode(concentrationData[i].idConcentration);
        setFourYearPlan(JSON.parse(concentrationData[i].fourYearPlan));
      }
    }
  }, [concentration]);

  const [data, setData] = useState(null);

  function importData(data) {
    setData(data);
  }
  useEffect(() => {
    if (data) {
      fetch(`/majorID?mname=${data["Major"]}`)
        .then((res) => res.json())
        .then((result) => {
          // Sets concentrationCourseData to the result from the query
          setMajorCode(result[0].idMajor);
        });
      fetch(`/concentrationID?cname=${data["Concentration"]}`)
        .then((res) => res.json())
        .then((result) => {
          // Sets concentrationCourseData to the result from the query
          setConcentrationCode(result[0].idConcentration);
        });
    }
  }, [data]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <InputPage
          showing={!clickedGenerate}
          onClickGenerate={generateSchedule}
          onClickMajor={selectMajor}
          onClickConcentration={selectConcentration}
          concentrationList={concentrationData}
          majorList={majorData}
          majorDisplayList={majorDisplayData}
          concentrationDisplayList={concentrationDisplayData}
          takenCourses={coursesTaken}
          setTakenCourses={setCoursesTaken}
          setUseFourYearPlan={setUseFourYearPlan}
          concentrationHasFourYearPlan={fourYearPlan != null}
          courseSubjectAcronyms={courseSubjects}
          setSelectedCourseSubject={setSelectedCourseSubject}
          courseSubjectNumbers={courseSubjectNumbers}
          importData={importData}
        />
        <PassThrough
          data-testid="FourYearPage"
          showing={clickedGenerate}
          concentrationCourseList={concentrationCourseData}
          majorCourseList={majorCourseData}
          genEdCourseList={genEdCourseData}
          selectedMajor={major}
          selectedConcentration={concentration}
          completedCourses={coursesTaken}
          requirements={requirements}
          requirementsGen={requirementsGen}
          fourYearPlan={useFourYearPlan ? fourYearPlan : null}
          importData={data}
        />
        <ErrorPopup
          onClose={popupCloseHandler}
          show={visibility}
          title="Error"
          error={error}
        />
      </div>
    </DndProvider>
  );
}

export default App;
