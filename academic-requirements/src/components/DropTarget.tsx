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
    id: number;
    idCategory: number;
  }[];
  CompletedCourses: string[];
  requirements: {
    courseCount: number;
    courseReqs: string;
    creditCount: number;
    idCategory: number;
    name: string;
    parentCategory: number;
    percentage: number;
    inheritedCredits;
    coursesTaken: string[];
    courseCountTaken: number;
    creditCountTaken: number;
  }[];
  requirementsGen: {
    courseCount: number;
    courseReqs: string;
    creditCount: number;
    idCategory: number;
    name: string;
    parentCategory: number;
    percentage: number;
    inheritedCredits;
    coursesTaken: string[];
    courseCountTaken: number;
    creditCountTaken: number;
  }[];
  fourYearPlan: {};
}

export const Container: FC<ContainerProps> = memo(function Container({
  PassedCourseList, //The combination of major, concentration, and gen ed
  CompletedCourses, //List of completed courses in subject-number format
  requirements, //List of requirements for major/concentration
  requirementsGen, //List of requirements for gen-eds
  fourYearPlan, // The four year plan if requested on Input page, or null
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
  const [warningPrerequisiteCourses, setWarningPrerequisiteCourses] = useState<
    Course[]
  >([]);
  const [warningFallvsSpringCourses, setWarningFallvsSpringCourses] = useState<
    Course[]
  >([]);
  const [warningDuplicateCourses, setWarningDuplicateCourses] = useState<
    Course[]
  >([]);
  // Warning for spring/fall semester
  const [updateWarning, setUpdateWarning] = useState<{
    course: Course;
    oldSemester: number;
    newSemester: number;
    draggedOut: boolean;
    newCheck: boolean;
  }>({
    course: undefined,
    oldSemester: -1,
    newSemester: -1,
    draggedOut: true,
    newCheck: false,
  });
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
  //Requirements that are manipulated
  const [reqList, setReqList] = useState<Requirement[]>(requirements);
  const [reqGenList, setReqGenList] = useState<Requirement[]>(requirementsGen);

  //A list of all courses that are in more than one categories, for use with requirements
  const [coursesInMultipleCategories, setCoursesInMultipleCategories] =
    useState<
      {
        idString: string;
        categories: number[];
      }[]
    >([]);

  //Stuff for category dropdown. Hovland 7Nov22
  const [category, setCategory] = useState(""); //category that is selected
  const [categories, setCategories] = useState<string[]>([]); //list of all categories
  const [coursesInCategory, setcoursesInCategory] = useState<Course[]>([]); //courses in category that is selected

  // Used to keep track of which information to display in the far right area
  const defaultInformationType = "Requirements (Calculated)"; // The default
  const [informationTypes, setInformationTypes] = useState<string[]>([
    defaultInformationType,
  ]);
  const [displayedInformationType, setDisplayedInformationType] =
    useState<string>(defaultInformationType);

  useEffect(() => {
    // Whenever completed courses may update, determine
    // whether we need to display it in the dropdown
    if (CompletedCourses.length > 0) {
      setInformationTypes((prevInformationTypes) => {
        // the ... is a spread operator and essentially means "take everything up to this point"
        if (!prevInformationTypes.includes("Completed Courses")) {
          return [...prevInformationTypes, "Completed Courses"];
        }
        return [...prevInformationTypes];
      });
    }
  }, [CompletedCourses]);

  useEffect(() => {
    if (fourYearPlan) {
      setInformationTypes((prevInformationTypes) => {
        // the ... is a spread operator and essentially means "take everything up to this point"
        if (!prevInformationTypes.includes("Requirements (Four Year Plan)")) {
          return [...prevInformationTypes, "Requirements (Four Year Plan)"];
        }
        return [...prevInformationTypes];
      });
    }
  }, [fourYearPlan]);

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
        if (!courseAlreadyInSemester(course, index)) {
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
      setUpdateWarning({
        course: course,
        oldSemester: courseAlreadyInSemester(course, index)
          ? movedFromIndex
          : -1,
        newSemester: index,
        draggedOut: false,
        newCheck: true,
      });
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
        setCourses(update(courses, found ? { $push: [found] } : { $push: [] }));

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
        setUpdateWarning({
          course: found,
          oldSemester: movedFromIndex,
          newSemester: -1,
          draggedOut: true,
          newCheck: true,
        });
      }
    },
    [courses, semesters]
  );

  // This function checks if the course that was moved is in a "valid" fall or spring semester
  function checkCourseSemester(course: Course, semNum: number) {
    return (
      (course.semesters === "FA" && semNum % 2 === 1) ||
      (course.semesters === "SP" && semNum % 2 === 0)
    );
  }

  // This useEffect is in charge of checking for duplicate courses
  useEffect(() => {
    if (updateWarning.newCheck) {
      let duplicateFound = false;
      // Compare each course to courses in future semesters to see if there are any duplicates
      semesters.forEach((semester, index) => {
        semester.courses.forEach((course) => {
          // If the course is found in future semesters, then it has a duplicate
          if (
            updateWarning.course === course &&
            updateWarning.newSemester !== index &&
            updateWarning.newSemester !== -1
          ) {
            // Show the warning
            setVisibility(true);
            setErrorMessage(
              "WARNING! " +
                course.subject +
                "_" +
                course.number +
                " is already in other semesters."
            );

            // Append the course to the duplicate warning courses list
            let temp = warningDuplicateCourses;
            temp.push(course);
            setWarningDuplicateCourses(temp);
            duplicateFound = true;
          }
        });
      });
      // If there was not a duplicate course found
      if (!duplicateFound) {
        // Remove the course from the duplicates warning list
        let temp = new Array<Course>();
        warningDuplicateCourses.forEach((x) => {
          if (x !== updateWarning.course) {
            temp.push(x);
          }
        });
        setWarningDuplicateCourses(temp);
      }
    }
    //Reset the warning
    setUpdateWarning({
      course: undefined,
      oldSemester: -1,
      newSemester: -1,
      draggedOut: true,
      newCheck: false,
    });
  }, [semesters]);

  // This useEffect handles fall vs spring course placement
  useEffect(() => {
    if (updateWarning.newCheck) {
      // Check if the course is offered in the semester it was dragged to
      if (
        checkCourseSemester(updateWarning.course, updateWarning.newSemester)
      ) {
        // If the course is not offered during the semester, add it to the warning course list
        if (
          !warningFallvsSpringCourses.find((x) => x === updateWarning.course)
        ) {
          warningFallvsSpringCourses.push(updateWarning.course);
          setVisibility(true);
          setErrorMessage(
            "WARNING! " +
              updateWarning.course.subject +
              "_" +
              updateWarning.course.number +
              " is not typically offered during the " +
              (updateWarning.newSemester % 2 === 0 ? "Fall" : "Spring") +
              " semester"
          );
        }
      }
      // Otherwise remove it from the warning course list
      else {
        let temp = new Array<Course>();
        let removeCourse = warningFallvsSpringCourses.find(
          (x) => x === updateWarning.course
        );
        warningFallvsSpringCourses.forEach((x) => {
          if (x !== removeCourse) {
            temp.push(x);
          }
        });
        setWarningFallvsSpringCourses(temp);
      }
    }
    //Reset the warning
    setUpdateWarning({
      course: undefined,
      oldSemester: -1,
      newSemester: -1,
      draggedOut: true,
      newCheck: false,
    });
  }, [semesters]);

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
            });
          }
          if (index === updateWarning.newSemester) {
            x.courses.forEach((y) => {
              currCourses.push(y.subject + "-" + y.number);
            });
          }
        });

        // Append the already taken courses
        CompletedCourses.forEach((x) => {
          pastCourses.push(x);
        });

        // Find if the course has met its prerequisites
        let stringProcess = new StringProcessing();
        satisfied = stringProcess.courseInListCheck(
          updateWarning.course.preReq,
          pastCourses,
          currCourses
        );

        // If the prereq for that moved course is not satisfied, have that course throw the error
        if (!satisfied.returnValue) {
          setVisibility(true);
          setErrorMessage(
            "WARNING! " +
              updateWarning.course.subject +
              "_" +
              updateWarning.course.number +
              " has failed the following prerequisites: " +
              satisfied.failedString
          );

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
    setUpdateWarning({
      course: undefined,
      oldSemester: -1,
      newSemester: -1,
      draggedOut: true,
      newCheck: false,
    });
  }, [semesters]);

  // This function checks if every course passes the prerequisite check when moving a course
  // out of a semester
  function preReqCheckAllCoursesPastSemester(
    courseToRemove: Course,
    courseSemesterIndex: number,
    showMessage: boolean,
    movedRight: boolean
  ): boolean {
    // prereqCheck will be used to check prerequisites
    const preReqCheck = new StringProcessing();

    // Get the course names in the previous semesters
    const previousCourses = getPreviousSemesterCourses(
      courseSemesterIndex === -1 ? 0 : courseSemesterIndex
    );

    // Get the current courses in the current semester
    let currentCourses = getSemesterCourses(
      courseSemesterIndex === -1 ? 0 : courseSemesterIndex
    );
    let currentCoursesNames = getSemesterCoursesNames(
      courseSemesterIndex === -1 ? 0 : courseSemesterIndex
    );

    let failedCoursesList = new Array();

    semesters.forEach((currSemester, index) => {
      if (currSemester.semesterNumber - 1 >= courseSemesterIndex) {
        // Check every course in the current semester passes the prerequisites and push any failed
        // prerequisites to the failedCoursesList
        currentCourses.forEach((x) => {
          if (
            !preReqCheck.courseInListCheck(
              x !== undefined ? x.preReq : "",
              previousCourses,
              currentCoursesNames
            ).returnValue
          ) {
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
        });
      }
    });

    //Remove any courses that were marked as warning, but now have resolved prerequisites
    if (!movedRight) {
      warningPrerequisiteCourses.forEach((currentWarningCourse) => {
        if (
          !initialPreviousCourses.find(
            (prevCourse) => prevCourse === currentWarningCourse
          )
        ) {
          failedCoursesList.forEach((currentFailedCourse) => {
            if (currentWarningCourse === currentFailedCourse) {
              found = true;
            }
          });

          // If the currently selected course in the warningCourses now passes the prerequisites
          if (!found) {
            let temp = new Array<Course>();
            // Replace warningCourses with all courses but the currently selected warningCourse
            tempWarningCourses.forEach((temporaryCurrentWarningCourse) => {
              // Carry on if the tempWarningCourse is not in a previous semester
              if (temporaryCurrentWarningCourse !== currentWarningCourse) {
                temp.push(temporaryCurrentWarningCourse);
              }
            });
            tempWarningCourses = temp;
          }
          found = false;
        }
      });

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
        message.length > 0
          ? (message = message + "," + x.subject + "-" + x.number)
          : (message = message + x.subject + "-" + x.number);
      });

      // Show a warning stating that the classes failed the prereqs
      if (
        !message.includes(courseToRemove.subject + "" + courseToRemove.number)
      ) {
        setVisibility(true);
        setErrorMessage(
          "WARNING! " +
            courseToRemove.subject +
            "_" +
            courseToRemove.number +
            " is a prerequisite for the following courses: " +
            message
        );
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

  const popupCloseHandler = () => {
    setVisibility(false);
  };

  //get all of the requirements and sort through the course list for courses
  //that can fullfill multiple categories
  useEffect(() => {
    let temp: Requirement[] = [];
    let tempReqList: Requirement[] = reqList;
    tempReqList.forEach((x) => {
      if (!x.parentCategory) {
        temp.push(x);
      } else {
        for (var i = 0; i < reqGenList.length; i++) {
          if (reqGenList[i].idCategory == x.parentCategory) {
            reqGenList[i].inheritedCredits = x.creditCount;
            if (reqGenList[i].courseReqs == null) {
              console.log("first Option");
              console.log(x.courseReqs);
              reqGenList[i].courseReqs = x.courseReqs;
            } else if (!reqGenList[i].courseReqs.includes(x.courseReqs)) {
              console.log("Second Option");
              console.log(x.courseReqs);
              reqGenList[i].courseReqs = reqGenList[i].courseReqs.concat(
                x.courseReqs
              );
            }
            tempReqList = tempReqList.filter(
              (item) => item.idCategory !== x.idCategory
            );
          }
        }
        setReqList(tempReqList);
      }
    });
    reqGenList.forEach((x) => {
      if (!x.parentCategory) {
        temp.push(x);
      }
    });
    setRequirementsDisplay(temp);

    //get the courses with more than one category they can satisfy
    var tempArr: {
      idString: string;
      categories: number[];
    }[] = [];
    //go through each item in the array to get any with duplicate categories
    for (var i = 0; i < PassedCourseList.length; i++) {
      let skip = false;
      //check that we havent already added this on to the array
      for (var k = 0; k < tempArr.length; k++) {
        if (
          PassedCourseList[i].subject + "-" + PassedCourseList[i].number ===
          tempArr[k].idString
        ) {
          skip = true;
        }
      }
      //only look for more if this one isn't recorded
      if (!skip) {
        let currentIdString =
          PassedCourseList[i].subject + "-" + PassedCourseList[i].number;
        let tempCatArr: number[] = [];
        for (var j = i; j < PassedCourseList.length; j++) {
          if (
            currentIdString ===
            PassedCourseList[j].subject + "-" + PassedCourseList[j].number
          ) {
            //console.log(PassedCourseList[j].name +" "+ PassedCourseList[j].idCategory);
            tempCatArr.push(PassedCourseList[j].idCategory);
          }
        }
        if (tempCatArr.length > 1) {
          tempArr.push({ idString: currentIdString, categories: tempCatArr });
        }
      }
    }

    setCoursesInMultipleCategories(tempArr);
    console.log(coursesInMultipleCategories);
  }, [requirements, requirementsGen]);

  //TODO do the requirements define when a course can be taken twice for credit
  //TODO if a major req has a parent in gen req transfer the course req list over
  const checkRequirements = useCallback(
    (course: Course, multipleCategories: any) => {
      console.log(reqList);
      console.log(reqGenList);
      console.log(multipleCategories);
      //check for any major/concentration reqs it can fill
      let Major = checkRequirementsMajor(course);
      if (!Major) {
        //check if it fills any unfilled gen-ed requirements
        checkRequirementsGen(course, multipleCategories);
      }
    },
    [reqList, reqGenList]
  );

  //Checks and updates major and concentration requirements
  function checkRequirementsMajor(course: Course): boolean {
    let courseString = course.subject + "-" + course.number;
    //determines whether course has fulfilled a major course and
    //shouldn't be check for a gen-ed req
    let addedCourse = false;
    const reqCheck = new StringProcessing();
    //run once or for each category the course is in
    for (var i = 0; i < reqList.length; i++) {
      let x = reqList[i];
      //initialize the variables if they aren't already
      if (x.coursesTaken == undefined) {
        x.coursesTaken = [];
      }
      if (x.creditCountTaken == undefined) {
        x.creditCountTaken = 0;
      }
      if (x.courseCountTaken == undefined) {
        x.courseCountTaken = 0;
      }
      //Check if this is the category of the course
      if (course.idCategory == x.idCategory) {
        console.log("Matched Category" + x.idCategory);
        //Check if a course has already been used for this requirement
        console.log(x.coursesTaken.indexOf(courseString));
        if (x.coursesTaken.indexOf(courseString) == -1) {
          console.log("Not already counted");
          //The only requirement is a course count
          if (x.courseCount && !x.courseReqs && !x.creditCount) {
            console.log("courses");
            x.courseCountTaken = x.courseCountTaken + 1;
            x.percentage = (x.courseCountTaken / x.courseCount) * 100;
          }
          //The only requirement is a courses required list
          if (!x.courseCount && x.courseReqs && !x.creditCount) {
            console.log("required courses");
            //TODO run some string processing
            console.log(
              reqCheck.courseInListCheck(x.courseReqs, [courseString])
            );
          }
          //The only requirement is a credit count
          if (!x.courseCount && !x.courseReqs && x.creditCount) {
            console.log("credits");
            x.creditCountTaken = x.creditCountTaken + course.credits;
            x.percentage = (x.creditCountTaken / x.creditCount) * 100;
          }
          //The requirement is a course count and a list of required courses
          if (x.courseCount && x.courseReqs && !x.creditCount) {
            console.log("course count with required courses");
            console.log(
              reqCheck.courseInListCheck(x.courseReqs, [courseString])
            );
          }
          //The requirement is a credit count and list of required courses
          if (!x.courseCount && x.courseReqs && x.creditCount) {
            console.log("credits and list");
            console.log(
              reqCheck.courseInListCheck(x.courseReqs, [courseString])
            );
          }
          //The requirement is a credit count and a course count
          if (x.courseCount && !x.courseReqs && x.creditCount) {
            console.log("credits and course count");
            x.courseCountTaken = x.courseCountTaken + 1;
            x.creditCountTaken = x.creditCountTaken + course.credits;
            let temp1 = (x.creditCountTaken / x.creditCount) * 100;
            let temp2 = (x.courseCountTaken / x.courseCount) * 100;
            if (temp1 > temp2) {
              x.percentage = temp2;
            } else {
              x.percentage = temp1;
            }
          }
          //The requirement is a credit count, a course count, and a course list
          if (x.courseCount && x.courseReqs && x.creditCount) {
            console.log("all three");
            console.log(
              reqCheck.courseInListCheck(x.courseReqs, [courseString])
            );
          }
          x.coursesTaken.push(courseString);
          addedCourse = true;
          console.log(x.parentCategory);
          if (x.parentCategory) {
            console.log("Has a parent");
            let temp1 = 1000;
            let temp2 = 1000;
            let parent = reqList.find(
              (item) => item.idCategory === x.parentCategory
            );
            let parentIndex = reqList.indexOf(parent);
            //update for credits
            if (parent.creditCount != null) {
              if (reqList[parentIndex].creditCountTaken == undefined) {
                reqList[parentIndex].creditCountTaken = 0;
              }
              reqList[parentIndex].creditCountTaken += course.credits;
              temp1 =
                reqList[parentIndex].creditCountTaken /
                reqList[parentIndex].creditCount;
            }
            //update for number of courses
            if (parent.courseCount != null) {
              if (reqList[parentIndex].courseCountTaken == undefined) {
                reqList[parentIndex].courseCountTaken = 0;
              }
              reqList[parentIndex].courseCountTaken += 1;
              temp2 =
                reqList[parentIndex].courseCountTaken /
                reqList[parentIndex].courseCount;
            }
            //use the lesser percentage so we don't report complete if it's not
            if (temp1 >= temp2) {
              reqList[parentIndex].percentage = temp2 * 100;
              console.log("percent");
              console.log(reqList[parentIndex]);
            } else {
              reqList[parentIndex].percentage = temp1 * 100;
              console.log("percent");
              console.log(reqList[parentIndex]);
            }
            console.log(reqList[parentIndex].percentage);
          }
          console.log("Courses taken " + x.coursesTaken);
        }
      }
    }
    return addedCourse;
  }

  //Checks and updates the gen-ed requirements
  function checkRequirementsGen(course: Course, multipleCategories: any) {
    let courseString = course.subject + "-" + course.number;
    console.log(
      multipleCategories.find((item) => item.idString === courseString)
    );
    let categories = multipleCategories.find(
      (item) => item.idString === courseString
    )?.categories;
    console.log("categories");
    console.log(categories);
    const reqCheck = new StringProcessing();
    //run once or for each category the course is in
    for (var n = 0; n < (categories ? categories.length : 1); n++) {
      let courseCategory = categories ? categories[n] : course.idCategory;
      for (var i = 0; i < reqGenList.length; i++) {
        let x = reqGenList[i];
        //initialize the variables if they aren't already
        if (x.coursesTaken == undefined) {
          x.coursesTaken = [];
        }
        if (x.creditCountTaken == undefined) {
          x.creditCountTaken = 0;
        }
        if (x.courseCountTaken == undefined) {
          x.courseCountTaken = 0;
        }
        //Check if this is the category of the course
        if (courseCategory == x.idCategory) {
          console.log("Matched Category" + x.idCategory);
          //Check if a course has already been used for this requirement
          console.log(x.coursesTaken.indexOf(courseString));
          if (x.coursesTaken.indexOf(courseString) == -1) {
            console.log("Not already counted");
            let courseReqArr: String[] = [];
            if (x.courseReqs) {
              courseReqArr = x.courseReqs.split(",");
            }
            //The only requirement is a course count
            if (x.courseCount && !x.courseReqs && !x.creditCount) {
              console.log("courses");
              x.courseCountTaken = x.courseCountTaken + 1;
              x.percentage = (x.courseCountTaken / x.courseCount) * 100;
            }
            //The only requirement is a courses required list
            if (!x.courseCount && x.courseReqs && !x.creditCount) {
              console.log("required courses");
              //TODO run some string processing
              console.log(
                reqCheck.courseInListCheck(x.courseReqs, [courseString])
              );
            }
            //The only requirement is a credit count
            if (!x.courseCount && !x.courseReqs && x.creditCount) {
              console.log("credits");
              x.creditCountTaken = x.creditCountTaken + course.credits;
              x.percentage = (x.creditCountTaken / x.creditCount) * 100;
            }
            //The requirement is a course count and a list of required courses
            if (x.courseCount && x.courseReqs && !x.creditCount) {
              console.log("course count with required courses");
              console.log(
                reqCheck.courseInListCheck(x.courseReqs, [courseString])
              );
            }
            //The requirement is a credit count and list of required courses
            if (!x.courseCount && x.courseReqs && x.creditCount) {
              console.log("credits and list");
              console.log(
                reqCheck.courseInListCheck(x.courseReqs, [courseString])
              );
            }
            //The requirement is a credit count and a course count
            if (x.courseCount && !x.courseReqs && x.creditCount) {
              console.log("credits and course count");
              x.courseCountTaken = x.courseCountTaken + 1;
              x.creditCountTaken = x.creditCountTaken + course.credits;
              let temp1 = (x.creditCountTaken / x.creditCount) * 100;
              let temp2 = (x.courseCountTaken / x.courseCount) * 100;
              if (temp1 > temp2) {
                x.percentage = temp2;
              } else {
                x.percentage = temp1;
              }
            }
            //The requirement is a credit count, a course count, and a course list
            if (x.courseCount && x.courseReqs && x.creditCount) {
              console.log("all three");
              let validCourse = false;
              courseReqArr.forEach((item) => {
                let found = reqCheck.courseInListCheck(item, [courseString]);
                if (found) {
                  validCourse = true;
                }
              });
              if (validCourse) {
                x.percentage = x.percentage + 1 / courseReqArr.length;
                console.log(x.percentage);
              }
              //console.log(reqCheck.courseInListCheck(x.courseReqs,[courseString]));
              //console.log('courseString' + [courseString]);
            }
            x.coursesTaken.push(courseString);

            console.log(x.parentCategory);
            if (x.parentCategory) {
              console.log("Has a parent");
              let temp1 = 1000;
              let temp2 = 1000;
              let parent = reqGenList.find(
                (item) => item.idCategory === x.parentCategory
              );
              let parentIndex = reqGenList.indexOf(parent);
              //update for credits
              if (parent.creditCount != null) {
                if (reqGenList[parentIndex].creditCountTaken == undefined) {
                  reqGenList[parentIndex].creditCountTaken = 0;
                }
                reqGenList[parentIndex].creditCountTaken += course.credits;
                temp1 =
                  reqGenList[parentIndex].creditCountTaken /
                  reqGenList[parentIndex].creditCount;
              }
              //update for number of courses
              if (parent.courseCount != null) {
                if (reqGenList[parentIndex].courseCountTaken == undefined) {
                  reqGenList[parentIndex].courseCountTaken = 0;
                }
                reqGenList[parentIndex].courseCountTaken += 1;
                temp2 =
                  reqGenList[parentIndex].courseCountTaken /
                  reqGenList[parentIndex].courseCount;
              }
              //use the lesser percentage so we don't report complete if it's not
              if (temp1 >= temp2) {
                reqGenList[parentIndex].percentage = temp2 * 100;
                console.log("percent");
                console.log(reqGenList[parentIndex]);
              } else {
                reqGenList[parentIndex].percentage = temp1 * 100;
                console.log("percent");
                console.log(reqGenList[parentIndex]);
              }
              console.log(reqGenList[parentIndex].percentage);
            }
            console.log("Courses taken " + x.coursesTaken);
          }
        }
      }
    }
  }
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
        <div className="right-information-box">
          <div className="right-information-box-header">
            <p
              style={{ textAlign: "center", padding: "0px", fontSize: "1.1em" }}
            >
              {displayedInformationType}
            </p>
            {informationTypes.length > 1 && (
              <SearchableDropdown
                options={informationTypes}
                label={null}
                onSelectOption={setDisplayedInformationType}
                showDropdown={true}
                thin={true}
              />
            )}
          </div>
          <div className="right-information-box-content">
            {displayedInformationType == "Requirements (Four Year Plan)" && (
              <>
                <p className="right-information-box-description">
                  The four year plan for your concentration recommends taking
                  courses in the following categories in the respective
                  semesters.
                </p>
                {Object.keys(fourYearPlan["ClassPlan"]).map((key, index) => {
                  if (
                    fourYearPlan["ClassPlan"][key]["Requirements"].length > 0
                  ) {
                    return (
                      <div style={{ margin: "5px" }} key={index}>
                        <p>{key}</p>
                        <p style={{ marginLeft: "10px", marginBottom: "25px" }}>
                          {fourYearPlan["ClassPlan"][key][
                            "Requirements"
                          ].toString()}
                        </p>
                      </div>
                    );
                  }
                })}
              </>
            )}
            {displayedInformationType == "Completed Courses" && (
              <>
                <p className="right-information-box-description">
                  These are courses you marked as complete.
                </p>
                {CompletedCourses?.map((completedCourse, index) => {
                  return (
                    <div className="info-box-completed-course">
                      <a
                        href={
                          "https://bulletin.uwstout.edu/content.php?filter%5B27%5D=" +
                          completedCourse.split("-")[0] +
                          "&filter%5B29%5D=" +
                          completedCourse.split("-")[1] +
                          "&filter%5Bcourse_type%5D=-1&filter%5Bkeyword%5D=&filter%5B32%5D=1&filter%5Bcpage%5D=1&cur_cat_oid=21&expand=&navoid=544&search_database=Filter#acalog_template_course_filter"
                        }
                        target="_blank"
                      >
                        {completedCourse}
                      </a>
                    </div>
                  );
                })}
              </>
            )}
            {displayedInformationType == "Requirements (Calculated)" && (
              <>
                <p className="right-information-box-description">
                  Select a category and drag a course onto a semester to begin
                  planning.
                </p>
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
                      inheritedCredits,
                      coursesTaken,
                      courseCountTaken,
                      creditCountTaken,
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
                      inheritedCredits={inheritedCredits}
                      coursesTaken={coursesTaken}
                      courseCountTaken={courseCountTaken}
                      creditCountTaken={creditCountTaken}
                      key={index}
                    />
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
