import type {  FC } from 'react'
import { memo } from 'react'
import { useDrag } from 'react-dnd'
import React from 'react'
//@ts-ignore
import "./DraggableCourse.css"
//@ts-ignore
//import { SendBackToList } from './DropTarget.tsx'

export interface CourseProps {
  credits: number
  name: string
  subject: string
  number: number
  semesters: string
  type: string
  SendBackToList(
    course: string
  ): void;
}

export const Course: FC<CourseProps> = memo(function Course({ name, subject, number, type, credits, semesters, SendBackToList }) {
  const [{ opacity}, drag] = useDrag(
    () => ({
      type,
      item: { name, subject, number, type, credits, semesters, SendBackToList },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
      end: (item, monitor) => {
        const didDrop = monitor.didDrop()
        if(!didDrop) {
            console.log("is this what i want?")
            //update course list
            //SendBackToList("name")
        }
      }
    }),
    [name, type],
  )
  return (
    <div ref={drag} style={{opacity }} data-testid="course" className="CourseText">
      {subject}-{number}<br/>{name}<br/>credits: {credits}
    </div>
  )
})
