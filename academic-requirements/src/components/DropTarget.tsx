import update from 'immutability-helper';
import React from "react";
import type { FC } from 'react';
import { memo, useCallback, useState } from 'react';
import { useDrop } from 'react-dnd'
//@ts-ignore
import { Course } from './DraggableCourse.tsx';
import {ItemTypes} from './Constants.js';

const style = {
  width: 400,
}

export interface ContainerState {
  courses: any[]
}

const ITEMS = [
  {
    id: 1,
    courseName: 'Write a cool JS library',
    courseNumber: 141,
    courseAcronym: "CS",
  },
  {
    id: 2,
    courseName: 'Write a cool JS library',
    courseNumber: 204,
    courseAcronym: "CS",
  },
  {
    id: 3,
    courseName: 'Write README',
    courseNumber: 205,
    courseAcronym: "AHH",
  },
  {
    id: 4,
    courseName: 'Create some examples',
    courseNumber: 214,
    courseAcronym: "AMCS",
  },
  {
    id: 5,
    courseName: 'Spam in Twitter and IRC to promote it',
    courseNumber: 244,
    courseAcronym: "Pysc",
  },
  {
    id: 6,
    courseName: '???',
    courseNumber: 304,
    courseAcronym: "Math",
  },
  {
    id: 7,
    courseName: 'PROFIT',
    courseNumber: 574,
    courseAcronym: "Help",
  },
]

export const Container: FC = memo(function Container() {
  const [courses, setCourses] = useState(ITEMS)

  const findCourse = useCallback(
    (id: string) => {
      const course = courses.filter((c) => `${c.id}` === id)[0] as {
        id: number
        courseName: string
        courseNumber: number
        courseAcronym: string
      }
      return {
        course,
        index: courses.indexOf(course),
      }
    },
    [courses],
  )

  const moveCourse = useCallback(
    (id: string, atIndex: number) => {
      const { course, index } = findCourse(id)
      setCourses(
        update(courses, {
          $splice: [
            [index, 1],
            [atIndex, 0, course],
          ],
        }),
      )
    },
    [findCourse, courses, setCourses],
  )

  const [, drop] = useDrop(() => ({ accept: ItemTypes.COURSE }))
  return (
    <div ref={drop} style={style}>
      {courses.map((course) => (
        <Course
          key= {course.id}
          id={'${course.id}'}
          courseNumber={course.courseNumber}
          courseName={course.courseName}
          courseAcronym={course.courseAcronym}
          moveCourse={moveCourse}
          findCourse={findCourse}
        />
      ))}
    </div>
  )
})
