import React from "react";
import {useDrag} from "react-dnd";
import ItemTypes from './Constants'
import "./DraggableCourse.css";
function DraggableCourse(props: {
  courseNumber: string,
  courseAcronym: string,
  courseName: string,
  isDragging,
}){

  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.COURSE,
      item: props.courseName,
      collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1
      })
    }))
  return(
    <div ref={dragRef} style={{ opacity }} className="CourseText">
      {props.courseAcronym}-{props.courseNumber}<br/>
      {props.courseName}
    </div>
  )
};
export default DraggableCourse;