import update from 'immutability-helper'
import { FC, useEffect } from 'react'
import { memo, useCallback, useState } from 'react'
//@ts-ignore
import { Course } from './DraggableCourse.tsx'
//@ts-ignore
import { Semester } from './Semester.tsx'
//@ts-ignore
import {CourseList} from "./CourseList.tsx"
//@ts-ignore
import StringProcessing from '../stringProcessing/StringProcessing.tsx';
import { ItemTypes } from './Constants'
import React from 'react'

interface SemesterState {
  accepts: string[]
  lastDroppedItem: any
  number:number
  courses: CourseState[]
}

interface CourseState {
  credits: number
  name: string
  number: number
  semesters: string
  subject: string
  preReq: string
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
  preReq: string
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
  preReq: string
}[]
};

export const Container: FC<ContainerProps> = memo(function Container({
  PassedCourseList
})  {
  const [semesters, setSemesters] = useState<SemesterState[]>([
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 1, courses: [] },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 2, courses: [] },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 3, courses: [] },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 4, courses: [] },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 5, courses: [] },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 6, courses: [] },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 7, courses: [] },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 8, courses: [] },
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
      
      let itemArr = new Array<CourseState>();
      if (course) {
        itemArr.push(course);
      }

      // prereqCheck will be used to check prerequisites
      const prereqCheck = new StringProcessing();

      // Get all courses in previous semesters
      const previousCourses = new Array<string>();
      semesters.forEach((currSemester) => {
        if (currSemester.number - 1 < index) {
          currSemester.courses.forEach((x) => {
            previousCourses.push(x.subject + '-' + x.number);
          })
        }
      })

      // Get all courses in current semester (excluding the course to be added)
      const currentCourses = new Array<string>();
      semesters[index].courses.forEach((x) => {
        currentCourses.push(x.subject + '-' + x.number);
      })

      console.log('Courses in previous semesters: ' + previousCourses);
      console.log('Courses in current semester: ' + currentCourses);

      // Run the prerequisite check on the course
      if (course) {
        console.log('prereq string is: ' + course.preReq);
        if (prereqCheck.courseInListCheck(course.preReq, previousCourses, currentCourses)) {
          // prereqCheck returned true, so add the course to the semester
          setSemesters(
            update(semesters, {
              [index]: {
                lastDroppedItem: {
                  $set: item
                },
                courses: {
                  $push: itemArr
                }
              },
            }),
          )
          handleRemoveItem(name);
        }
        else {
          // fails to satisfy prerequisites
          console.log('CANNOT ADD COURSE! FAILS PREREQUISITES');
        }
      }
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
