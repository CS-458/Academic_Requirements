import { CSSProperties, FC, useState } from "react";
import { memo } from "react";
import { useDrop } from "react-dnd";
import React from "react";
//@ts-ignore
import { Course } from "./DraggableCourse.tsx";
import { ItemTypes } from "./Constants";
import ErrorPopup from "./ErrorPopup";
import { process_params } from "express/lib/router";
//styling for the semester
const style: CSSProperties = {
  height: "12rem",
  width: "20%",
  marginRight: ".5rem",
  marginBottom: ".5rem",
  color: "white",
  padding: "1rem",
  textAlign: "center",
  fontSize: "1rem",
  lineHeight: "normal",
  float: "left",
};

export interface SemesterProps {
  accept: Course;
  lastDroppedItem?: any;
  onDrop: (item: any) => void;
  semesterNumber: number;
  courses: Course[];
}

export const Semester: FC<SemesterProps> = memo(function Semester({
  accept,
  lastDroppedItem,
  onDrop,
  semesterNumber,
  courses,
}) {
  //defines the drop action
  const [{ isOver }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  //Changes the background color when you're hovering over the semester
  const isActive = isOver;
  var LowWarning = false;
  var HighWarning = false;
  var isWarning = false;
  let backgroundColor = "#222";
  if (isActive) {
    backgroundColor = "darkgreen";
  }

  const getTotalCredits = () => {
    var SemesterCredits = 0;
    courses.forEach((x) => {
      SemesterCredits += Number(x.credits);
    });

    if (SemesterCredits <= 11 && SemesterCredits > 0) {
      LowWarning = true;
      isWarning = true;
    }
    if (SemesterCredits >= 19) {
      HighWarning = true;
      isWarning = true;
    }

    return SemesterCredits;
  };

  const GetWarning = () => {
    let warnState: string = "";
    if (!isWarning) {
      warnState = "";
    } else if (isWarning && LowWarning) {
      warnState = "LOW";
    } else if (isWarning && HighWarning) {
      warnState = "HIGH";
    }
    return warnState;
  };

  return (
    <div
      ref={drop}
      style={{ ...style, backgroundColor }}
      data-testid="semester"
    >
      {isActive ? "Release to drop" : `Semester ${semesterNumber}`}
      <br />
      {`Credits ${getTotalCredits()}`}
      {isWarning ? ` (${GetWarning()})` : `${GetWarning()}`}

      {courses &&
        courses.map(
          ({ name, subject, number, semesters, credits, preReq }, index) => (
            <Course
              name={name}
              subject={subject}
              number={number}
              semesters={semesters}
              type={ItemTypes.COURSE}
              credits={credits}
              preReq={preReq}
              dragSource={"Semester " + (semesterNumber - 1)}
              key={index}
            />
          )
        )}
    </div>
  );
});
