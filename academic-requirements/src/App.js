import React, { useState, useEffect } from "react";
import "./App.css";
import InputPage from "./components/InputPage.tsx";
import FourYearPlanPage from "./components/FourYearPlanPage.tsx";



function App() {
  const [majorData, setMajorData] = useState([]);
  const [concentrationData, setConcentrationData] = useState([]);
  const [majorCourseData, setMajorCourseData] = useState([]);
  const [concentrationCourseData, setConcentrationCourseData] = useState([]);

  /* Variables to store necessary info */
  const [clickedGenerate, setClickedGenerate] = useState();
  const [previouslyTakenCourses, setPreviouslyTakenCourses] = useState();

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


    //TODO run query with major and concentration
  }

    useEffect(() => {
      fetch("/major")
      .then(res => res.json())
      .then((result) => {
        setMajorData(result)
      })
    }, [])

    useEffect(() => {
        fetch(`/concentration?majid=${major}`)
      .then(res => res.json())
      .then((result) => {
        setConcentrationData(result)
      })
    }, [major])

    useEffect(() => {
      fetch(`/courses/major?majid=${major}`)
    .then(res => res.json())
    .then((result) => {
      setMajorCourseData(result)
    })
  }, [major])

    useEffect(() => {
      fetch(`/courses/concentration?conid=${concentration}`)
    .then(res => res.json())
    .then((result) => {
      setConcentrationCourseData(result)
    })
  }, [concentration])



  return (
    <div>
      <InputPage
        showing={!clickedGenerate}
        onClickGenerate={generateSchedule}
      />
      <FourYearPlanPage showing={clickedGenerate} />
    </div>
  );
}

export default App;
