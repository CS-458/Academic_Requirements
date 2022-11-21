import update from "immutability-helper";
import { createContext, FC, useEffect } from "react";
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
import ErrorPopup from "./ErrorPopup";

interface SemesterState {
  accepts: string[];
  lastDroppedItem: any;
  number: number;
  courses: CourseState[];
}

interface CourseState {
  credits: number;
  name: string;
  number: number;
  semesters: string;
  subject: string;
  preReq: string;
}

interface CourseListState {
  accepts: string[];
  unDroppedItem: any;
}

export interface SemesterSpec {
  accepts: string[];
  lastDroppedItem: any;
  number: number;
}
export interface CourseSpec {
  credits: number;
  name: string;
  number: number;
  semesters: string;
  subject: string;
  preReq: string;
}

export interface CourseListSpec {
  accepts: string[];
  unDroppedItem: any;
}

export interface ContainerState {
  droppedCourses: Course[];
  semesters: SemesterSpec[];
  courses: CourseSpec[];
}

export interface ContainerProps {
  PassedCourseList: {
    credits: number;
    name: string;
    number: number;
    semesters: string;
    subject: string;
    preReq: string;
  }[];
}

export const Container: FC<ContainerProps> = memo(function Container({
  PassedCourseList,
}) {
  const [semestersOld, setSemestersOld] = useState<SemesterState[]>([
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 1,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 2,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 3,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 4,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 5,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 6,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 7,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 8,
      courses: [],
    },
  ]);
  const [semesters, setSemesters] = useState<SemesterState[]>([
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 1,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 2,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 3,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 4,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 5,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 6,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 7,
      courses: [],
    },
    {
      accepts: [ItemTypes.COURSE],
      lastDroppedItem: null,
      number: 8,
      courses: [],
    },
  ]);

  const [visibility, setVisibility] = useState(false);
  const [courses, setCourses] = useState<CourseState[]>(PassedCourseList);

  const [droppedCourses, setDroppedCourses] = useState<CourseState[]>([]);

  const [courseListElem, setCourseListElem] = useState<CourseListState[]>([
    { accepts: [ItemTypes.COURSE], unDroppedItem: null },
  ]);

  const handleRemoveItem = (e) => {
    setCourses(courses.filter((item) => item.name !== e));
  };

  const handleDrop = useCallback(
    (index: number, item: { name: string }) => {
      const { name } = item;
      let course = courses.find((item) => item.name === name);
      setDroppedCourses(
        update(droppedCourses, course ? { $push: [course] } : { $push: [] })
      );

      let itemArr = new Array<CourseState>();
      if (course) {
        itemArr.push(course);
      }

      // prereqCheck will be used to check prerequisites
      const prereqCheck = new StringProcessing();

      // Get all courses in previous semesters
      const previousCourses = getPreviousSemesterCourses(index);

      // Get all courses in current semester (excluding the course to be added)
      const currentCourses = new Array<string>();
      semesters[index].courses.forEach((x) => {
        currentCourses.push(x.subject + "-" + x.number);
      });

      // Run the prerequisite check on the course
      if (course) {
        if (
          prereqCheck.courseInListCheck(
            course.preReq,
            previousCourses,
            currentCourses
          )
        ) {
          // prereqCheck returned true, so add the course to the semester
          setSemesters(
            update(semesters, {
              [index]: {
                lastDroppedItem: {
                  $set: item,
                },
                courses: {
                  $push: itemArr,
                },
              },
            })
          );
          handleRemoveItem(name);
        } else {
          // fails to satisfy prerequisites
          setVisibility(true);
        }
      }
      // Course was not found in the courses list, which means it currently occupies a semester
      else {
        let course = courses.find((item) => item.name === name);

        //Find the course and its current residing index in the semesters list
        let movedFromIndex = -1;
        semesters.forEach((x, i) => {
          x.courses.forEach((y) => {
            if (y.name === item.name) {
              course = y;
              movedFromIndex = i;
            }
          });
        });

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
              movedFromIndex
            );
          }

          // If the prereqs are satisfied, then move the course to the semester
          if (preReqsSatisfied) {
            // NOTE!!!
            // The setSemesters is not updating correctly here. I will look at it at a later time.

            // First update the semesters with the new course
            let updateSemester = new Array<SemesterState>();
            updateSemester = semesters;

            updateSemester[index].courses.push(course);
            updateSemester[index].lastDroppedItem = item;

            // Then remove the course from its previous semester spot
            let coursesRemove = new Array<CourseState>();
            updateSemester[movedFromIndex].courses.forEach((x) => {
              if (x !== course) {
                coursesRemove.push(x);
              }
            });

            updateSemester[movedFromIndex].courses = coursesRemove;
            setSemestersOld(updateSemester);

            // Remove the course from the list, in case it did exist there too
            handleRemoveItem(name);
          } else {
            // fails to satisfy prerequisites
            setVisibility(true);
          }
        }
      }
    },
    [semesters]
  );

  const handleReturnDrop = useCallback(
    (item: { name: string }) => {
      const { name } = item;
      const found = droppedCourses.find((course) => course.name === name);
      setDroppedCourses(courses.filter((item) => item.name !== name));

      // Find the course's semester before moving it
      let courseSemesterIndex = -1;
      if (found) {
        semesters.forEach((sem, index) => {
          sem.courses.forEach((c) => {
            if (c.name === found.name) {
              courseSemesterIndex = index;
            }
          });
        });

        // If all courses pass the preReq check, then update the course lists
        if (preReqCheckCoursesInSemesterAndBeyond(found, courseSemesterIndex)) {
          setCourses(
            update(courses, found ? { $push: [found] } : { $push: [] })
          );

          // Update semesters to have the course removed
          let itemArr = new Array<CourseState>();
          if (found) {
            semesters[courseSemesterIndex].courses.forEach((x) => {
              if (x.name !== found.name) {
                itemArr.push(x);
              }
            });
          }
          setSemesters(
            update(semesters, {
              [courseSemesterIndex]: {
                courses: {
                  $set: itemArr,
                },
              },
            })
          );

          // Update the dropped courses to include the course that was moved out
          setDroppedCourses(
            update(droppedCourses, found ? { $push: [found] } : { $push: [] })
          );
        } else {
          // fails to satisfy prerequisites
          setVisibility(true);
        }
      }
    },
    [courses]
  );

  // This function checks if every course passes the prerequisite check when moving a course
  // out of a semester and into the course bank
  function preReqCheckCoursesInSemesterAndBeyond(
    courseToRemove: CourseState,
    courseSemesterIndex: number
  ): boolean {
    // prereqCheck will be used to check prerequisites
    const preReqCheck = new StringProcessing();

    // Get the course names in the previous semesters
    const previousCourses = getPreviousSemesterCourses(courseSemesterIndex);

    // Get the current courses in the current semester
    let currentCourses = getSemesterCourses(courseSemesterIndex);
    let currentCoursesNames = getSemesterCoursesNames(courseSemesterIndex);

    let preReqsSatisfied = true;

    semesters.forEach((currSemester, index) => {
      if (preReqsSatisfied && currSemester.number - 1 >= courseSemesterIndex) {
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

    return preReqsSatisfied;
  }

  // Get all courses in previous semesters
  // param semesterIndex -> current semester index
  function getPreviousSemesterCourses(semesterIndex: number): Array<string> {
    let previousCourses = new Array<string>();
    semesters.forEach((currSemester) => {
      if (currSemester.number - 1 < semesterIndex) {
        currSemester.courses.forEach((x) => {
          previousCourses.push(x.subject + "-" + x.number);
        });
      }
    });

    return previousCourses;
  }

  // Get all CourseState objects in current semester
  // param semesterIndex -> current semester index
  function getSemesterCourses(semesterIndex: number): Array<CourseState> {
    let semCourses = new Array<CourseState>();
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
  useEffect(() => {
    semesters.forEach((x) => {
      console.log("Semester number:" + x.number);
      if (x.courses) {
        x.courses.forEach((y) => {
          console.log("Course: " + y.name);
        });
      }
    });
    console.log("--------------");
  }, [semesters]);

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
            ({ accepts, lastDroppedItem, number, courses }, index) => (
              <Semester
                accept={accepts}
                lastDroppedItem={lastDroppedItem}
                onDrop={(item) => handleDrop(index, item)}
                number={number}
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
          {courseListElem.map(({ accepts }, index) => (
            <CourseList
              accept={accepts}
              onDrop={(item) => handleReturnDrop(item)}
              courses={courses}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
