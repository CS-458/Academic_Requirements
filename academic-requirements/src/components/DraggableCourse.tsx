import type { CSSProperties, FC } from 'react'
import { memo } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import React from 'react'
//@ts-ignore
import { ItemTypes } from './Constants.js'
import "./DraggableCourse.css"

export interface CourseProps {
  name: string
  acronym: string
  number: number
  type: string
  isDropped: boolean
}

export const Course: FC<CourseProps> = memo(function Course({ name, acronym, number, type, isDropped }) {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: { name, acronym, number },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, type],
  )

  return (
    <div ref={drag} style={{opacity }} data-testid="course" className="CourseText">
      {/* {isDropped ? <s>{name}</s> : name}  */}
      {acronym}-{number}<br/>{name}
    </div>
  )
})
