import React, { useEffect, useState } from "react";
//@ts-ignore
import ErrorPopup from "./ErrorPopup";
//@ts-ignore
//import Example from "./example.ts";
//@ts-ignore
import FourYearPlanPage from "./FourYearPlanPage.tsx";
const PassThrough = (props: {
  importData: {};
  showing: boolean;
  majorCourseList: {
    credits: number;
    name: string;
    number: number;
    semesters: string;
    subject: string;
    preReq: string;
    category: string;
    id: number;
    idCategory: number;
  }[];
  concentrationCourseList: {
    credits: number;
    name: string;
    number: number;
    semesters: string;
    subject: string;
    preReq: string;
    category: string;
    id: number;
    idCategory: number;
  }[];
  genEdCourseList: {
    credits: number;
    name: string;
    number: number;
    semesters: string;
    subject: string;
    preReq: string;
    category: string;
    id: number;
    idCategory: number;
  }[];
  completedCourses: {
    Course: string[];
  }[];
  selectedMajor: string;
  selectedConcentration: string;
  requirements: {
    courseCount: number;
    courseReqs: string;
    creditCount: number;
    idCategory: number;
    name: string;
    parentCategory: number;
  }[];
  requirementsGen: {
    courseCount: number;
    courseReqs: string;
    creditCount: number;
    idCategory: number;
    name: string;
    parentCategory: number;
  }[];
  fourYearPlan: {};
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
            <FourYearPlanPage
              PassedCourseList={props.majorCourseList
                .concat(props.concentrationCourseList)
                .concat(props.genEdCourseList)}
              CompletedCourses={props.completedCourses}
              selectedMajor={props.selectedMajor}
              selectedConcentration={props.selectedConcentration}
              requirements={props.requirements}
              requirementsGen={props.requirementsGen}
              fourYearPlan={props.fourYearPlan}
              importData={props.importData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PassThrough;
