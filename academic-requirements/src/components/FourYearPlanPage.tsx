import React, { useState } from "react";
//@ts-ignore
import ErrorPopup from "./ErrorPopup";
//@ts-ignore
import Example from "./example.ts";
const FourYearPlanPage = (props: {
  showing: boolean;
  majorCourseList: {
    credits: number;
    name: string;
    number: number;
    semesters: string;
    subject: string;
    preReq: string;
    category: string;
  }[];
  concentrationCourseList: {
    credits: number;
    name: string;
    number: number;
    semesters: string;
    subject: string;
    preReq: string;
    category: string;
  }[];
  completedCourses: {
    Course: string[];
  }[];
  selectedMajor: string;
  selectedConcentration: string;
}) => {
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

  // JSON Data for the Courses
  let info = {
    Major: props.selectedMajor,
    Concentration: props.selectedConcentration,
    "Completed Courses": props.completedCourses,
  };

  // Creates the File and downloads it to user PC
  function exportSchedule() {
    console.log("export");
    const fileData = JSON.stringify(info);
    const blob = new Blob([fileData], { type: "json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "schedule.json";
    link.href = url;
    link.click();
  }

  return (
    <div>
      {props.showing && (
        <div className="screen">
          <div className="four-year-plan" data-testid="scheduleContent">
            <h1>Academic Planner</h1>
          </div>
           { <ErrorPopup
            onClose={popupCloseHandler}
            show={visibility}
            title="Error"
            error={error}
            //Possibly place if statement for popup here.
          /> } 
          <div className="page">
            <Example
              PassedCourseList={props.majorCourseList.concat(
                props.concentrationCourseList
              )}
              CompletedCourses={props.completedCourses}
            />
            <div className="right-side">
              <div className="requirements">Requirements</div>
              <button data-testid="ExportButton" onClick={exportSchedule}>
                Export Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FourYearPlanPage;
