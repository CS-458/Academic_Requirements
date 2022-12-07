import type { CSSProperties, FC } from "react";
import { useDrop } from "react-dnd";
import React from "react";
//@ts-ignore
import { Course } from "./DraggableCourse.tsx";
import { ItemTypes } from "./Constants";
import { useEffect } from "react";

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
  whiteSpace: "pre"
};

export interface SemesterProps {
  accept: Course;
  lastDroppedItem?: any;
  onDrop: (item: any) => void;
  semesterNumber: number;
  courses: Course[];
  warningPrerequisiteCourses: Course[];
  warningFallvsSpringCourses: Course[];
}

export const Semester: FC<SemesterProps> = function Semester({
  accept,
  lastDroppedItem,
  onDrop,
  semesterNumber,
  courses,
  warningPrerequisiteCourses,
  warningFallvsSpringCourses
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
  let backgroundColor = "#222";
  if (isActive) {
    backgroundColor = "darkgreen";
  }

  return (
    <div
      ref={drop}
      style={{ ...style, backgroundColor }}
      data-testid="semester"
    >
      {isActive ? "Release to drop" : `Semester ${semesterNumber} ${semesterNumber % 2 == 0 ? '\nSpring' : '\nFall'}`}

      {courses &&
        courses.map(
          (course, index) => (
            <Course
              name={course.name}
              subject={course.subject}
              number={course.number}
              semesters={course.semesters}
              type={ItemTypes.COURSE}
              credits={course.credits}
              preReq={course.preReq}
              dragSource={"Semester " + (semesterNumber - 1)}
              key={index}
              warningYellowColor={warningPrerequisiteCourses.find(x => x === course)}
              warningOrangeColor={warningFallvsSpringCourses.find(x => x === course)}
            />
          )
        )}
    </div>
  );
};
