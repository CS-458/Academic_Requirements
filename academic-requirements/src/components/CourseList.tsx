import type { CSSProperties, FC } from 'react'
import { memo } from 'react'
import { useDrop } from 'react-dnd'
import React from 'react'
import {ItemTypes} from "./Constants.js"
//@ts-ignore
import {Course} from './DraggableCourse.tsx'
const style: CSSProperties = {
  height: '100%',
  width: '100%',
  marginRight: '.5rem',
  marginBottom: '.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
}

export interface CourseListProps {
  accept: Course
 // unDroppedItem?: any
  onDrop: (item: any) => void
  courses: Course[]
}

export const CourseList: FC<CourseListProps> = memo(function CourseList({
  accept,
  //unDroppedItem,
  onDrop,
  courses,
}) {
  const [{ isOver }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const isActive = isOver 
  let backgroundColor = '#222'
  if (isActive) {
    backgroundColor = 'darkgreen'
  }
console.log(courses)
  return (
    <div ref={drop} style={{ ...style, backgroundColor }}>
      {isActive
        ? 'Release to drop'
        : `CourseList`}
       {courses.map(({ name, subject, number, semesters, credits }, index) => (
          <Course
            name={name}
            subject={subject}
            number={number}
            semesters={semesters}
            credits={credits}
            type= {ItemTypes.COURSE}
            key={index}
          />  
        ))}  
  
    </div>
  )
})