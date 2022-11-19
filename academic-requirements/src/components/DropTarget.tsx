import update from 'immutability-helper'
import type { FC } from 'react'
import { memo, useCallback, useState,useEffect } from 'react'
//@ts-ignore
import { Course } from './DraggableCourse.tsx'
//@ts-ignore
import { Semester } from './Semester.tsx'
//@ts-ignore
import {CourseList} from "./CourseList.tsx"
import { ItemTypes } from './Constants'
import React from 'react'
//@ts-ignore
import SearchableDropdown from "./SearchableDropdown.tsx";

interface SemesterState {
  accepts: string[]
  lastDroppedItem: any
  number:number
}

interface CourseState {
  credits: number
  name: string
  number: number
  semesters: string
  subject: string
  category: string
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
  category: string
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
  category: string
}[]
};

export const Container: FC<ContainerProps> = memo(function Container({
  PassedCourseList
})  {
  const [semesters, setSemesters] = useState<SemesterState[]>([
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 1 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 2 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 3 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 4 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 5 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 6 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 7 },
    { accepts: [ItemTypes.COURSE], lastDroppedItem: null, number: 8 },
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
      setSemesters(
        update(semesters, {
          [index]: {
            lastDroppedItem: {
              $set: item
            },
          },
        }),
      )
      handleRemoveItem(name)
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
   //Stuff for category dropdown.
   const [category, setCategory] = useState(""); //category that is selected
   const [categories, setCategories] = useState<string[]>([]);
   const [coursesInCategory, setcoursesInCategory ]= useState<Course[]>([]); //category that is selected

//SelectedCategory function.
function selectedCategory(_category) {
  setCategory(_category);
  //New string array created.
  let set = new Array<CourseState>();
  //Iterate through major course list. If the index matches the category, push the course name of the index to array.
  courses.map((course, index) => { if (course.category.valueOf() == _category) { set.push(course) } })
  //Iterate through concentration course list. If the index matches the category, push the course name of the index to array. 
  //Display the array contents in log
  setcoursesInCategory(set)
  console.log(set);
}

 //setSelectedCategory function. 
 function setSelectedCategory(_category) {
  setCategory(category);
}

 // RemoveDuplicates function.
 function RemoveDuplicates(strings: string[]): string[] {
  //Push all strings to a set(which disallows duplicates)
  let set = new Set<string>();
  strings.forEach((x) => {
    set.add(x);
  });
  //Reassign all strings in the set to an array.
  let arr = new Array<string>;
  set.forEach((x) => {
    arr.push(x);
  });
  //Return the array.
  return arr;
}

 //extractCategories function.
 function extractCategories() {
  //Initialize new array.
  let i = new Array<string>();
  //map is what loops over the list
  //map calls arrow function, runs whats between curly braces.
  //Push course categories from major and concentration course lists to array.
  courses.map((course, index) => { i.push(course.category) })
  //Remove duplicate categories from the array.
  setCategories(RemoveDuplicates(i))
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
      
       {  <div style={{ overflow: 'hidden', clear: 'both' }} className="class-dropdown">
       {  <div className="courseDropdowns">
          <div onClick={()=>extractCategories()}>
          <SearchableDropdown
            options={categories}
            label="Category"
            onSelectOption={selectedCategory} //If option chosen, selected Category activated.
            showDropdown={true}
            thin={true}
          />
          </div></div> } 
       {courseListElem.map(({ accepts}, index) => (
        
          <CourseList
       
            accept={accepts}
            onDrop={(item) => handleReturnDrop(item)}
            courses= {coursesInCategory}
            key={index}
            
          />
          
        ))}
 
        </div> } 
      </div>
    </div>
  )
})
