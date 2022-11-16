import React, { useEffect, useState } from "react";
import ErrorPopup from "./ErrorPopup";
//@ts-ignore
import SearchableDropdown from "./SearchableDropdown.tsx";
//@ts-ignore
//import categories from "../mockDataLists/Categories.tsx";
import { monitorEventLoopDelay } from "perf_hooks";
//@ts-ignore
import Example from './example.ts'
const FourYearPlanPage = (props: {
  showing: boolean;
  majorCourseList: {
    credits: number;
    name: string;
    number: number;
    semesters: string;
    subject: string;
    category: string;
  }[];
  concentrationCourseList: {
    credits: number;
    name: string;
    number: number;
    semesters: string;
    subject: string;
    category: string;
  }[];
  onClickCategory(category: string): void; //Hovland 7Nov22

}) => {
  //Stuff for category dropdown. Hovland 7Nov22
  const [category, setCategory] = useState(""); //category that is selected
  const [categories, setCategories] = useState<string[]>([]);
  //Functions and variables for controlling an error popup
  const [visibility, setVisibility] = useState(false);
  const popupCloseHandler = () => {
    setVisibility(false);
  };
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("running")
    extractCategories()
  }, [props])

  function throwError(error) {
    setVisibility(true);
    setError(error);
  }
  //SelectedCategory function. Hovland7Nov7
  function selectedCategory(_category) {
    setCategory(_category);
    //New string array created.
    let set = new Array<string>();
    //Iterate through major course list. If the index matches the category, push the course name of the index to array.
    props.majorCourseList.map((course, index) => { if (course.category.valueOf() == _category) { set.push(course.name) } })
    //Iterate through concentration course list. If the index matches the category, push the course name of the index to array. 
    //Note: investigate more.
    props.concentrationCourseList.map((course, index) => { if (course.category.valueOf() == _category) { set.push(course.name) } })
    //Display the array contents in log
    console.log(set);
    //Find way to display this on the screen.
  }
  //setSelectedCategory function. Hovland 7Nov22
  function setSelectedCategory(_category) {
    setCategory(category);
    //setShowConcentration(true); May be able to delete this line.
    props.onClickCategory(category);
    //setConcentrationOptions(concentrations); May be able to delete this line.
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
    props.majorCourseList.map((course, index) => { i.push(course.category) })
    props.concentrationCourseList.map((course, index) => { i.push(course.category) })
    //Remove duplicate categories from the array.
    setCategories(RemoveDuplicates(i))
  }

  return (
    <div>
      {props.showing && (
        <div className="screen">
          <div className="four-year-plan" data-testid="scheduleContent">
            <h1>Academic Planner</h1>
            { <div className="courseDropdowns">

                <SearchableDropdown
                  options={categories}
                  label="Category"
                  onSelectOption={selectedCategory} //If option chosen, selected Category activated.
                  showDropdown={true}
                  thin={true}
                />
              </div> } 

          </div>
          <ErrorPopup
            onClose={popupCloseHandler}
            show={visibility}
            title="Error"
            error={error}
          />

          
               {/* { <div className="courseDropdowns">

                <SearchableDropdown
                  options={categories}
                  label="Category"
                  onSelectOption={selectedCategory} //If option chosen, selected Category activated.
                  showDropdown={true}
                  thin={true}
                />
              </div> }  */}

          <div className="page">
           <Example
            PassedCourseList = {props.majorCourseList}
           /> 
            <div className="right-side">
              <div className="requirements">Requirements</div>
              <button>Export Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FourYearPlanPage;
