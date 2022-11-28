import update from "immutability-helper";
import { FC, useEffect } from "react";
import { memo, useCallback, useState } from "react";
//@ts-ignore
import { Course } from "./DraggableCourse.tsx";
//@ts-ignore
import { Semester } from "./Semester.tsx";
//@ts-ignore
import { CourseList } from "./CourseList.tsx";
//@ts-ignore
import StringProcessing from "../stringProcessing/StringProcessing.tsx";
import { ItemTypes } from "./Constants";
import React from "react";
//@ts-ignore
import SearchableDropdown from "./SearchableDropdown.tsx";
import ErrorPopup from "./ErrorPopup";

//Defines the properties that each type should have
interface SemesterState {
  accepts: string[];
  lastDroppedItem: any;
  semesterNumber: number;
  courses: Course[];
}

interface CourseListState {
  accepts: string[];
  unDroppedItem: any;
  courses: Course[];
}

export interface CourseListSpec {
  accepts: string[];
  unDroppedItem: any;
  courses: Course[];
}

export interface ContainerState {
  droppedCourses: Course[];
  semesters: Semester[];
  coursesInCategory: Course[];
  courseListElem: CourseList[];
}

export interface ContainerProps {
  PassedCourseList: {
    credits: number;
    name: string;
    number: number;
    semesters: string;
    subject: string;
    preReq: string;
    category: string;
  }[];
  CompletedCourses:{
    identifier: string;
  }[];
}

