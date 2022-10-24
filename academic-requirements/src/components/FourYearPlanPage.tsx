import React from "react";
// @ts-ignore
//import Table from "./Table.tsx";

const FourYearPlanPage = (props: { showing: boolean }) => {
  return (
    <div>
      {props.showing && 
      <div className="screen">
        <div className="four-year-plan">
          <h1>Academic Planner</h1>
        </div>
        <div className= "grid-container">
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
          <div className="class-dropdown">Class dropdown</div>
          <div className="right-side">
            <div className="requirements">
              Requirements
            </div>            
              <button>Export Schedule</button>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default FourYearPlanPage;
