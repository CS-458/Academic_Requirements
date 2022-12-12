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
  genEdCourseList: {
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

  return (
    <div>
      {props.showing && (
        <div className="screen">
          <div className="four-year-plan" data-testid="scheduleContent">
            <h1>Academic Planner</h1>
          </div>
          <ErrorPopup
            onClose={popupCloseHandler}
            show={visibility}
            title="Error"
            error={error}
          />
          <div className="page">
            <Example
              PassedCourseList={props.majorCourseList
                .concat(props.concentrationCourseList)
                .concat(props.genEdCourseList)}
              CompletedCourses={props.completedCourses}
              selectedMajor={props.selectedMajor}
              selectedConcentration={props.selectedConcentration}
            />
            <div className="right-side">
              <div className="requirements">Requirements</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FourYearPlanPage;
