import React, { useState } from "react";
import ErrorPopup from "./ErrorPopup";
//@ts-ignore
import DraggableCourse from "./DraggableCourse.tsx"

const FourYearPlanPage = (props: {
  showing: boolean;
  majorCourseList: {
    credits: number;
    name: string;
    number: number;
    semesters: string;
    subject: string;
  }[];
  concentrationCourseList: {
    credits: number;
    name: string;
    number: number;
    semesters: string;
    subject: string;
  }[];
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
          <div className="grid-container">
            <div className="semesters-container">
              <div className="grid-item">Semester 1</div>
              <div className="grid-item">Semester 2</div>
              <div className="grid-item">Semester 3</div>
              <div className="grid-item">Semester 4</div>
              <div className="grid-item">Semester 5</div>
              <div className="grid-item">Semester 6</div>
              <div className="grid-item">Semester 7</div>
              <div className="grid-item">Semester 8</div>
            </div>
            <div className="class-dropdown">
              {props.majorCourseList.map((course, index) => {
                return <div key={index}>{course.name}</div>;
              })}
              {props.concentrationCourseList.map((course, index) => {
                return <div key={index}>{course.name}</div>;
              })}
            </div>
            <div className="right-side">
              <div className="requirements">Requirements</div>
              <DraggableCourse 
              CourseAcronym="CS"
              CourseNumber="141"
              CourseName="Intro to Computer Science with lots of extra text for testing"
              />
              <button>Export Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FourYearPlanPage;
