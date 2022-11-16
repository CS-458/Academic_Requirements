import update from 'immutability-helper'
import type { FC } from 'react'
import { memo, useCallback, useState, useContext } from 'react'
//@ts-ignore
import { Course } from './DraggableCourse.tsx'
//@ts-ignore
import { Semester } from './Semester.tsx'
import { ItemTypes } from './Constants'
import React from 'react'

interface SemesterState {
  accepts: string[]
  lastDroppedItem: any
  number:number
}

interface CourseState {
  credits: number
  name: string
  number: number
  semesters: string
  subject: string
}

export interface SemesterSpec {
  accepts: string[]
  lastDroppedItem: any
  number: number
}
export interface CourseSpec {
  credits: number
  name: string
  number: number
  semesters: string
  subject: string
}

export interface ContainerState {
  droppedCourses: Course[]
  semesters: SemesterSpec[]
  courses: CourseSpec[]
}

export interface ContainerProps {
  CourseList:{
  credits: number
  name: string
  number: number
  semesters: string
  subject: string
}[]
};

export const Container: FC<ContainerProps> = memo(function Container({
  CourseList
})  {
  const [semesters, setSemesters] = useState<SemesterState[]>([
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 1 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 2 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 3 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 4 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 5 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 6 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 7 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 8 },
  ])
  const [courses, setCourses] = useState<CourseState[]>(CourseList)
  function SendBackToList(course: string) {
    console.log(course)
    console.log("here")
    //setCourses(courses.push(course))

   }

  const [droppedCourseNames, setDroppedCourseNames] = useState<string[]>([])

  function isDropped(courseName: string) {
    return droppedCourseNames.indexOf(courseName) > -1
  }
  const handleRemoveItem = (e) => {
    setCourses(courses.filter(item => item.name !== e));
  }
  const handleDrop = useCallback(
    (index: number, item: { name: string }) => {
      const { name } = item
      setDroppedCourseNames(
        update(droppedCourseNames, name ? { $push: [name] } : { $push: [] }),
      )
      setSemesters(
        update(semesters, {
          [index]: {
            lastDroppedItem: {
              $set: item
            },
          },
        }),
      )
      handleRemoveItem(name)
    },
    [droppedCourseNames, semesters],
  )

  return (
    <div>
      <div className="drag-drop">
      <div style={{ overflow: 'hidden', clear: 'both' }}>
        {semesters.map(({ accepts, lastDroppedItem, number }, index) => (
          <Semester
            accept={accepts}
            lastDroppedItem={lastDroppedItem}
            onDrop={(item) => handleDrop(index, item)}
            key={index}
            number={number}
          />
        ))}
      </div> 
       <div style={{ overflow: 'hidden', clear: 'both' }} className="class-dropdown">
        {courses.map(({ name, subject, number }, index) => (
          <Course
            name={name}
            subject={subject}
            number={number}
            type= {ItemTypes.COURSE}
            SendBackToList={SendBackToList}
            key={index}
          />  
        ))}  
        </div>
      </div>
    </div>
  )
})
