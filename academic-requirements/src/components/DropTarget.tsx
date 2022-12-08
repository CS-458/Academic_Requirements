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
import { TEXT } from "react-dnd-html5-backend/dist/NativeTypes";

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
    inheritedCredits: number;
    coursesTaken: string[];
    courseCountTaken: number;
    creditCountTaken: number;
  }[];
}

export const Container: FC<ContainerProps> = memo(function Container({
  PassedCourseList, //The combination of major, concentration, and gen ed
  CompletedCourses, //List of completed courses in subject-number format
  requirements, //List of requirements for major/concentration
  requirementsGen, //List of requirements for gen-eds
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
  const [errorMessage, setErrorMessage] = useState("");
  const [titleName, setTitle] = useState("");
  //A master list of all courses for the major, concentration, and gen eds
  const [courses, setCourses] = useState<Course[]>(PassedCourseList);
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

  //This is a janky way to force a req update
  const [completedReqRun, setCompletedReqRun] = useState(false);
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

      console.log("Managing Course:", course);

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

      // Run the prerequisite check on the course if dragged from the course list
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
          //Run fuction I need to write for checking semesters.
          checkForCourseInMultipleSemesters(course);
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
          checkRequirements(course, coursesInMultipleCategories);
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
      //
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
        setDroppedCourses(droppedCourses.splice(droppedCourses.indexOf(found)));
        // If all courses pass the preReq check, then update the course lists
        if (preReqCheckCoursesInSemesterAndBeyond(found, movedFromIndex, -1)) {
          setCourses(
            update(courses, found ? { $push: [found] } : { $push: [] })
          );

          // Update semesters to have the course removed
          let itemArr = semesters[movedFromIndex].courses.filter(
            (course) => course !== found
          );
          let count = 0;
          semesters.forEach((semester) => {
            semester.courses.forEach((course) => {
              if (course == found) {
                console.log(course);
                count++;
              }
            });
          });
          if (count == 1) {
            removeFromRequirements(found);
          }

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
      //Not sure if we still need this.
      //checkForCourseInMultipleSemesters(courses);
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
    semesters[semesterIndex].courses.forEach((x) => {
      semCourses.push(x);
    });

    return semCourses;
  }

  function checkForCourseInMultipleSemesters(course1) {
    //Iterate through array of courses dragged and dropped into semester
    semesters.map((semester, index) => {
      //If index of the course already dropped in the dropped course array is the same as
      //the current course being dropped, Display a message.
      semester.courses.map((course2, index) => {
        if (course1 == course2) {
          setTitle("Warning");
          setVisibility(true);
          setErrorMessage("Course already in other semesters.");
        }
      });
    });
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

  // If the semesters needs to be updated, we will force update the semesters
  useEffect(() => {
    setSemesters(semestersOld);
  }, [semestersOld]);

  const popupCloseHandler = () => {
    setVisibility(false);
  };

  //get all of the requirements and sort through the course list for courses
  //that can fullfill multiple categories
  useEffect(() => {
    let temp: Requirement[] = [];
    let tempReqList: Requirement[] = reqList;
    tempReqList.forEach((x) => {
      if (
        x.parentCategory == null &&
        !(
          x.courseReqs == null &&
          x.creditCount == null &&
          x.courseCount == null
        )
      ) {
        temp.push(x);
      } else {
        tempReqList.forEach((n) => {
          if (n.idCategory == x.parentCategory) {
            if (
              n.courseReqs == null &&
              n.creditCount == null &&
              n.courseCount == null
            ) {
              temp.push(x);
            }
          }
        });
      }

      if (x.parentCategory) {
        for (var i = 0; i < reqGenList.length; i++) {
          if (reqGenList[i].idCategory == x.parentCategory) {
            reqGenList[i].inheritedCredits = x.creditCount;
            if (reqGenList[i].courseReqs == null) {
              reqGenList[i].courseReqs = x.courseReqs;
            } else if (!reqGenList[i].courseReqs.includes(x.courseReqs)) {
              reqGenList[i].courseReqs =
                reqGenList[i].courseReqs + "," + x.courseReqs;
            }
            reqGenList[i].inheritedCredits = x.creditCount;

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
            tempCatArr.push(PassedCourseList[j].idCategory);
          }
        }
        if (tempCatArr.length > 1) {
          tempArr.push({ idString: currentIdString, categories: tempCatArr });
        }
      }
    }
    setCoursesInMultipleCategories(tempArr);
    setCompletedReqRun(true);
  }, [requirements, requirementsGen]);

  useEffect(()=>{
    console.log("This use effect started");
    if(completedReqRun){
      CompletedCourses.forEach((x)=>{
        console.log(x);
        let a = x.split("-");
        let found = PassedCourseList.find(item => item.subject == a[0] && item.number == parseInt(a[1]));
        checkRequirements(found, coursesInMultipleCategories);
      })
    }
  },[completedReqRun, requirementsDisplay])

  const removeFromRequirements = useCallback(
    (course: Course) => {
      console.log("starting remove");
      let temp1 = 1000;
      let temp2 = 1000;
      let temp3 = 1000;
      for (var i = 0; i < reqList.length; i++) {
        let courseString = course.subject + "-" + course.number;
        let index = reqList[i].coursesTaken.indexOf(courseString);
        if (index > -1) {
          reqList[i].coursesTaken.splice(index, 1);
          if (reqList[i].creditCount != null) {
            reqList[i].creditCountTaken =
              reqList[i].creditCountTaken - course.credits;
            temp1 = reqList[i].creditCountTaken / reqList[i].creditCount;
          }
          if (reqList[i].courseCount != null) {
            reqList[i].courseCountTaken = reqList[i].courseCountTaken - 1;
            temp2 = reqList[i].courseCountTaken / reqList[i].courseCount;
          }
          if (reqList[i].courseReqs != null) {
            let total = reqList[i].courseReqs.split(",").length;
            temp3 = reqList[i].coursesTaken.length / total;
          }
          //set the new percentage
          console.log(temp1 + " " + temp2 + " " + temp3);
          if (temp1 <= temp2 && temp1 <= temp3) {
            reqList[i].percentage = temp1 * 100;
          } else if (temp2 <= temp3 && temp2 <= temp1) {
            reqList[i].percentage = temp2 * 100;
          } else {
            reqList[i].percentage = temp3 * 100;
          }
        }
      }
      //check if the course is filling any gen-eds
      for (var i = 0; i < reqGenList.length; i++) {
        temp1 = 1000;
        temp2 = 1000;
        temp3 = 1000;
        let courseString = course.subject + "-" + course.number;
        let index = reqGenList[i].coursesTaken.indexOf(courseString);
        if (index > -1) {
          console.log("removing");
          console.log(reqGenList[i]);
          //remove the course from the requirment
          reqGenList[i].coursesTaken.splice(index, 1);
          if (reqGenList[i].creditCount != null) {
            console.log("Credits");
            reqGenList[i].creditCountTaken =
              reqGenList[i].creditCountTaken - course.credits;
            console.log(reqGenList[i].creditCountTaken);
            temp1 = reqGenList[i].creditCountTaken / reqGenList[i].creditCount;
          }
          if (reqGenList[i].courseCount != null) {
            reqGenList[i].courseCountTaken = reqGenList[i].courseCountTaken - 1;
            temp2 = reqGenList[i].courseCountTaken / reqGenList[i].courseCount;
          }
          if (reqGenList[i].courseReqs != null) {
            console.log("courseReqs");
            let total = reqGenList[i].courseReqs.split(",").length;
            temp3 = reqGenList[i].coursesTaken.length / total;
          }
          //set the new percentage
          console.log(temp1 + " " + temp2 + " " + temp3);
          if (
            temp1 <= temp2 &&
            temp1 <= temp3 &&
            reqGenList[i].creditCount != null
          ) {
            console.log("option 1");
            reqGenList[i].percentage = temp1 * 100;
          } else if (
            temp2 <= temp3 &&
            temp2 <= temp1 &&
            reqGenList[i].courseCount != null
          ) {
            console.log("option 2");
            reqGenList[i].percentage = temp2 * 100;
          } else {
            console.log("option 3");
            reqGenList[i].percentage = temp3 * 100;
          }
          console.log(reqGenList[i].percentage);
          var parentIndex = reqGenList.indexOf(
            reqGenList.find(
              (item) => item.idCategory === reqGenList[i].parentCategory
            )
          );
          console.log("parent index" + parentIndex);
          if (parentIndex != -1) {
            console.log(reqGenList[parentIndex]);
            if (reqGenList[parentIndex].idCategory == 25) {
              //ARNS
              //Must include one nat lab and one math/stat
              let percents: number[] = [];
              reqGenList.forEach((y) => {
                if (y.parentCategory == 25) {
                  if (
                    y.courseReqs != null ||
                    y.courseCount != null ||
                    y.creditCount != null
                  ) {
                    percents.push(y.percentage);
                  }
                }
              });
              console.log(percents);
              let sum = 0;
              percents.forEach((y) => {
                if (y == undefined) {
                  y = 0;
                }
                sum = sum + (y * 1) / percents.length;
              });
              console.log(sum);
              reqGenList[parentIndex].percentage = sum;
            }
            if (
              reqGenList[parentIndex].idCategory == 26 ||
              reqGenList[parentIndex].idCategory == 27
            ) {
              console.log("Running extra check");
              //ART/HUM or SBSCI
              //Must come from two different subcategories
              if (reqGenList[parentIndex].coursesTaken.length > 1) {
                let percents: number[] = [];
                reqGenList.forEach((y) => {
                  if (y.parentCategory == reqGenList[parentIndex].idCategory) {
                    if (
                      y.courseReqs != null ||
                      y.courseCount != null ||
                      y.creditCount != null
                    ) {
                      console.log(y);
                      percents.push(y.percentage);
                    }
                  }
                });
                console.log(percents);
                //at least one subcategory has it's own requirments that must
                //be satisfied as well
                if (percents.length > 1) {
                  let sum = 0;
                  percents.forEach((y) => {
                    if (y == undefined) {
                      y = 0;
                    }
                    sum = sum + y / percents.length;
                  });
                  reqGenList[parentIndex].percentage = sum;
                } else {
                  //no req subcat, just fill two different ones
                  let filledCategories = 0;
                  for (var i = 0; i < reqGenList.length; i++) {
                    if (
                      reqGenList[i].parentCategory ==
                      reqGenList[parentIndex].idCategory
                    ) {
                      if (
                        reqGenList[i].coursesTaken.length > 0 &&
                        reqGenList[i].idCategory !=
                          reqGenList[parentIndex].idCategory
                      ) {
                        filledCategories++;
                      }
                    }
                  }
                  //the courses are only from one category
                  if (filledCategories == 1) {
                    if (reqGenList[parentIndex].percentage > 50) {
                      reqGenList[parentIndex].percentage = 50;
                    }
                  } else if (percents.length == 1) {
                    //courses are from different categories one of which is required
                    reqGenList[parentIndex].percentage =
                      reqGenList[parentIndex].percentage / 2 + percents[0] / 2;
                  }
                }
              }
            }
          }
        }
      }
    },
    [reqList, reqGenList]
  );
  //TODO do the requirements define when a course can be taken twice for credit
  const checkRequirements = useCallback(
    (course: Course, multipleCategories: any) => {
      console.log(reqList);
      console.log(reqGenList);
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
      if (x.percentage == undefined) {
        x.percentage = 0;
      }
      //Check if this is the category of the course
      if (course.idCategory == x.idCategory) {
        console.log("Matched Category" + x.idCategory);
        //Check if a course has already been used for this requirement
        console.log(x.coursesTaken.indexOf(courseString));
        if (x.coursesTaken.indexOf(courseString) == -1) {
          console.log("Not already counted");
          let courseReqArr = x.courseReqs.split(",");
          //The only requirement is a course count
          if (x.courseCount && !x.courseReqs && !x.creditCount) {
            console.log("courses");
            x.courseCountTaken = x.courseCountTaken + 1;
            x.percentage = (x.courseCountTaken / x.courseCount) * 100;
          }
          //The only requirement is a courses required list
          if (!x.courseCount && x.courseReqs && !x.creditCount) {
            console.log("required courses");
            let validCourse = false;
            courseReqArr.forEach((item) => {
              let found = reqCheck.courseInListCheck(item, [courseString]);
              if (found) {
                validCourse = true;
              }
            });
            if (validCourse) {
              x.percentage = x.percentage + (1 / courseReqArr.length) * 100;
              console.log(x.percentage);
            }
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
            let validCourse = false;
            courseReqArr.forEach((item) => {
              let found = reqCheck.courseInListCheck(item, [courseString]);
              if (found) {
                validCourse = true;
              }
            });
            if (validCourse) {
              x.percentage = x.percentage + (1 / courseReqArr.length) * 100;
              console.log(x.percentage);
            }
          }
          //The requirement is a credit count and list of required courses
          if (!x.courseCount && x.courseReqs && x.creditCount) {
            console.log("credits and list");
            let temp1 = 1000;
            x.creditCountTaken = x.creditCountTaken + course.credits;
            let temp2 = (x.creditCountTaken / x.creditCount) * 100;
            let validCourse = false;
            courseReqArr.forEach((item) => {
              let found = reqCheck.courseInListCheck(item, [courseString]);
              if (found) {
                validCourse = true;
              }
            });
            if (validCourse) {
              temp2 = x.percentage + (1 / courseReqArr.length) * 100;
            }
            if (temp1 < temp2) {
              x.percentage = temp1;
            } else {
              x.percentage = temp2;
            }
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
              x.percentage = x.percentage + (1 / courseReqArr.length) * 100;
              console.log(x.percentage);
            }
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
              if (parent.creditCountTaken == undefined) {
                reqList[parentIndex].creditCountTaken = 0;
              }
              reqList[parentIndex].creditCountTaken += course.credits;
              temp1 =
                reqList[parentIndex].creditCountTaken /
                reqList[parentIndex].creditCount;
            }
            //update for number of courses
            if (parent.courseCount != null) {
              if (parent.courseCountTaken == undefined) {
                reqList[parentIndex].courseCountTaken = 0;
              }
              reqList[parentIndex].courseCountTaken += 1;
              temp2 =
                reqList[parentIndex].courseCountTaken /
                reqList[parentIndex].courseCount;
            }
            if (parent.courseReqs != null) {
              if (parent.coursesTaken == undefined) {
                reqList[parentIndex].coursesTaken = "";
              }
              reqList[parentIndex].coursesTaken =
                parent.coursesTaken + "," + courseString;
              courseReqArr = reqList[parentIndex].split(",");
              let validCourse = false;
              courseReqArr.forEach((item) => {
                let found = reqCheck.courseInListCheck(item, [courseString]);
                if (found) {
                  validCourse = true;
                }
              });
              if (validCourse) {
                reqList[parentIndex].percentage =
                  reqList[parentIndex].percentage +
                  (1 / courseReqArr.length) * 100;
              }
            } else {
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
            }
            if (reqList[parentIndex].percentage > 100) {
              reqList[parentIndex].percentage = 100;
            }
          }
          if (x.percentage > 100) {
            x.percentage = 100;
          }
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
        if (x.percentage == undefined) {
          x.percentage = 0;
        }
        //Check if this is the category of the course
        if (courseCategory == x.idCategory) {
          console.log("Matched Category" + x.idCategory);
          //Check if a course has already been used for this requirement
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
              let validCourse = false;
              courseReqArr.forEach((item) => {
                let found = reqCheck.courseInListCheck(item, [courseString]);
                if (found) {
                  validCourse = true;
                }
              });
              if (validCourse) {
                x.percentage = x.percentage + (1 / courseReqArr.length) * 100;
                console.log(x.percentage);
              }
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
              let validCourse = false;
              let temp1 = 0;
              let temp2 = 0;
              courseReqArr.forEach((item) => {
                let found = reqCheck.courseInListCheck(item, [courseString]);
                if (found) {
                  validCourse = true;
                }
              });
              if (validCourse) {
                //use course reqs as percent
                temp1 = x.percentage + (1 / courseReqArr.length) * 100;
              }
              //add credits
              x.courseCountTaken = x.courseCountTaken + 1;
              temp2 = (x.courseCountTaken / x.courseCount) * 100;
              if (temp1 > temp2) {
                x.percentage = temp2;
              } else {
                x.percentage = temp1;
              }
            }
            //The requirement is a credit count and list of required courses
            if (!x.courseCount && x.courseReqs && x.creditCount) {
              console.log("credits and list");
              let validCourse = false;
              let temp1 = 0;
              let temp2 = 0;
              courseReqArr.forEach((item) => {
                let found = reqCheck.courseInListCheck(item, [courseString]);
                if (found) {
                  validCourse = true;
                }
              });
              if (validCourse) {
                //use req courses as percentage
                temp1 = x.percentage + (1 / courseReqArr.length) * 100;
              }
              //add to course count but don't count it yet
              x.creditCountTaken = x.creditCountTaken + course.credits;
              temp2 = (x.creditCountTaken / x.creditCount) * 100;
              //set to lowest so we don't report complete if its not
              if (temp1 > temp2) {
                x.percentage = temp2;
              } else {
                x.percentage = temp1;
              }
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
              //update taken credits and course count
              x.creditCountTaken = x.creditCountTaken + course.credits;
              x.courseCountTaken = x.courseCountTaken + 1;
              let validCourse = false;
              let temp1 = 0;
              let temp2 = 0;
              let temp3 = 0;
              courseReqArr.forEach((item) => {
                let found = reqCheck.courseInListCheck(item, [courseString]);
                if (found) {
                  validCourse = true;
                }
              });
              if (validCourse) {
                temp1 = x.percentage + (1 / courseReqArr.length) * 100;
              }
              temp2 = (x.creditCountTaken / x.creditCount) * 100;
              temp3 = (x.courseCountTaken / x.courseCount) * 100;
              if (temp1 <= temp2 && temp1 <= temp3) {
                x.percentage = temp1;
              } else if (temp2 <= temp1 && temp2 <= temp3) {
                x.percentage = temp2;
              } else {
                x.percentage = temp3;
              }
            }
            x.coursesTaken.push(courseString);
            if (x.percentage > 100) {
              x.percentage = 100;
            }
            if (x.parentCategory) {
              console.log("Has a parent");
              let temp1 = 1000;
              let temp2 = 1000;
              let temp3 = 1000;
              let parent = reqGenList.find(
                (item) => item.idCategory === x.parentCategory
              );
              let parentIndex = reqGenList.indexOf(parent);
              reqGenList[parentIndex].coursesTaken.push(courseString);
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
              if (parent.courseReqs != null) {
                if (parent.coursesTaken == undefined) {
                  reqGenList[parentIndex].coursesTaken = "";
                }
                reqGenList[parentIndex].coursesTaken =
                  parent.coursesTaken + "," + courseString;
                courseReqArr = reqGenList[parentIndex].split(",");
                let validCourse = false;
                courseReqArr.forEach((item) => {
                  let found = reqCheck.courseInListCheck(item, [courseString]);
                  if (found) {
                    validCourse = true;
                  }
                });
                if (validCourse) {
                  temp3 =
                    reqGenList[parentIndex].percentage +
                    1 / courseReqArr.length;
                }
              }
              //use the lesser percentage so we don't report complete if it's not
              if (temp1 <= temp2 && temp1 <= temp3) {
                reqGenList[parentIndex].percentage = temp1 * 100;
              } else if (temp2 <= temp3 && temp2 <= temp1) {
                reqGenList[parentIndex].percentage = temp2 * 100;
              } else {
                reqGenList[parentIndex].percentage = temp3 * 100;
              }

              //Make necessary changes for the categories with extra requirements
              if (parent.idCategory == 23) {
                //RES courses
                //One must be RES A
                let foundRESA = false;
                parent.coursesTaken.forEach((y) => {
                  let tempArr = y.split("-");
                  //find this course where it is RES A (if it exists)
                  let courseFound = PassedCourseList.find(
                    (item) =>
                      item.subject === tempArr[0] &&
                      item.number === tempArr[1] &&
                      item.idCategory === 30
                  );
                  console.log("courseFound");
                  console.log(courseFound);
                  if (courseFound != undefined) {
                    //The course is RES A
                    foundRESA = true;
                  }
                });
                if (!foundRESA) {
                  if (reqGenList[parentIndex].percentage > 50) {
                    reqGenList[parentIndex].percentage = 50;
                  }
                }
              } else if (parent.idCategory == 25) {
                //ARNS
                //Must include one nat lab and one math/stat
                let percents: number[] = [];
                reqGenList.forEach((y) => {
                  if (y.parentCategory == 25) {
                    if (
                      y.courseReqs != null ||
                      y.courseCount != null ||
                      y.creditCount != null
                    ) {
                      percents.push(y.percentage);
                    }
                  }
                });
                console.log(percents);
                let sum = 0;
                percents.forEach((y) => {
                  if (y == undefined) {
                    y = 0;
                  }
                  sum = sum + (y * 1) / percents.length;
                });
                console.log(sum);
                reqGenList[parentIndex].percentage = sum;
              } else if (parent.idCategory == 26 || parent.idCategory == 27) {
                //ART/HUM or SBSCI
                //Must come from two different subcategories
                if (parent.coursesTaken.length > 1) {
                  let percents: number[] = [];
                  reqGenList.forEach((y) => {
                    if (y.parentCategory == parent.idCategory) {
                      if (
                        y.courseReqs != null ||
                        y.courseCount != null ||
                        y.creditCount != null
                      ) {
                        console.log(y);
                        percents.push(y.percentage);
                      }
                    }
                  });
                  console.log(percents);
                  //at least one subcategory has it's own requirments that must
                  //be satisfied as well
                  if (percents.length > 1) {
                    let sum = 0;
                    percents.forEach((y) => {
                      if (y == undefined) {
                        y = 0;
                      }
                      sum = sum + y / percents.length;
                    });
                    reqGenList[parentIndex].percentage = sum;
                  } else {
                    //no req subcat, just fill two different ones
                    let filledCategories = 0;
                    for (var i = 0; i < reqGenList.length; i++) {
                      if (reqGenList[i].parentCategory == parent.idCategory) {
                        if (
                          reqGenList[i].coursesTaken.length > 0 &&
                          reqGenList[i].idCategory != parent.idCategory
                        ) {
                          filledCategories++;
                        }
                      }
                    }
                    //the courses are only from one category
                    if (filledCategories == 1) {
                      if (parent.percentage > 50) {
                        parent.percentage = 50;
                      }
                    } else if (percents.length == 1) {
                      //courses are from different categories one of which is required
                      reqGenList[parentIndex].percentage =
                        parent.percentage / 2 + percents[0] / 2;
                    }
                  }
                }
              }
              if (reqGenList[parentIndex].percentage > 100) {
                reqGenList[parentIndex].percentage = 100;
              }
            }
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
            title={titleName}
            error={errorMessage}
          />
          <div className="schedule">
            {semesters.map(
              (
                { accepts, lastDroppedItem, semesterNumber, courses },
                index
              ) => (
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
        </div>
      </div>
    </div>
  );
});
