import { CSSProperties, FC } from "react";
import { useDrop } from "react-dnd";
import React from "react";
//@ts-ignore
import { Course } from "./DraggableCourse.tsx";
import { ItemTypes } from "./Constants";

//styling for the semester
const style: CSSProperties = {
  height: "15rem",
  width: "18.5%",
  marginRight: ".5rem",
  marginBottom: ".5rem",
  color: "white",
  padding: "1rem",
  textAlign: "center",
  fontSize: "1rem",
  lineHeight: "normal",
  float: "left",
  whiteSpace: "pre",
  background: "#004990",
  borderRadius: ".5rem",
  overflow: "auto",
};

export interface SemesterProps {
  accept: Course;
  lastDroppedItem?: any;
  onDrop: (item: any) => void;
  semesterNumber: number;
  courses: Course[];
  warningPrerequisiteCourses: Course[];
  warningFallvsSpringCourses: Course[];
  warningDuplicateCourses: Course[];
}

export const Semester: FC<SemesterProps> = function Semester({
  accept,
  lastDroppedItem,
  onDrop,
  semesterNumber,
  courses,
  warningPrerequisiteCourses,
  warningFallvsSpringCourses,
  warningDuplicateCourses,
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
  let backgroundColor = "#004990";
  if (isActive) {
    backgroundColor = "darkgreen";
  }

  // Gets the total number of credits per semester and throws
  // proper warning dependant on the number of credits
  // <12 = Low 12 - 18 No Warning 18< High
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

  // Checks if there is a warning, if warning exists select and return proper warning
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
      {isActive
        ? "Release to drop"
        : `Semester ${semesterNumber} ${
            semesterNumber % 2 == 0 ? "\nSpring\n" : "\nFall\n"
          }`}
      {`Credits ${getTotalCredits()}`}
      {isWarning ? ` (${GetWarning()})` : `${GetWarning()}`}

      {courses &&
        courses.map((course, index) => (
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
            warningYellowColor={warningPrerequisiteCourses.find(
              (x) => x === course
            )}
            warningOrangeColor={warningFallvsSpringCourses.find(
              (x) => x === course
            )}
            warningRedColor={warningDuplicateCourses.find((x) => x === course)}
          />
        ))}
    </div>
  );
};
