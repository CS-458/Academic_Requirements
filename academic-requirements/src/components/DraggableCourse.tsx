import Draggable from 'react-draggable';
import React from "react";
import "./DraggableCourse.css";

const DraggableCourse = (props: {
  CourseAcronym: string;
  CourseNumber: string;
  CourseName: string;
}) => {
    var eventLogger = (e: MouseEvent, data: Object) => {
        console.log('Event: ', e);
        console.log('Data: ', data);
      };

      function handleStart(){
        console.log("grabbed");
        //TODO check if moving FROM a semester
      }
      function handleDrag(event){
        console.log("dragging");
        //event.dataTransfer.setData()
      }
      function handleStop(){
        console.log("dropped");
        //TODO check if it has been placed in a semester
      }

    return(
            <Draggable
            axis="both"
            scale={1}
            onStart={handleStart}
            onDrag={handleDrag}
            onStop={handleStop}
            >
                <div className="CourseText">
                    {props.CourseAcronym }-{props.CourseNumber}<br/>{props.CourseName}
                </div>
            </Draggable>
    );
};
export default DraggableCourse;