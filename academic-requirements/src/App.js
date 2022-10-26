import React, { useState } from "react";
import "./App.css";
import InputPage from "./components/InputPage.tsx";
import FourYearPlanPage from "./components/FourYearPlanPage.tsx";
import ErrorPopup from "./components/ErrorPopup";
function App() {
  /* Variables to store necessary info */
  const [clickedGenerate, setClickedGenerate] = useState();
  const [previouslyTakenCourses, setPreviouslyTakenCourses] = useState();
  const [major, setMajor] = useState("");
  const [concentration, setConcentration] = useState("");

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
    console.log("Generate Schedule Pressed");
    if (major != "" && concentration != "") {
      setClickedGenerate(true);
      setPreviouslyTakenCourses(previousCourses);
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

    //TODO run query with major and concentration
  }

  return (
    <div>
      <InputPage
        showing={!clickedGenerate}
        onClickGenerate={generateSchedule}
      />
      <FourYearPlanPage showing={clickedGenerate} />
      <ErrorPopup
        onClose={popupCloseHandler}
        show={visibility}
        title="Error"
        error={error}
      />
    </div>
  );
}

export default App;
