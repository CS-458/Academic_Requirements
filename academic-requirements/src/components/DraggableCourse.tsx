import type { FC } from "react";
import { memo } from "react";
import { useDrag } from "react-dnd";
import React from "react";
import clsx from "clsx";
import "./DraggableCourse.css";

//defines the expected course properties
export interface CourseProps {
  credits: number;
  name: string;
  subject: string;
  number: number;
  semesters: string;
  type: string;
  preReq: string;
  dragSource: string;
  warningYellowColor: boolean;
  warningOrangeColor: boolean;
}

export const Course: FC<CourseProps> = memo(function Course({
  name,
  subject,
  number,
  type,
  credits,
  semesters,
  preReq,
  dragSource,
  warningYellowColor,
  warningOrangeColor
}) {
  //defines the drag action
  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: {
        name,
        subject,
        number,
        type,
        credits,
        semesters,
        preReq,
        dragSource,
        warningYellowColor,
        warningOrangeColor
      },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, type, dragSource] //what is collected by the semester and course list when you drop it
  );
  return (
    <div
      ref={drag}
      style={{ opacity }}
      data-testid="course"
      className={clsx("CourseText", warningYellowColor && "CourseWarningYellow", warningOrangeColor && "CourseWarningOrange")}
    >
      {/* {isDropped ? <s>{name}</s> : name}  */}
      {subject}-{number}
      <br />
      {name}
      <br />
      credits: {credits}
    </div>
  );
});
