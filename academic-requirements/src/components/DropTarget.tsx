import update from 'immutability-helper'
import type { FC } from 'react'
import { memo, useCallback, useState } from 'react'
//@ts-ignore
import { Course } from './DraggableCourse.tsx'
//@ts-ignore
import { Semester } from './Semester.tsx'
//@ts-ignore
import {CourseList} from "./CourseList.tsx"
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

interface CourseListState {
  accepts: string[]
  unDroppedItem: any
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

export interface CourseListSpec {
  accepts: string[]
  unDroppedItem: any
}

export interface ContainerState {
  droppedCourses: Course[]
  semesters: SemesterSpec[]
  courses: CourseSpec[]
}

export interface ContainerProps {
  PassedCourseList:{
  credits: number
  name: string
  number: number
  semesters: string
  subject: string
}[]
};

export const Container: FC<ContainerProps> = memo(function Container({
  PassedCourseList
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

  const [courses, setCourses] = useState<CourseState[]>(PassedCourseList)

  const [droppedCourses, setDroppedCourses] = useState<CourseState[]>([])

  const [courseListElem, setCourseListElem] = useState<CourseListState[]>([
    {accepts: [ItemTypes.COURSE], unDroppedItem:null}
  ])

  const handleRemoveItem = (e) => {
    setCourses(courses.filter(item => item.name !== e));
  }
  const handleDrop = useCallback(
    (index: number, item: { name: string }) => {
      const { name } = item
      let course = courses.find(item => item.name === name)
       setDroppedCourses(
         update(droppedCourses, course ? { $push: [course] } : { $push: [] }),
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
    [semesters],
  )
  const handleReturnDrop = useCallback(
    (item:{name:string}) =>{
      const {name}=item
      const found = droppedCourses.find(course => course.name === name)
      setDroppedCourses(courses.filter(item => item.name !== name));
      console.log(JSON.stringify(found))
      setCourses(
        update(courses, found ? { $push: [found] } : { $push: [] }),
      )
    },
    [courses],
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
            number={number}
            key={index}
          />
        ))}
      </div> 
       <div style={{ overflow: 'hidden', clear: 'both' }} className="class-dropdown">
       {courseListElem.map(({ accepts}, index) => (
          <CourseList
            accept={accepts}
            onDrop={(item) => handleReturnDrop(item)}
            courses= {courses}
            key={index}
          />
        ))}
 
        </div>
      </div>
    </div>
  )
})