export const Container: FC<ContainerProps> = memo(function Container({
  PassedCourseList, //The combination of major, concentration, and gen ed
  CompletedCourses, //List of completed courses in subject-number format
}) {
  const [semestersOld, setSemestersOld] = useState<SemesterState[]>([
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 1,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 2,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 3,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 4,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 5,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 6,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 7,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 8,
      courses: [],
    },
  ]);
  const [semesters, setSemesters] = useState<SemesterState[]>([
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 1,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 2,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 3,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 4,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 5,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 6,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 7,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      semesterNumber: 8,
      courses: [],
    },
  ]);

  //The visibility of the error message
  const [visibility, setVisibility] = useState(false);
  //A master list of all courses for the major, concentration, and gen eds
  const [courses, setCourses] = useState<Course[]>(PassedCourseList);
  //A list of all courses that have been dropped into a semester
  const [droppedCourses, setDroppedCourses] = useState<Course[]>([]);
  //The course list element that allows courses to be dragged out
  const [courseListElem, setCourseListElem] = useState<CourseListState[]>([
    { accepts: [ItemTypes.COURSE], unDroppedItem: null, courses: [] },
  ]);

  //Stuff for category dropdown. Hovland 7Nov22
  const [category, setCategory] = useState(""); //category that is selected
  const [categories, setCategories] = useState<string[]>([]); //list of all categories
  const [coursesInCategory, setcoursesInCategory] = useState<Course[]>([]); //courses in category that is selected

  //SelectedCategory function. Hovland7Nov7
  function selectedCategory(_category) {
    setCategory(_category);
    //New string array created.
    let set = new Array<Course>();
    //Iterate through major course list. If the index matches the category, push the course name of the index to array.
    PassedCourseList.map((course, index) => {
      if (course.category.valueOf() == _category) {
        set.push(course);
      }
    });
    setcoursesInCategory(set);
  }

  //setSelectedCategory function. Hovland 7Nov22
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
    let arr = new Array<string>();
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
    PassedCourseList.map((course, index) => {
      i.push(course.category);
    });
    //Remove duplicate categories from the array.
    setCategories(RemoveDuplicates(i));
  }

  //Handle a drop into a semester from a semester or the course list
  const handleDrop = useCallback(
    (index: number, item: { name: string; dragSource: string }) => {
      const { name } = item;
      const { dragSource } = item;
      let movedFromIndex = -1;
      var course;
      if (dragSource !== "CourseList") {
        //index of semester it was moved from
        movedFromIndex = +dragSource.split(" ")[1];
        course = semesters[movedFromIndex].courses.find(
          (item) => item.name === name
        );
      } else {
        //find the course by name in the master list of all courses
        course = courses.find((item) => item.name === name);
      }
      console.log(course);
      console.log(dragSource);
      //Could potentially add a duplicate if course is in schedule more than once
      setDroppedCourses(
        update(droppedCourses, course ? { $push: [course] } : { $push: [] })
      );
      // prereqCheck will be used to check prerequisites
      const prereqCheck = new StringProcessing();

      // Get all courses in previous semesters
      const previousCourses = getPreviousSemesterCourses(index);

      // Get all course subject and acronyms in current semester (excluding the course to be added)
      const currentCourses = new Array<string>();
      semesters[index].courses.forEach((x) => {
        currentCourses.push(x.subject + "-" + x.number);
      });

      // Run the prerequisite check on the course
      if (
        dragSource === "CourseList" &&
        !courseAlreadyInSemester(course, index)
      ) {
        if (
          prereqCheck.courseInListCheck(
            course.preReq,
            previousCourses,
            currentCourses
          )
        ) {
          // prereqCheck returned true, so add the course to the semester
          course.dragSource = "Semester " + index;
          setSemesters(
            update(semesters, {
              [index]: {
                lastDroppedItem: {
                  $set: item,
                },
                courses: {
                  $push: [course],
                },
              },
            })
          );
          //handleRemoveItem(course);
        } else {
          // fails to satisfy prerequisites
          //shows error message
          setVisibility(true);
        }
      }
      // Course was not found in the courses list, which means it currently occupies a semester
      else {
        //Find the course and its current residing index in the semesters list
        let preReqsSatisfied = true;
        if (course && movedFromIndex > -1) {
          // Course was moved from later to earlier
          if (movedFromIndex > index) {
            // Only check the prerequisites for the course itself that is being moved earlier
            preReqsSatisfied = prereqCheck.courseInListCheck(
              course.preReq,
              previousCourses,
              currentCourses
            );
          }
          // Course was moved from earlier to later
          else {
            // Check the prerequisites for all courses past (and including) the semester the course currently resides in
            preReqsSatisfied = preReqCheckCoursesInSemesterAndBeyond(
              course,
              movedFromIndex,
              index
            );
          }

          // Only proceed if the course isn't moved to the same semester
          if (
            movedFromIndex !== index &&
            !courseAlreadyInSemester(course, index)
          ) {
            // If the prereqs are satisfied, then move the course to the semester
            if (preReqsSatisfied) {
              // First update the semesters with the new course
              let updateSemester = new Array<SemesterState>();
              updateSemester = semesters;
              updateSemester[index].courses.push(course);
              updateSemester[index].lastDroppedItem = item;

              // Then remove the course from its previous semester spot
              let coursesRemove = updateSemester[movedFromIndex].courses.filter(
                (item) => item !== course
              );

              updateSemester[movedFromIndex].courses = coursesRemove;

              // Update the semester
              setSemestersOld(updateSemester);

              // Remove the course from the list, in case it did exist there too
              //handleRemoveItem(course);
            } else {
              // fails to satisfy prerequisites
              setVisibility(true);
            }
          }
        }
      }
    },
    [semesters]
  );

  //handle a drop into the course list from a semester
  const handleReturnDrop = useCallback(
    (item: { name: string; dragSource: string }) => {
      const { name } = item;
      const { dragSource } = item;
      console.log(dragSource);
      //ignore all drops from the course list
      if (dragSource !== "CourseList") {
        //get the semester index from the drag source
        let movedFromIndex = +dragSource.split(" ")[1];
        const found = semesters[movedFromIndex].courses.find(
          (item) => item.name === name
        );
        //set the drag source to course list (may be redundant but I'm scared to mess with it)
        found.dragSource = "CourseList";
        setDroppedCourses(courses.filter((item) => item.name !== name));
        // If all courses pass the preReq check, then update the course lists
        if (preReqCheckCoursesInSemesterAndBeyond(found, movedFromIndex, -1)) {
          setCourses(
            update(courses, found ? { $push: [found] } : { $push: [] })
          );

          // Update semesters to have the course removed
          let itemArr = semesters[movedFromIndex].courses.filter(
            (course) => course !== found
          );
          setSemesters(
            update(semesters, {
              [movedFromIndex]: {
                courses: {
                  $set: itemArr,
                },
              },
            })
          );
        } else {
          // fails to satisfy prerequisites
          setVisibility(true);
        }
      }
    },
    [courses, semesters]
  );

  // This function checks if every course passes the prerequisite check when moving a course
  // out of a semester
  function preReqCheckCoursesInSemesterAndBeyond(
    courseToRemove: Course,
    courseSemesterIndex: number,
    movedToIndex: number
  ): boolean {
    // prereqCheck will be used to check prerequisites
    const preReqCheck = new StringProcessing();

    // Get the course names in the previous semesters
    const previousCourses = getPreviousSemesterCourses(courseSemesterIndex);

    // Get the current courses in the current semester
    let currentCourses = getSemesterCourses(courseSemesterIndex);
    let currentCoursesNames = getSemesterCoursesNames(courseSemesterIndex);

    let preReqsSatisfied = true;
    let courseHasMoved = false;

    semesters.forEach((currSemester, index) => {
      if (
        preReqsSatisfied &&
        currSemester.semesterNumber - 1 >= courseSemesterIndex
      ) {
        // Check every course in the current semester passes the prerequsites
        currentCourses.forEach((x) => {
          preReqsSatisfied =
            preReqsSatisfied &&
            preReqCheck.courseInListCheck(
              x.preReq,
              previousCourses,
              currentCoursesNames
            );
        });

        // Append the current semester to the previous courses semester
        currentCoursesNames.forEach((x) => {
          // Additional check to ensure the removed course is not included in the course list
          if (x !== courseToRemove.subject + "-" + courseToRemove.number) {
            previousCourses.push(x);
          }
        });

        // If the course has been "mock-moved" and the prereq checks have been run on the semester
        // where the course has moved to, then we can now add the course to the previousCourses list
        if (courseHasMoved) {
          previousCourses.push(
            courseToRemove.subject + "-" + courseToRemove.number
          );
          courseHasMoved = false;
        }

        // Update the current course lists to be for the next semester
        if (
          index + 1 < semesters.length &&
          semesters[index + 1].courses !== undefined
        ) {
          currentCourses = getSemesterCourses(index + 1);
          currentCoursesNames = getSemesterCoursesNames(index + 1);
          // If the movedToIndex matches the next index, adjust the courses to include the course in question
          if (index + 1 === movedToIndex) {
            currentCourses.push(courseToRemove);
            currentCoursesNames.push(
              courseToRemove.subject + "-" + courseToRemove.number
            );
            courseHasMoved = true;
          }
        }
      }
    });

    return preReqsSatisfied;
  }

  function courseAlreadyInSemester(
    course: Course,
    semesterIndex: number
  ): boolean {
    let found = false;
    if (semesterIndex >= 0 || semesterIndex <= 8) {
      semesters[semesterIndex].courses.forEach((x) => {
        if (x === course) {
          found = true;
        }
      });
    }
    return found;
  }

  // Get all courses in previous semesters
  // param semesterIndex -> current semester index
  function getPreviousSemesterCourses(semesterIndex: number): Array<string> {
    let previousCourses = new Array<string>();
    semesters.forEach((currSemester) => {
      if (currSemester.semesterNumber - 1 < semesterIndex) {
        currSemester.courses.forEach((x) => {
          previousCourses.push(x.subject + "-" + x.number);
        });
      }
    });

    return previousCourses;
  }

  // Get all Course objects in current semester
  // param semesterIndex -> current semester index
  function getSemesterCourses(semesterIndex: number): Array<Course> {
    let semCourses = new Array<Course>();
    semesters[semesterIndex].courses.forEach((x) => {
      semCourses.push(x);
    });

    return semCourses;
  }

  // Get all courses (string) in current semester
  // param semesterIndex -> current semester index
  function getSemesterCoursesNames(semesterIndex: number): Array<string> {
    let semCourses = new Array<string>();
    semesters[semesterIndex].courses.forEach((x) => {
      semCourses.push(x.subject + "-" + x.number);
    });

    return semCourses;
  }

  // Displays in console the courses in each semester upon update
  // Feel free to comment this out to reduce spam in the console
  // useEffect(() => {
  //   semesters.forEach((x) => {
  //     console.log("Semester number:" + x.semesterNumber);
  //     if (x.courses) {
  //       x.courses.forEach((y) => {
  //         console.log("Course: " + y.name);
  //       });
  //     }
  //   });
  //   console.log("--------------");
  // }, [semesters]);

  // If the semesters needs to be updated, we will force update the semesters
  useEffect(() => {
    setSemesters(semestersOld);
  }, [semestersOld]);

  const popupCloseHandler = () => {
    setVisibility(false);
  };

  return (
    <div>
      <div className="drag-drop">
        <div style={{ overflow: "hidden", clear: "both" }}>
          <ErrorPopup
            onClose={popupCloseHandler}
            show={visibility}
            title="Error"
            error={"CANNOT MOVE COURSE! FAILS PREREQUISITES"}
          />
          {semesters.map(
            ({ accepts, lastDroppedItem, semesterNumber, courses }, index) => (
              <Semester
                accept={accepts}
                lastDroppedItem={lastDroppedItem}
                onDrop={(item) => handleDrop(index, item)}
                semesterNumber={semesterNumber}
                courses={courses}
                key={index}
              />
            )
          )}
        </div>
        <div
          style={{ overflow: "hidden", clear: "both" }}
          className="class-dropdown"
        >
          <div className="courseDropdowns">
            <div onClick={() => extractCategories()}>
              <SearchableDropdown
                options={categories}
                label="Category"
                onSelectOption={selectedCategory} //If option chosen, selected Category activated.
                showDropdown={true}
                thin={true}
              />
            </div>
          </div>
          {courseListElem.map(({ accepts }, index) => (
            <CourseList
              accept={accepts}
              onDrop={(item) => handleReturnDrop(item)}
              courses={coursesInCategory}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
