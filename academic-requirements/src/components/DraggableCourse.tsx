import React from "react";
import {ItemTypes} from './Constants';
import "./DraggableCourse.css";
import type { CSSProperties, FC } from 'react';
import { memo } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const style: CSSProperties = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}
export interface DraggableCourse {
  id: string,
  courseNumber: number,
  courseAcronym: string,
  courseName: string,
  moveCourse: (id: string, to: number) => void
  findCourse: (id: string) => { index: number }
}

interface Item {
  id: string
  originalIndex: number
}

export const Course: FC<DraggableCourse> = memo(function Course({
  id,
  courseName,
  courseNumber,
  courseAcronym,
  moveCourse,
  findCourse,
}) {
  const originalIndex = findCourse(id).index
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.COURSE,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item
        const didDrop = monitor.didDrop()
        if (!didDrop) {
          moveCourse(droppedId, originalIndex)
        }
      },
    }),
    [id, originalIndex, moveCourse],
  )

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.COURSE,
      hover({ id: draggedId }: Item) {
        if (draggedId !== id) {
          const { index: overIndex } = findCourse(id)
          moveCourse(draggedId, overIndex)
        }
      },
    }),
    [findCourse, moveCourse],
  )

  const opacity = isDragging ? 0 : 1
  return (
    <div ref={(node) => drag(drop(node))} style={{ ...style, opacity }}>
      {courseAcronym}-{courseNumber}<br/>{courseName}
    </div>
  )
})