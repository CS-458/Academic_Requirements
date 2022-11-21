import type { CSSProperties, FC } from "react";
import { memo } from "react";
import { useDrop } from "react-dnd";
import React from "react";
//@ts-ignore
import { Course } from "./DraggableCourse.tsx";
import { ItemTypes } from "./Constants";
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
  number: number;
  courses: Course[];
}

export const Semester: FC<SemesterProps> = memo(function Semester({
  accept,
  lastDroppedItem,
  onDrop,
  number,
  courses
}) {
  const [{ isOver }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

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
      {isActive ? "Release to drop" : `Semester ${number}`}

      {courses && courses.map(({name, subject, number, semesters, credits, preReq}, index) => 
        <Course
          name={name}
          subject={subject}
          number={number}
          semesters={semesters}
          type={ItemTypes.COURSE}
          credits={credits}
          preReq={preReq}
          key={index}
        />
      )
    }
    </div>
  );
});
