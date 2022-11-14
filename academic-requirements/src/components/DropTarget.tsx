import update from 'immutability-helper'
import type { FC } from 'react'
import { memo, useCallback, useState } from 'react'
//@ts-ignore
import { Course } from './DraggableCourse.tsx'
//@ts-ignore
import { Semester } from './Semester.tsx'
import { ItemTypes } from './Constants'
import FourYearPlanPage from './FourYearPlanPage'
import React from 'react'

interface SemesterState {
  accepts: string[]
  lastDroppedItem: any
}

interface CourseState {
  name: string
  acronym: string
  number: number
  type: string
}

export interface SemesterSpec {
  accepts: string[]
  lastDroppedItem: any
}
export interface CourseSpec {
  name: string
  acronym: string
  number: number
  type: string
}
export interface ContainerState {
  droppedCourseNames: string[]
  semesters: SemesterSpec[]
  courses: CourseSpec[]
}

export const Container: FC = memo(function Container() {
  const [semesters, setSemesters] = useState<SemesterState[]>([
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null },
  ])

  const [courses] = useState<CourseState[]>([
    { name: 'COURSE 1', acronym: "CS", number: 141, type: ItemTypes.COURSE },
    { name: 'COURSE 2', acronym: "CS", number: 144, type: ItemTypes.COURSE },
    { name: 'COURSE 3', acronym: "AMCS", number: 244, type: ItemTypes.COURSE },
  ])

  const [droppedCourseNames, setDroppedCourseNames] = useState<string[]>([])

  function isDropped(courseName: string) {
    return droppedCourseNames.indexOf(courseName) > -1
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
              $set: item,
            },
          },
        }),
      )
    },
    [droppedCourseNames, semesters],
  )

  return (
    <div>
      <div style={{ overflow: 'hidden', clear: 'both' }}>
        {semesters.map(({ accepts, lastDroppedItem }, index) => (
          <Semester
            accept={accepts}
            lastDroppedItem={lastDroppedItem}
            onDrop={(item) => handleDrop(index, item)}
            key={index}
          />
        ))}
      </div>

      <div style={{ overflow: 'hidden', clear: 'both' }}>
        {courses.map(({ name, acronym, number, type }, index) => (
          <Course
            name={name}
            acronym={acronym}
            number={number}
            type={type}
            isDropped={isDropped(name)}
            key={index}
          />
        ))}
      </div>
    </div>
  )
})
