import update from 'immutability-helper'
import type { FC } from 'react'
import { memo, useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'
import React from 'react'
//@ts-ignore
import { Card } from './DraggableCourse.tsx'
//@ts-ignore
import { ItemTypes } from './Constants.js'

const style = {
  width: 400,
}

export interface ContainerState {
  cards: any[]
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
  const [cards, setCards] = useState(ITEMS)

  const findCard = useCallback(
    (id: string) => {
      const card = cards.filter((c) => `${c.id}` === id)[0] as {
        id: number
        courseNumber: number
        courseName: string
        courseAcronym: string
      }
      return {
        card,
        index: cards.indexOf(card),
      }
    },
    [cards],
  )

  const moveCard = useCallback(
    (id: string, atIndex: number) => {
      const { card, index } = findCard(id)
      setCards(
        update(cards, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        }),
      )
    },
    [findCard, cards, setCards],
  )

  const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }))
  return (
    <div ref={drop} style={style}>
      {cards.map((card) => (
        <Card
          key={card.id}
          id={`${card.id}`}
          courseName={card.courseName}
          courseNumber={card.courseNumber}
          courseAcronym={card.courseAcronym}
          moveCard={moveCard}
          findCard={findCard}
        />
      ))}
    </div>
  )
})
