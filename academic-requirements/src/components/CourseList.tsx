import type { CSSProperties, FC } from 'react'
import { memo } from 'react'
import { useDrop } from 'react-dnd'
import React from 'react'
//@ts-ignore
import {Course} from './DraggableCourse.tsx'
const style: CSSProperties = {
  height: '12rem',
  width: '20%',
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
  lastDroppedItem?: any
  onDrop: (item: any) => void
  number: number
}

export const CourseListElement: FC<CourseListProps> = memo(function CourseList({
  accept,
  lastDroppedItem,
  onDrop,
  number,
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

  return (
    <div ref={drop} style={{ ...style, backgroundColor }}>
      {isActive
        ? 'Release to drop'
        : `CourseList ${number}`}

      {lastDroppedItem && (
        <Course
            name={lastDroppedItem["name"]}
            subject={lastDroppedItem["subject"]}
            number={lastDroppedItem["number"]}
            type= {lastDroppedItem["type"]}
            isDropped={lastDroppedItem["isDropped"]}
            key={lastDroppedItem["index"]}
        />
      )}
  
    </div>
  )
})