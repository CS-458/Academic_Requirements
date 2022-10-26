import React, { useState, useEffect } from "react";
import "./App.css";
import InputPage from "./components/InputPage.tsx";
import FourYearPlanPage from "./components/FourYearPlanPage.tsx";

function App() {
  /* Variables to store necessary info */
  const [clickedGenerate, setClickedGenerate] = useState();
  const [previouslyTakenCourses, setPreviouslyTakenCourses] = useState();

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

  const [major, setMajor] = useState("");
  const [concentration, setConcentration] = useState("");

  // Processes when the user clicks to generate the schedule
  function generateSchedule(major, concentration, previousCourses) {
    console.log("Generate Schedule Pressed");
    setClickedGenerate(true);
    setPreviouslyTakenCourses(previousCourses);
    setMajor(major);
    setConcentration(concentration);

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

  // Gets the majors from the database, runs on start-up
  useEffect(() => {
    fetch("/major")
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
  }, []);

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
  }, [majorCode]);

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
        // Sets concentrationCourseData to the result from the query
        setConcentrationCourseData(result);
      });
  }, [concentrationCode]);

  // Gets the 'idMajor' relating to the 'name' of the selected major
  // Runs when major is updated
  useEffect(() => {
    for (let i = 0; i < majorData.length; i++) {
      if (majorDisplayData[i] == major) {
        // Sets the majorCode to the 'idMajor' of the selected major
        setMajorCode(majorData[i].idMajor);
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
      }
    }
  }, [concentration]);

  return (
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
      />
      <FourYearPlanPage
        showing={clickedGenerate}
        concentrationCourseList={concentrationCourseData}
        majorCourseList={majorCourseData}
      />
    </div>
  );
}

export default App;
