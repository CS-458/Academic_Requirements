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
//@ts-ignore
import { Requirement } from "./Requirement.tsx";

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
  CompletedCourses: string[];
  requirements: {
    courseCount: number;
    courseReqs: string;
    creditCount: number;
    idCategory: number;
    name: string;
    parentCategory: number;
  }[];
}

export const Container: FC<ContainerProps> = memo(function Container({
  PassedCourseList, //The combination of major, concentration, and gen ed
  CompletedCourses, //List of completed courses in subject-number format
  requirements, //List of requirements categories
}) {
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
  const [errorMessage, setErrorMessage] = useState("");
  //A master list of all courses for the major, concentration, and gen eds
  const [courses, setCourses] = useState<Course[]>(PassedCourseList);
  // A list of courses that should have a warning color on them
  const [warningPrerequisiteCourses, setWarningPrerequisiteCourses] = useState<Course[]>([]);
  const [warningFallvsSpringCourses, setWarningFallvsSpringCourses] = useState<Course[]>([]);
  const [warningDuplicateCourses, setWarningDuplicateCourses] = useState<Course[]>([]);
  // Warning for spring/fall semester
  const [updateWarning, setUpdateWarning] = useState<{course: Course, oldSemester: number, newSemester: number, draggedOut: boolean, newCheck: boolean}>({course: undefined, oldSemester: -1, newSemester: -1, draggedOut: true, newCheck: false});
  //A list of all courses that have been dropped into a semester
  const [droppedCourses, setDroppedCourses] = useState<Course[]>([]);
  //The course list element that allows courses to be dragged out
  const [courseListElem, setCourseListElem] = useState<CourseListState[]>([
    { accepts: [ItemTypes.COURSE], unDroppedItem: null, courses: [] },
  ]);

  //The list of requirements and their completion for display
  const [requirementsDisplay, setRequirementsDisplay] = useState<Requirement[]>(
    []
  );
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

  // Removes duplicate strings from an array
  function RemoveDuplicates(strings: string[]): string[] {
    return strings.filter((value, index, tempArr) => {
      return !tempArr.includes(value, index + 1);
    });
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

      //Could potentially add a duplicate if course is in schedule more than once
      setDroppedCourses(
        update(droppedCourses, course ? { $push: [course] } : { $push: [] })
      );

      // Get all course subject and acronyms in current semester (excluding the course to be added)
      const currentCourses = new Array<string>();
      semesters[index].courses.forEach((x) => {
        currentCourses.push(x.subject + "-" + x.number);
      });

      // Run the prerequisite check on the course if dragged from the course list
      if (
        dragSource === "CourseList" &&
        !courseAlreadyInSemester(course, index)
      ) {
        
        // Add the course to the semester
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
      }
      // Course was not found in the courses list, which means it currently occupies a semester
      else {
          // Only proceed if the course isn't moved to the same semester
          if (
            !courseAlreadyInSemester(course, index)
          ) {

            // Update the semester with the new dragged course
            let pushCourse = semesters[index].courses;
            pushCourse.push(course);

              setSemesters(
                update(semesters, {
                  [index]: {
                    courses: {
                      $set: pushCourse,
                    },
                  },
                })
              );

              // Then remove the course from its previous semester spot
              let coursesRemove = semesters[movedFromIndex].courses.filter(
                (item) => item !== course
              );

              setSemesters(
                update(semesters, {
                  [movedFromIndex]: {
                    lastDroppedItem: {
                      $set: item,
                    },
                    courses: {
                      $set: coursesRemove,
                    },
                  },
                })
              );
              
          }
        }
        setUpdateWarning({course: course, oldSemester: courseAlreadyInSemester(course, index) ? movedFromIndex : -1, newSemester: index, draggedOut: false , newCheck: true});
    },
    [semesters]
  );

  //handle a drop into the course list from a semester
  const handleReturnDrop = useCallback(
    (item: { name: string; dragSource: string }) => {
      const { name } = item;
      const { dragSource } = item;
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
          setUpdateWarning({course: found, oldSemester: movedFromIndex, newSemester: -1, draggedOut: true, newCheck: true});
        }
    },
    [courses, semesters]
  );

  // This function checks if the course that was moved is in a "valid" fall or spring semester
  function checkCourseSemester(course: Course, semNum: number) {
    return (course.semesters === 'FA' && semNum % 2 === 1) || (course.semesters === 'SP' && semNum % 2 === 0);
  }

  // This useEffect is in charge of checking for duplicate courses
  useEffect(() => {
    if (updateWarning.newCheck) {
    let duplicateFound = false;
    // Compare each course to courses in future semesters to see if there are any duplicates
    semesters.forEach((semester, index) => {
      semester.courses.forEach((course) => {

        // If the course is found in future semesters, then it has a duplicate
        if (updateWarning.course === course && updateWarning.newSemester !== index && updateWarning.newSemester !== -1) {
          // Show the warning
          setVisibility(true);
          setErrorMessage("WARNING! " + course.subject + "_" + course.number + " is already in other semesters.");

          // Append the course to the duplicate warning courses list
          let temp = warningDuplicateCourses;
          temp.push(course);
          setWarningDuplicateCourses(temp);
          duplicateFound = true;
        }
      })
    })
    // If there was not a duplicate course found
    if (!duplicateFound) {
      // Remove the course from the duplicates warning list
      let temp = new Array<Course>();
      warningDuplicateCourses.forEach((x) => {
        if (x !== updateWarning.course) {
          temp.push(x);
        }
      })
      setWarningDuplicateCourses(temp);
    }
  }
  //Reset the warning
  setUpdateWarning({course: undefined, oldSemester: -1, newSemester: -1, draggedOut: true, newCheck: false});
  },[semesters])

     // This useEffect handles fall vs spring course placement
     useEffect(() => {
      if (updateWarning.newCheck) {
        // Check if the course is offered in the semester it was dragged to
        if (checkCourseSemester(updateWarning.course, updateWarning.newSemester)) {
          // If the course is not offered during the semester, add it to the warning course list
          if (!(warningFallvsSpringCourses.find(x => x === updateWarning.course))) {
            warningFallvsSpringCourses.push(updateWarning.course);
            setVisibility(true);
            setErrorMessage("WARNING! " + updateWarning.course.subject + "_" + updateWarning.course.number + " is not typically offered during the " + ((updateWarning.newSemester % 2 === 0) ? "Fall" : "Spring") + " semester");
          }
        }
        // Otherwise remove it from the warning course list
        else {
          let temp = new Array<Course>();
          let removeCourse = warningFallvsSpringCourses.find((x) => x === updateWarning.course);
          warningFallvsSpringCourses.forEach((x) => {
            if (x !== removeCourse) {
              temp.push(x);
            }
          })
          setWarningFallvsSpringCourses(temp);
        }
      } 
      //Reset the warning
      setUpdateWarning({course: undefined, oldSemester: -1, newSemester: -1, draggedOut: true, newCheck: false});
    },[semesters]);


  // This useEffect is in charge of checking prerequisites
  useEffect(() => {
    if (updateWarning.newCheck) {

    // This will store if the prerequisites for the changed course have been satisfied
    let satisfied;
    // If the course is not dragged out, check its prerequisites
    if (!updateWarning.draggedOut) {
      // Get all courses in current semester and previous semesters
      let currCourses = new Array<string>();
      let pastCourses = new Array<string>();
      semesters.forEach((x, index) => {
        if (index < updateWarning.newSemester) {
          x.courses.forEach((y) => {
            pastCourses.push(y.subject + "-" + y.number);
          })
        }
        if (index === updateWarning.newSemester) {
          x.courses.forEach((y) => {
            currCourses.push(y.subject + "-" + y.number);
          })
        }
      })

      // Append the already taken courses
      CompletedCourses.forEach((x) => {
        pastCourses.push(x);
    });

    // Find if the course has met its prerequisites
      let stringProcess = new StringProcessing();
      satisfied = stringProcess.courseInListCheck(updateWarning.course.preReq, pastCourses, currCourses);

      // If the prereq for that moved course is not satisfied, have that course throw the error
      if (!satisfied.returnValue) {
        setVisibility(true);
        setErrorMessage("WARNING! " + updateWarning.course.subject + "_" + updateWarning.course.number + " has failed the following prerequisites: " + satisfied.failedString);
        
        // Update the warning courses to include the just dragged course
        let temp = warningPrerequisiteCourses;
        temp.push(updateWarning.course);
        setWarningPrerequisiteCourses(temp);
      }
    }

    // If the course has been dragged from earlier to later
    if (updateWarning.oldSemester < updateWarning.newSemester) {
      // Check all semesters past the old moved semester
      preReqCheckAllCoursesPastSemester(
        updateWarning.course,
        updateWarning.oldSemester,
        updateWarning.oldSemester === -1 ? false : satisfied.returnValue,
        true
      );
    } 
      // Check all semesters past the new moved semester
      preReqCheckAllCoursesPastSemester(
        updateWarning.course,
        updateWarning.newSemester,
        updateWarning.draggedOut,
        false
      );
  }
    //Reset the warning
    setUpdateWarning({course: undefined, oldSemester: -1, newSemester: -1, draggedOut: true, newCheck: false});
  }, [semesters]);

  // This function checks if every course passes the prerequisite check when moving a course
  // out of a semester
  function preReqCheckAllCoursesPastSemester(
    courseToRemove: Course,
    courseSemesterIndex: number,
    showMessage: boolean,
    movedRight: boolean,
  ): boolean {
    // prereqCheck will be used to check prerequisites
    const preReqCheck = new StringProcessing();

    // Get the course names in the previous semesters
    const previousCourses = getPreviousSemesterCourses(courseSemesterIndex === -1 ? 0 : courseSemesterIndex);

    // Get the current courses in the current semester
    let currentCourses = getSemesterCourses(courseSemesterIndex === -1 ? 0 : courseSemesterIndex);
    let currentCoursesNames = getSemesterCoursesNames(courseSemesterIndex === -1 ? 0 : courseSemesterIndex);
  
    let failedCoursesList = new Array();

    semesters.forEach((currSemester, index) => {
      if (
        currSemester.semesterNumber - 1 >= courseSemesterIndex
      ) {
        // Check every course in the current semester passes the prerequisites and push any failed
        // prerequisites to the failedCoursesList
        currentCourses.forEach((x) => {
            if (!preReqCheck.courseInListCheck(
              x !== undefined ? x.preReq : "",
              previousCourses,
              currentCoursesNames
            ).returnValue) {
              failedCoursesList.push(x);
            }
        });

        // Append the current semester to the previous courses semester
        currentCoursesNames.forEach((x) => {
            previousCourses.push(x);
        });

        // Update the current course lists to be for the next semester
        if (
          index + 1 < semesters.length &&
          semesters[index + 1].courses !== undefined
        ) {
          currentCourses = getSemesterCourses(index + 1);
          currentCoursesNames = getSemesterCoursesNames(index + 1);
        }
      }
    });

    // Prepping variables for modifying warningPrerequisitesCourses
    let found = false;
    let tempWarningCourses = warningPrerequisiteCourses;
    let initialPreviousCourses = new Array<Course>();

    // Add previous courses to initialPreviousCourses (the course object, not the strings)
    semesters.forEach((x, index) => {
      if (index < courseSemesterIndex) {
        x.courses.forEach((y) => {
          initialPreviousCourses.push(y);
      })
    }
    })

    //Remove any courses that were marked as warning, but now have resolved prerequisites
    if (!movedRight) {
    warningPrerequisiteCourses.forEach((currentWarningCourse) => {
      if (!initialPreviousCourses.find((prevCourse) => prevCourse === currentWarningCourse)) {
      failedCoursesList.forEach((currentFailedCourse) => {
        if (currentWarningCourse === currentFailedCourse) {
          found = true;
        }
      })

      // If the currently selected course in the warningCourses now passes the prerequisites
      if (!found) {
        let temp = new Array<Course>();
        // Replace warningCourses with all courses but the currently selected warningCourse
        tempWarningCourses.forEach((temporaryCurrentWarningCourse) => {
          // Carry on if the tempWarningCourse is not in a previous semester
            if (temporaryCurrentWarningCourse !== currentWarningCourse) {
              temp.push(temporaryCurrentWarningCourse);
            }
        })
        tempWarningCourses = temp;
      }
      found = false;
    }
    })

    // Update the warning courses to remove the currently now-satisifed prereqs course
    setWarningPrerequisiteCourses(tempWarningCourses);
  }

    // If any courses have failed, notify the user of each course that failed
    if (showMessage && failedCoursesList.length > 0) {
      let message = "";
      // Push each failed course to the warningCourses and modify the warning message
      failedCoursesList.forEach((x) => {
        if (!warningPrerequisiteCourses.find((z) => z === x)) {
          let temp = warningPrerequisiteCourses;
          temp.push(x);
          setWarningPrerequisiteCourses(temp);
        }
        message.length > 0 ?
        message = message + "," + x.subject + "-" + x.number : message = message + x.subject + "-" + x.number;
      });

      // Show a warning stating that the classes failed the prereqs
      if (!message.includes(courseToRemove.subject + "" + courseToRemove.number)) {
        setVisibility(true);
        setErrorMessage("WARNING! " + courseToRemove.subject + "_" + courseToRemove.number + " is a prerequisite for the following courses: " + message);
      }
    }

    return failedCoursesList.length === 0;
   }

  // Returns if a course is already in a semester's index
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
    if (semesterIndex > -1 && semesterIndex < 8) {
    semesters.forEach((currSemester) => {
      if (currSemester.semesterNumber - 1 < semesterIndex) {
        currSemester.courses.forEach((x) => {
          previousCourses.push(x.subject + "-" + x.number);
        });
      }
    });
  }

    // Append completed courses to the array
    CompletedCourses.forEach((x) => {
      previousCourses.push(x);
    });

    return previousCourses;
  }

  // Get all Course objects in current semester
  // param semesterIndex -> current semester index
  function getSemesterCourses(semesterIndex: number): Array<Course> {
    let semCourses = new Array<Course>();
    if (semesterIndex > -1 && semesterIndex < 8) {
    semesters[semesterIndex].courses.forEach((x) => {
      semCourses.push(x);
    });
  }
    return semCourses;
  }

  // Get all courses (string) in current semester
  // param semesterIndex -> current semester index
  function getSemesterCoursesNames(semesterIndex: number): Array<string> {
    let semCourses = new Array<string>();
    if (semesterIndex > -1 && semesterIndex < 8) {
    semesters[semesterIndex].courses.forEach((x) => {
      semCourses.push(x.subject + "-" + x.number);
    });
  }
    return semCourses;
  }

  // THE FOLLOWING USEEFFECTS CAN BE DELETED
  // Log the prerequisite warning courses (the ones that appear in yellow)
  useEffect(() => {
    console.log('Prereqs ' + warningPrerequisiteCourses);
  },[warningPrerequisiteCourses.length]);

  // Log the fall vs spring warning courses (the ones that appear in orange)
  useEffect(() => {
    console.log('FallvsSpring ' + warningFallvsSpringCourses);
  },[warningFallvsSpringCourses.length]);

  // Log the duplicate warning courses (the ones that appear in orange)
  useEffect(() => {
    console.log('Duplicates ' + warningDuplicateCourses);
  },[warningDuplicateCourses.length]);

  const popupCloseHandler = () => {
    setVisibility(false);
  };

  useEffect(() => {
    let temp: Requirement[] = [];
    requirements.forEach((x) => {
      if (!x.parentCategory) {
        temp.push(x);
      }
    });
    setRequirementsDisplay(temp);
  }, [requirements]);
  return (
    <div>
      <div className="drag-drop">
        <div style={{ overflow: "hidden", clear: "both" }}>
          <ErrorPopup
            onClose={popupCloseHandler}
            show={visibility}
            title={"Warning"}
            error={errorMessage}
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
                warningPrerequisiteCourses={warningPrerequisiteCourses}
                warningFallvsSpringCourses={warningFallvsSpringCourses}
                warningDuplicateCourses={warningDuplicateCourses}
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
        <div className="requirements">
          <p>Requirements</p>
          {requirementsDisplay?.map(
            (
              {
                name,
                courseCount,
                courseReqs,
                creditCount,
                idCategory,
                parentCategory,
                percentage,
              },
              index
            ) => (
              <Requirement
                courseCount={courseCount}
                courseReqs={courseReqs}
                creditCount={creditCount}
                idCategory={idCategory}
                name={name}
                parentCategory={parentCategory}
                percentage={percentage}
                key={index}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
});
