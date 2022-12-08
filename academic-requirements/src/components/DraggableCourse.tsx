import type { FC } from "react";
import { memo } from "react";
import { useDrag } from "react-dnd";
import React from "react";
import "./DraggableCourse.css";
import { func } from "prop-types";

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
  id: number;
  idCategory: number;
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
  id,
  idCategory,
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
        id,
        idCategory,
      },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, type, dragSource] //what is collected by the semester and course list when you drop it
  );

  // Gets the URL to the UW Stout Bulletin for the given Course
  function getURL(subject, number) {
    var URL =
      "https://bulletin.uwstout.edu/content.php?filter%5B27%5D=" +
      subject +
      "&filter%5B29%5D=" +
      number +
      "&filter%5Bcourse_type%5D=-1&filter%5Bkeyword%5D=&filter%5B32%5D=1&filter%5Bcpage%5D=1&cur_cat_oid=21&expand=&navoid=544&search_database=Filter#acalog_template_course_filter";
    return URL;
  }

  return (
    <div
      ref={drag}
      style={{ opacity }}
      data-testid="course"
      className="CourseText"
    >
      {/* {isDropped ? <s>{name}</s> : name}  */}
      {subject}-{number}
      <br />
      {name}
      <br />
      credits: {credits}
      <br />
      <a href={getURL(subject, number)} target="_blank">
        Description
      </a>
    </div>
  );
});
