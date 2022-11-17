import update from 'immutability-helper'
import { createContext, FC, useEffect } from 'react'
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
import { number } from 'prop-types'

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
      const previousCourses = getPreviousSemesterCourses(index);

      // Get all courses in current semester (excluding the course to be added)
      const currentCourses = new Array<string>();
      semesters[index].courses.forEach((x) => {
        currentCourses.push(x.subject + '-' + x.number);
      })

      // Run the prerequisite check on the course
      if (course) {
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

      // Find the course's semester before moving it
      let courseSemesterIndex = -1;
      if (found) {
        semesters.forEach((sem, index) => {
          sem.courses.forEach((c) => {
            if ('' + c.subject + c.number === '' + found.subject + found.number) {
              courseSemesterIndex = index;
            }
          })
        })

      // If all courses pass the preReq check, then update the course lists
      if (preReqCheckCoursesInSemesterAndBeyond(found, courseSemesterIndex)) {
        setCourses(
          update(courses, found ? { $push: [found] } : { $push: [] }),
        )

        // Update semesters to have the course removed
        // TODO TEST THIS TO MAKE SURE IT WORKS AS INTENDED
        let itemArr = new Array<CourseState>();
        if (found) {
          semesters[courseSemesterIndex].courses.forEach((x) => {
            if (x.name !== found.name) {
              itemArr.push(x);
            }
          })
        }
        setSemesters(
          update(semesters, {
            [courseSemesterIndex]: {
              courses: {
                $set: itemArr
              }
            },
          }),
        )
      }
      else {
        // fails to satisfy prerequisites
        console.log('CANNOT MOVE COURSE! FAILS PREREQUISITES');
      }
    }
    else {
      //fails to find course...for some reason
      console.log(`this is bad and shouldn't happen`);
    }
    },
    [courses],
  )

  // This function checks if every course passes the prerequisite check when moving a course
  // out of a semester and into the course bank
  function preReqCheckCoursesInSemesterAndBeyond(courseToRemove: CourseState, courseSemesterIndex: number): boolean {

    // prereqCheck will be used to check prerequisites
    const preReqCheck = new StringProcessing();

    // Get the course names in the previous semesters
    const previousCourses = getPreviousSemesterCourses(courseSemesterIndex);

    // Get the current courses in the current semester
    let currentCourses = getSemesterCourses(courseSemesterIndex);
    let currentCoursesNames = getSemesterCoursesNames(courseSemesterIndex);

    let preReqsSatisfied = true;

    semesters.forEach((currSemester, index) => {
      if (preReqsSatisfied && currSemester.number - 1 >= courseSemesterIndex) {
        // Check every course in the current semester passes the prerequsites
        currentCourses.forEach((x) => {
          preReqsSatisfied = preReqsSatisfied && preReqCheck.courseInListCheck(x.preReq, previousCourses, currentCoursesNames)
        })

        // Append the current semester to the previous courses semester
        currentCoursesNames.forEach((x) => {
          // Additional check to ensure the removed course is not included in the course list
          if (x !== courseToRemove.subject + '-' + courseToRemove.number) {
            previousCourses.push(x);
          }
        })
        
        // Update the current course lists to be for the next semester
        if (index + 1 <= semesters.length) {
          currentCourses = getSemesterCourses(index + 1);
          currentCoursesNames = getSemesterCoursesNames(index + 1);
        }
      }
    })

    return preReqsSatisfied;
  }

  // Get all courses in previous semesters
  // param semesterIndex -> current semester index
  function getPreviousSemesterCourses(semesterIndex: number): Array<string> {
    let previousCourses = new Array();
    semesters.forEach((currSemester) => {
      if (currSemester.number - 1 < semesterIndex) {
        currSemester.courses.forEach((x) => {
          previousCourses.push(x.subject + '-' + x.number);
        })
      }
    })

    return previousCourses;
  }

  // Get all CourseState objects in current semester
  // param semesterIndex -> current semester index
  function getSemesterCourses(semesterIndex: number): Array<CourseState> {
    let semCourses = new Array();
    semesters[semesterIndex].courses.forEach((x) => {
        semCourses.push(x);
    })

    return semCourses;
  }

  // Get all courses (string) in current semester
  // param semesterIndex -> current semester index
  function getSemesterCoursesNames(semesterIndex: number): Array<string> {
    let semCourses = new Array();
    semesters[semesterIndex].courses.forEach((x) => {
          semCourses.push(x.subject + '-' + x.number);
    })

    return semCourses;
  }

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
