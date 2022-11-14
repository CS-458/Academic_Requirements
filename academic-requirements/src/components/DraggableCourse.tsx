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
      {/* {isDropped ? <s>{name}</s> : name} */}
      {acronym}-{number}<br/>{name}
    </div>
  )
})

// export interface CourseProps {
//   id: string
//   courseName: string
//   courseNumber:number
//   courseAcronym: string
//   courseCredits: number
//   semestersOffered: string
//   moveCourse: (id: string, to: number) => void
//   findCourse: (id: string) => { index: number }
// }

// interface Item {
//   id: string
//   originalIndex: number
// }

// export const Course: FC<CourseProps> = memo(function C({
//   id,
//   courseName,
//   courseNumber,
//   courseAcronym,
//   courseCredits,
//   semestersOffered,
//   //moveCourse,
//   //findCourse,
// }) {
//  // const originalIndex = findCourse(id).index
//   const [{ isDragging }, drag] = useDrag(
//     () => ({
//       type: ItemTypes.COURSE,
//       item: { id, originalIndex },
//       collect: (monitor) => ({
//         isDragging: monitor.isDragging(),
//       }),
//       end: (item, monitor) => {
//         const { id: droppedId, originalIndex } = item
//         const didDrop = monitor.didDrop()
//         if (!didDrop) {
//           moveCourse(droppedId, originalIndex)
//         }
//       },
//     }),
//     [id, originalIndex, moveCourse],
//   )

//   const [, drop] = useDrop(
//     () => ({
//       accept: ItemTypes.COURSE,
//       hover({ id: draggedId }: Item) {
//         if (draggedId !== id) {
//           const { index: overIndex } = findCourse(id)
//           moveCourse(draggedId, overIndex)
//         }
//       },
//     }),
//     [findCourse, moveCourse],
//   )

//   const opacity = isDragging ? 0 : 1
//   const cursor = isDragging ? "point" : "grab"
//   return (
//     <div ref={(node) => drag(drop(node))} style={{ opacity, cursor }} className="CourseText">
//       {courseAcronym}-{courseNumber}<br/>{courseName}<br/>{courseCredits} Credits
//     </div>
//   )
// })
