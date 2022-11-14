import type { CSSProperties, FC } from 'react'
import { memo } from 'react'
import { useDrop } from 'react-dnd'
import React from 'react'
//@ts-ignore
import Course from './DraggableCourse.tsx'
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

export interface SemesterProps {
  accept: Course
  lastDroppedItem?: any
  onDrop: (item: any) => void
  number: number
}

export const Semester: FC<SemesterProps> = memo(function Semester({
  accept,
  lastDroppedItem,
  onDrop,
  number,
}) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const isActive = isOver && canDrop
  let backgroundColor = '#222'
  if (isActive) {
    backgroundColor = 'darkgreen'
  } else if (canDrop) {
    backgroundColor = 'darkkhaki'
  }

  return (
    <div ref={drop} style={{ ...style, backgroundColor }} data-testid="semester">
      {isActive
        ? 'Release to drop'
        : `Semester ${number}`}

      {lastDroppedItem && (
        <p>Last dropped: {lastDroppedItem["name"]}</p>
      )}
        {/* <Course
            name={name}
            type={type}
            isDropped={isDropped(name)}
            key={index}
        /> */}
    </div>
  )
})