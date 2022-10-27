import React, { useEffect, useState } from "react";
import "./App.css";
import InputPage from "./components/InputPage.tsx";
import FourYearPlanPage from "./components/FourYearPlanPage.tsx";

function App() {
  /* Variables to store necessary info */
  const [clickedGenerate, setClickedGenerate] = useState();
  const [previouslyTakenCourses, setPreviouslyTakenCourses] = useState();
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

    //TODO run query with major and concentration
  }

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
